<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Guest;
use App\Models\Room;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Illuminate\Support\Str;

class BookingController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Inertia::render(
            'Bookings/Index',
            ['bookings' => Booking::all()]
        );
    }

    /**
     * Show the form for searching room availability.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function search(Request $request)
    {
        $validator = Validator::make($request->query(), [
            'checkIn' => 'required|date|after:yesterday|date_format:Y-m-d',
            'checkOut' => 'required|date|before_or_equal:2022-12-31|date_format:Y-m-d',
            'persons' => 'required|integer|min:1'
        ]);


        if ($validator->fails()) {
            return Inertia::render(
                'Bookings/Search',
                [
                    'errors' => $validator->errors()
                ]
            );
        }

        $validated = $validator->validated();
        $persons = $validated['persons'];

        $checkIn = Carbon::parse($validated['checkIn']);
        $checkOut = Carbon::parse($validated['checkOut']);

        $rooms = Room::where('capacity', '>=', $persons)->get();
        $rooms = $rooms
            ->filter(function ($room) use ($checkIn, $checkOut) {
                return $room->checkAvailability($checkIn, $checkOut);
            })->values();

        return Inertia::render(
            'Bookings/Search',
            ['rooms' => $rooms]
        );
    }


    /**
     * Show the form for creating a new resource.

     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function create(Request $request)
    {
        $validator = Validator::make($request->query(), [
            'checkIn' => 'required|date|after:yesterday|date_format:Y-m-d',
            'checkOut' => 'required|date|before_or_equal:2022-12-31|date_format:Y-m-d',
            'roomId' => 'required|exists:rooms,id',
            'persons' => 'required|integer|min:1'
        ]);


        if ($validator->fails()) {
            return redirect('/search');
        }

        $validated = $validator->validated();

        $checkIn = Carbon::parse($validated['checkIn']);
        $checkOut = Carbon::parse($validated['checkOut']);

        $room = Room::findOrFail($validated['roomId']);
        $persons = (int) $validated['persons'];

        if (!$room->checkAvailability($checkIn, $checkOut) || $persons > $room->capacity) {
            $request->session()->flash('error', 'Invalid room selection');

            return redirect('/search');
        }

        return Inertia::render(
            'Bookings/Create',
            compact('checkIn', 'checkOut', 'room', 'persons')
        );
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'checkIn' => 'required|date|after:yesterday|date_format:Y-m-d',
            'checkOut' => 'required|date|before_or_equal:2022-12-31|date_format:Y-m-d',
            'fullName' => 'required',
            'email' => 'required|email',
            'phoneNumber' => 'required',
            'roomId' => 'required|exists:rooms,id',
            'persons' => 'required|integer|min:1'
        ]);

        $booking = Booking::make($validated);
        $room = Room::findOrFail($validated['roomId']);
        $guest = Guest::create($validated);

        $checkIn = Carbon::parse($validated['checkIn']);
        $checkOut = Carbon::parse($validated['checkOut']);

        if (!$room->checkAvailability($checkIn, $checkOut) || $booking->persons > $room->capacity) {
            $request->session()->flash('error', 'Invalid room selection');
            return redirect('/search');
        }

        $booking->identifier = Str::random(10);
        $booking->totalPrice = $room->dailyPrice * $checkIn->diff($checkOut)->days;
        $booking->checkIn = $checkIn;
        $booking->checkOut = $checkOut;
        $booking->guest()->associate($guest);
        $booking->room()->associate($room);
        $booking->createdAt = now();

        $booking->save();

        $request->session()->flash('message', 'Created a new Booking');

        return redirect('/');
    }


    /**
     * Remove the specified resource from storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, string $id)
    {
        $booking = Booking::findOrFail($id);

        $booking->delete();

        $request->session()->flash('message', 'Booking deleted');

        return redirect('/');
    }
}

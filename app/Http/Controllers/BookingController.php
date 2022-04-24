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
            'check-in' => 'required|date',
            'check-out' => 'required|date',
            'persons' => 'required|integer|min:1|max:4'
        ]);


        if ($validator->fails()) {
            return Inertia::render(
                'Bookings/Search',
                [
                    'rooms' => [],
                    'errors' => $validator->errors()
                ]
            );
        }

        $validated = $validator->validated();
        $persons = $validated['persons'];
        $checkIn = Carbon::create($validated['check-in']);
        $checkOut = Carbon::create($validated['check-out']);

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
            'check-in' => 'required|date',
            'check-out' => 'required|date',
            'roomId' => 'required|exists:rooms,id',
            'persons' => 'required|integer|min:1|max:4'
        ]);


        if ($validator->fails()) {
            return redirect('/search');
        }

        $validated = $validator->validated();

        $checkIn = Carbon::create($validated['check-in']);
        $checkOut = Carbon::create($validated['check-out']);
        $room = Room::findOrFail($validated['roomId']);
        $persons = (int) $validated['persons'];

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
            'checkIn' => 'required|date',
            'checkOut' => 'required|date',
            'fullName' => 'required|min:4',
            'email' => 'required|email',
            'phoneNumber' => 'required',
            'roomId' => 'required|exists:rooms,id',
            'persons' => 'required|integer|min:1|max:4'
        ]);

        $booking = Booking::make($validated);
        $room = Room::findOrFail($validated['roomId']);
        $guest = Guest::create($validated);

        $checkIn = Carbon::create($validated['checkIn']);
        $checkOut = Carbon::create($validated['checkOut']);

        $booking->identifier = Str::random(10);
        $booking->totalPrice = $room->dailyPrice * $checkIn->diff($checkOut)->days;
        $booking->guest()->associate($guest);
        $booking->room()->associate($room);
        $booking->createdAt = now();

        $booking->save();

        return redirect('/');
    }
}

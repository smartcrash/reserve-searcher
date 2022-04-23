<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Room;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

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
            'persons' => 'required|integer'
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
        extract($validated);

        $rooms = Room::where('capacity', '>=', $persons)->get();

        return Inertia::render(
            'Bookings/Search',
            compact('rooms', 'validated')
        );
    }


    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return Inertia::render(
            'Bookings/Create',
            []
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
        //
    }
}

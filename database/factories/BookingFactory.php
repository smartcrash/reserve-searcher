<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class BookingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $room = DB::table('rooms')->get()->random();
        $guest = DB::table('guests')->get()->random();

        return [
            'identifier' => Str::random(10),
            'checkIn' => now(),
            'checkOut' => now()->addDay(1),
            'totalPrice' => $room->dailyPrice,
            'persons' => rand(1, $room->capacity),
            'roomId' => $room->id,
            'guestId' => $guest->id,
            'createdAt' => now(),
        ];
    }
}

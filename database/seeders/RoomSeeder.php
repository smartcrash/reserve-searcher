<?php

namespace Database\Seeders;

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Seeder;

class RoomSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $singles = collect(array_fill(0, 10, ['capacity' => 1, 'dailyPrice' => 20]));
        $doubles = collect(array_fill(0, 5, ['capacity' => 2, 'dailyPrice' => 30]));
        $triples = collect(array_fill(0, 4, ['capacity' => 3, 'dailyPrice' => 40]));
        $quadruples = collect(array_fill(0, 6, ['capacity' => 4, 'dailyPrice' => 50]));

        $rooms = collect([])
            ->concat($singles)
            ->concat($doubles)
            ->concat($triples)
            ->concat($quadruples)
            ->map(function ($room, $index) {
                $room['number'] = $index  + 1;

                return $room;
            })->toArray();

        DB::table('rooms')->insert($rooms);
    }
}

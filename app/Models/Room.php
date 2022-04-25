<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    use HasFactory;

    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'number',
        'capacity',
        'dailyPrice',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'capacity' => 'int',
        'dailyPrice' => 'double',
    ];

    /**
     * Get the bookings that belongs to the room
     */
    public function bookings()
    {
        return $this->hasMany(Booking::class, 'roomId');
    }


    /**
     * Check if a given room is available for the given range of dates
     *
     *
     * @param  \Illuminate\Http\Request  $request
     * @param \Carbon\Carbon $checkIn
     * @param \Carbon\Carbon $checkOut
     * @return bool
     */
    public function checkAvailability(Carbon $checkIn, Carbon $checkOut): bool
    {
        $leftDate = $checkIn->copy()->subDay(1)->format('Y-m-d');
        $rightDate = $checkOut->copy()->addDay(1)->format('Y-m-d');

        $bookings = $this
            ->bookings()
            ->where(function ($query) use ($leftDate, $rightDate) {
                $query
                    ->orWhere(function ($query) use ($leftDate, $rightDate) {
                        $query->whereBetween('checkIn', [$leftDate, $rightDate]);
                        // $query
                        //     ->whereDate('checkIn', '>', $leftDate)
                        //     ->whereDate('checkIn', '<', $rightDate);
                    })
                    ->orWhere(function ($query) use ($leftDate, $rightDate) {
                        $query->whereBetween('checkOut', [$leftDate, $rightDate]);
                        // $query
                        //     ->whereDate('checkOut', '>', $leftDate)
                        //     ->whereDate('checkOut', '<', $rightDate);
                    })
                    ->orWhere(function ($query) use ($leftDate, $rightDate) {
                        $query
                            ->whereDate('checkIn', '<', $leftDate)
                            ->whereDate('checkOut', '>', $rightDate);
                    });
            })->get();

        return !$bookings->count();
    }
}

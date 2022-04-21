<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    public $timestamps = false;

    /**
     * The relations to eager load on every query.
     * @var array
     */
    protected $with = ['guest', 'room'];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'startDate',
        'endDate',
        'totalPrice',
        'guestCount',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'totalPrice' => 'double',
        'guestCount' => 'int',
        'guestId' => 'int',
        'roomId' => 'int',
        'startDate' => 'datetime',
        'endDate' => 'datetime',
        'createdAt' => 'datetime',
    ];

    /**
     * Get the guest that owns to booking
     */

    public function guest()
    {
        return $this->belongsTo(Guest::class, 'guestId');
    }


    /**
     * Get the room that owns to booking
     */
    public function room()
    {
        return $this->belongsTo(Room::class, 'roomId');
    }
}

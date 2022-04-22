<?php

namespace Tests\Browser;

use App\Models\Booking;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;

function getRoomType(int $capacity)
{
    return ([
        1 => "single",
        2 => "double",
        3 => "triple",
        4 => "quadruple",
    ])[$capacity];
}

class IndexTest extends DuskTestCase
{
    use DatabaseMigrations;

    protected function setUp(): void
    {
        parent::setUp();
        $this->artisan('db:seed');
    }

    public function test_can_view_bookings()
    {
        $this->browse(function (Browser $browser) {
            $bookings = Booking::all();

            $browser->visit('/');

            foreach ($bookings as $booking) {
                $browser->with("[data-testid='booking-$booking->id']", function ($item) use ($booking) {
                    $item
                        ->assertSee(Carbon::create($booking->startDate)->format('d/m/Y'))
                        ->assertSee(Carbon::create($booking->endDate)->format('d/m/Y'))
                        ->assertSee(ucfirst(getRoomType($booking->room->capacity)))
                        ->assertSee($booking->guestCount)
                        ->assertSee($booking->guest->fullName)
                        ->assertSee($booking->guest->email)
                        ->assertSee($booking->guest->phoneNumber)
                        ->assertSee(number_format($booking->totalPrice, 2, ',', '.') . ' €')
                        ->assertSee($booking->identifier)
                        ->assertSee('#' . str_pad($booking->room->number, 2, '0', STR_PAD_LEFT));
                });
            }
        });
    }

    // public function test_can_navigate_to_create_booking()
    // {
    //     $this->browse(function (Browser $browser) {
    //         $browser->visit('/');
    //     });
    // }
}

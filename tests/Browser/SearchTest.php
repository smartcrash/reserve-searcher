<?php

namespace Tests\Browser;

use App\Models\Booking;
use App\Models\Room;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;

class SearchTest extends DuskTestCase
{
    use DatabaseMigrations;

    protected function setUp(): void
    {
        parent::setUp();
        $this->artisan('db:seed');
    }


    public function test_can_filter_rooms_by_capacity()
    {
        $this->browse(function (Browser $browser) {
            $baseUrl = ('/search?check-in=' . urlencode(now()->toDateString()) . '&check-out=' . urlencode(now()->toDateString()));

            $browser->visit($baseUrl . '&persons=1')
                ->assertSee('Single')
                ->press('Next')
                ->assertSee('Double')
                ->assertSee('Triple')
                ->assertSee('Quadruple')
                //
                ->visit($baseUrl . '&persons=2')
                ->assertSee('Double')
                ->assertSee('Triple')
                ->assertSee('Quadruple')
                //
                ->visit($baseUrl . '&persons=3')
                ->assertDontSee('Single')
                ->assertDontSee('Double')
                ->assertSee('Triple')
                ->assertSee('Quadruple')
                //
                ->visit($baseUrl . '&persons=4')
                ->assertDontSee('Single')
                ->assertDontSee('Double')
                ->assertDontSee('Triple')
                ->assertSee('Quadruple');
        });
    }

    public function test_can_only_see_available_rooms()
    {
        $this->browse(function (Browser $browser) {
            Booking::query()->delete();
            Room::query()->delete();

            Room::create(['capacity' => 1, 'dailyPrice' => 20, 'number' => 1]);
            Booking::factory()->count(1)->create();
            Room::create(['capacity' => 1, 'dailyPrice' => 20, 'number' => 2]);

            $booking = Booking::all()->first();
            $bookedRoom = $booking->room;
            $availableRoom = Room::orderBy('id', 'desc')->get()->first();

            $checkIn = now()->toDateString();
            $checkOut = now()->addDay(1)->toDateString();
            $persons = 1;

            $browser
                ->visit('/search?check-in=' . urlencode($checkIn) . '&check-out=' . urlencode($checkOut) . '&persons=' . $persons)
                ->assertDontSee(str_pad($bookedRoom->number, 2, '0', STR_PAD_LEFT))
                ->assertSee(str_pad($availableRoom->number, 2, '0', STR_PAD_LEFT));
        });
    }

    public function test_can_navigate_create_booking_by_clicking_room()
    {
        $this->browse(function (Browser $browser) {
            $room = Room::get()->first();

            $checkIn = now()->toDateString();
            $checkOut = now()->addDay(1)->toDateString();
            $persons = 1;

            $browser
                ->visit('/search?check-in=' . urlencode($checkIn) . '&check-out=' . urlencode($checkOut) . '&persons=' . $persons)
                ->click("[data-testid='room-$room->id']")
                ->pause(500)
                ->assertPathIs('/new')
                ->assertQueryStringHas('check-in', $checkIn)
                ->assertQueryStringHas('check-out', $checkOut)
                ->assertQueryStringHas('roomId', $room->id)
                ->assertQueryStringHas('persons', $persons);
        });
    }
}

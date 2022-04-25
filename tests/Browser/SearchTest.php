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
                ->assertSeeIn('[data-testid="table"]', 'Double')
                ->assertSeeIn('[data-testid="table"]', 'Triple')
                ->assertSeeIn('[data-testid="table"]', 'Quadruple')
                //
                ->visit($baseUrl . '&persons=2')
                ->assertDontSeeIn('[data-testid="table"]', 'Single')
                ->assertSeeIn('[data-testid="table"]', 'Double')
                ->assertSeeIn('[data-testid="table"]', 'Triple')
                ->assertSeeIn('[data-testid="table"]', 'Quadruple')
                //
                ->visit($baseUrl . '&persons=3')
                ->assertDontSeeIn('[data-testid="table"]', 'Single')
                ->assertDontSeeIn('[data-testid="table"]', 'Double')
                ->assertSeeIn('[data-testid="table"]', 'Triple')
                ->assertSeeIn('[data-testid="table"]', 'Quadruple')
                //
                ->visit($baseUrl . '&persons=4')
                ->assertDontSeeIn('[data-testid="table"]', 'Single')
                ->assertDontSeeIn('[data-testid="table"]', 'Double')
                ->assertDontSeeIn('[data-testid="table"]', 'Triple')
                ->assertSeeIn('[data-testid="table"]', 'Quadruple');
        });
    }

    public function test_can_only_see_available_rooms_1()
    {
        $this->browse(function (Browser $browser) {
            Booking::query()->delete();
            Room::query()->delete();

            $room_1 = Room::create(['capacity' => 1, 'dailyPrice' => 20, 'number' => 1]);
            $room_2 = Room::create(['capacity' => 1, 'dailyPrice' => 20, 'number' => 2]);

            $booking = Booking::factory()->make();
            $booking->checkIn  = now();
            $booking->checkOut  = now()->addDay(1);
            $booking->room()->associate($room_1);
            $booking->save();

            $dateLeft = now()->toDateString();
            $dateRight = now()->addDay(1)->toDateString();
            $persons = 1;

            $browser
                ->visit('/search?check-in=' . urlencode($dateLeft) . '&check-out=' . urlencode($dateRight) . '&persons=' . $persons)
                ->assertDontSeeIn('[data-testid="table"]', str_pad($room_1->number, 2, '0', STR_PAD_LEFT))
                ->assertSeeIn('[data-testid="table"]', str_pad($room_2->number, 2, '0', STR_PAD_LEFT));
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

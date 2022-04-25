<?php

namespace Tests\Browser;

use App\Models\Booking;
use App\Models\Room;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;
use PhpParser\Node\Expr\Cast\Bool_;
use Tests\DuskTestCase;

class SearchTest extends DuskTestCase
{
    use DatabaseMigrations;

    protected function setUp(): void
    {
        parent::setUp();
        $this->artisan('db:seed');
    }


    public function test_can_navigate_create_booking_by_clicking_room()
    {
        $this->browse(function (Browser $browser) {
            $room = Room::get()->first();

            $checkIn = now()->format('Y-m-d');
            $checkOut = now()->addDay(1)->format('Y-m-d');
            $persons = 1;

            $url = route('search', compact('checkIn', 'checkOut', 'persons'), false);

            $browser
                ->visit($url)
                ->click("[data-testid='room-$room->id']")
                ->pause(500)
                ->assertPathIs('/new')
                ->assertQueryStringHas('checkIn', $checkIn)
                ->assertQueryStringHas('checkOut', $checkOut)
                ->assertQueryStringHas('roomId', $room->id)
                ->assertQueryStringHas('persons', $persons);
        });
    }

    public function test_can_filter_rooms_by_capacity()
    {
        $this->browse(function (Browser $browser) {
            $checkIn = now()->format('Y-m-d');
            $checkOut = now()->format('Y-m-d');

            $baseUrl = route('search', compact('checkIn', 'checkOut'), false);

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

    /**
     * Should not see room with conflicting startDate and endDate
     *
     * @return void
     */
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

            $dateLeft = now()->format('Y-m-d');
            $dateRight = now()->addDay(1)->format('Y-m-d');
            $persons = 1;

            $url = route('search', [
                'checkIn' => $dateLeft,
                'checkOut' => $dateRight,
                'persons' => $persons,
            ], false);

            $browser
                ->visit($url)
                ->assertDontSeeIn('[data-testid="table"]', '#' .  str_pad($room_1->number, 2, '0', STR_PAD_LEFT))
                ->assertSeeIn('[data-testid="table"]', '#' .  str_pad($room_2->number, 2, '0', STR_PAD_LEFT));
        });
    }


    /**
     * Should not see room with conflicting startDate
     *
     * @return void
     */
    public function test_can_only_see_available_rooms_2()
    {
        $this->browse(function (Browser $browser) {
            Booking::query()->delete();
            Room::query()->delete();

            $room_1 = Room::create(['capacity' => 1, 'dailyPrice' => 20, 'number' => 1]);
            $room_2 = Room::create(['capacity' => 1, 'dailyPrice' => 20, 'number' => 2]);

            $checkIn  = now()->addDay(3);
            $checkOut  = $checkIn->addDay(2);

            $booking = Booking::factory()->make();
            $booking->checkIn = $checkIn;
            $booking->checkOut = $checkOut;
            $booking->room()->associate($room_1);
            $booking->save();

            $dateLeft = $checkIn->format('Y-m-d');
            $dateRight = $checkOut->copy()->addDay(2)->format('Y-m-d');
            $persons = 1;

            $url = route('search', [
                'checkIn' => $dateLeft,
                'checkOut' => $dateRight,
                'persons' => $persons,
            ], false);

            $browser
                ->visit($url)
                ->assertDontSeeIn('[data-testid="table"]', '#' .  str_pad($room_1->number, 2, '0', STR_PAD_LEFT))
                ->assertSeeIn('[data-testid="table"]', '#' .  str_pad($room_2->number, 2, '0', STR_PAD_LEFT));
        });
    }

    /**
     * Should not see room with conflicting endDate
     *
     * @return void
     */
    public function test_can_only_see_available_rooms_3()
    {
        $this->browse(function (Browser $browser) {
            Booking::truncate();
            Room::truncate();


            $room_1 = Room::create(['capacity' => 1, 'dailyPrice' => 20, 'number' => 1]);
            $room_2 = Room::create(['capacity' => 1, 'dailyPrice' => 20, 'number' => 2]);

            $checkIn  = now()->addDay(3);
            $checkOut  = $checkIn->copy()->addDay(2);

            $booking = Booking::factory()->make();
            $booking->checkIn = $checkIn;
            $booking->checkOut = $checkOut;
            $booking->room()->associate($room_1);
            $booking->save();

            $dateLeft = $checkIn->copy()->subDay(2)->format('Y-m-d');
            $dateRight = $checkOut->format('Y-m-d');
            $persons = 1;

            $url = route('search', [
                'checkIn' => $dateLeft,
                'checkOut' => $dateRight,
                'persons' => $persons,
            ], false);

            $browser
                ->visit($url)
                ->assertDontSeeIn('[data-testid="table"]', '#' .  str_pad($room_1->number, 2, '0', STR_PAD_LEFT))
                ->assertSeeIn('[data-testid="table"]', '#' .  str_pad($room_2->number, 2, '0', STR_PAD_LEFT));
        });
    }
}

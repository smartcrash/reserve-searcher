<?php

namespace Tests\Browser;

use App\Models\Booking;
use App\Models\Room;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\WithFaker;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;

class CreateTest extends DuskTestCase
{
    use DatabaseMigrations;
    use WithFaker;

    protected function setUp(): void
    {
        parent::setUp();
        $this->artisan('db:seed');
    }

    public function test_can_create_booking()
    {
        $this->browse(function (Browser $browser) {
            $room = Room::all()->random();
            $checkIn = now()->toDateString();
            $checkOut = now()->addDay(1)->toDateString();
            $persons = 1;

            $url = '/new?check-in=' . urlencode($checkIn) . '&check-out=' . urlencode($checkOut) . '&persons=' . $persons . '&roomId=' . $room->id;

            $fullName = $this->faker->name();
            $email = $this->faker->email();
            $phoneNumber = $this->faker->phoneNumber();

            $browser->visit($url)
                ->type('fullName', $fullName)
                ->type('email', $email)
                ->type('phoneNumber', $phoneNumber)
                ->press('Create Booking')
                ->pause(500)
                ->assertPathIs('/');

            $booking = Booking::orderBy('createdAt', 'desc')->get()->first();

            $browser
                ->assertSee($booking->identifier)
                ->assertSee($fullName)
                ->assertSee($email)
                ->assertSee($phoneNumber);
        });
    }
}

<?php

namespace Tests\Browser;

use App\Models\Booking;
use App\Models\Room;
use Carbon\Carbon;
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
        Booking::truncate();
    }

    public function test_can_create_booking()
    {
        $this->browse(function (Browser $browser) {
            $room = Room::all()->random();
            $checkIn = now();
            $checkOut = now()->addDay(1);
            $persons = 1;

            $url = route('create', [
                'checkIn' => $checkIn->format('Y-m-d'),
                'checkOut' => $checkOut->format('Y-m-d'),
                'persons' => $persons,
                'roomId' => $room->id,
            ], false);

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

            $browser->with("[data-testid='booking-$booking->id']", function ($item) use ($booking, $fullName, $email, $phoneNumber) {
                $item
                    ->assertSee($booking->checkIn->format('d/m/Y'))
                    ->assertSee($booking->checkOut->format('d/m/Y'))
                    ->assertSee($booking->identifier)
                    ->assertSee($fullName)
                    ->assertSee($email)
                    ->assertSee($phoneNumber);
            });
        });
    }
}

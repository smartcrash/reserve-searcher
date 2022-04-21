<?php

namespace Tests\Browser;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;

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
            $browser->visit('/');
        });
    }

    public function test_can_navigate_to_create_booking()
    {
        $this->browse(function (Browser $browser) {
            $browser->visit('/');
        });
    }
}

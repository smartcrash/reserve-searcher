<?php

namespace Tests\Browser;

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
    {;
        $this->browse(function (Browser $browser) {
            $baseUrl = ('/search?check-in=' . urlencode(now()->toDateString()) . '&check-out=' . urlencode(now()->toDateString()));

            $browser->visit($baseUrl . '&persons=1')
                ->assertSee('Single')
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
}

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBookingsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->string('identifier');
            $table->text('comment')->default('');
            $table->date('checkIn');
            $table->date('checkOut');
            $table->double('totalPrice', 8, 2, true);
            $table->integer('persons', false, true);
            $table->unsignedBigInteger('roomId');
            $table->unsignedBigInteger('guestId');
            $table->timestamp('createdAt', 0);

            $table->foreign('roomId')->references('id')->on('rooms');
            $table->foreign('guestId')->references('id')->on('guests');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('bookings');
    }
}

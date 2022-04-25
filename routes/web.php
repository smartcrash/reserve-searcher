<?php

use App\Http\Controllers\BookingController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', [BookingController::class, 'index']);
Route::delete('/{id}', [BookingController::class, 'destroy']);
Route::get('/search', [BookingController::class, 'search']);
Route::get('/new', [BookingController::class, 'create']);
Route::post('/new', [BookingController::class, 'store']);

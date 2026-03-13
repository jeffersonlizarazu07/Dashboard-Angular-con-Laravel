<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;

Route::prefix('auth')->group(function () {
    require __DIR__.'/auth.php';
});

Route::prefix('products')->group(function () {
    require __DIR__.'/products.php';
});

Route::prefix('users')->group(function () {
    require __DIR__.'/users.php';
});

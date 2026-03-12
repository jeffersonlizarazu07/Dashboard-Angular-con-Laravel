<?php

use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\User\CartController;
use Illuminate\Support\Facades\Route;

// Rutas públicas para usuarios autenticados
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/', [ProductController::class, 'index']);

    // ✅ Rutas estáticas de carrito ANTES que la ruta dinámica /{id}
    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart/add', [CartController::class, 'addItem']);
    Route::delete('/cart/items/{cartItemId}', [CartController::class, 'removeItem']);
    Route::post('/cart/checkout', [CartController::class, 'checkout']);

    // ✅ Ruta dinámica SIEMPRE al final
    Route::get('/{id}', [ProductController::class, 'show']);
});

// Rutas exclusivas de administrador
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::post('/', [ProductController::class, 'store']);
    Route::put('/{id}', [ProductController::class, 'update']);
    Route::delete('/{id}', [ProductController::class, 'destroy']);
});

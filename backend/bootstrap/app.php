<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use App\Http\Middleware\CheckRole;
use App\Http\Middleware\SanitizeInput;
use Illuminate\Support\Facades\Route;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
    web: __DIR__.'/../routes/web.php',
    api: __DIR__.'/../routes/api.php',
    commands: __DIR__.'/../routes/console.php',
    health: '/up',
    then: function () {
        Route::middleware('api')
            ->prefix('api/auth')
            ->group(base_path('routes/auth.php'));

        Route::middleware('api')
            ->prefix('api/users')
            ->group(base_path('routes/users.php'));

        Route::middleware('api')
            ->prefix('api/products')
            ->group(base_path('routes/products.php'));
    },
)
    ->withMiddleware(function (Middleware $middleware) {
        // Middleware de Sanctum para cookies
        $middleware->statefulApi();

        $middleware->use([
        \Illuminate\Http\Middleware\HandleCors::class,
    ]);

        // Registrar alias de middleware personalizados
        $middleware->alias([
            'role'     => CheckRole::class,
            'sanitize' => SanitizeInput::class,
        ]);

        // Aplicar sanitización globalmente a la API
        $middleware->appendToGroup('api', SanitizeInput::class);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();

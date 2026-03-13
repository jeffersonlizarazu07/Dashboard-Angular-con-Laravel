<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use App\Http\Middleware\CheckRole;
use App\Http\Middleware\SanitizeInput;
use Illuminate\Support\Facades\Route;
use Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->statefulApi();

        $middleware->use([
            \Illuminate\Http\Middleware\HandleCors::class,
        ]);

        $middleware->alias([
            'role'     => CheckRole::class,
            'sanitize' => SanitizeInput::class,
        ]);

        $middleware->prependToGroup('api', EnsureFrontendRequestsAreStateful::class);
        $middleware->appendToGroup('api', SanitizeInput::class);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();

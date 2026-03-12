<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SanitizeInput
{
    /**
     * Handle an incoming request.
     * Sanitizes all string inputs to prevent XSS attacks.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle(Request $request, Closure $next): Response
    {
        $sanitized = $this->sanitizeData($request->all());
        $request->merge($sanitized);

        return $next($request);
    }

    /**
     * Recursively sanitize input data.
     *
     * @param  array  $data
     * @return array
     */
    private function sanitizeData(array $data): array
    {
        return collect($data)->map(function ($value) {
            if (is_string($value)) {
                return htmlspecialchars(strip_tags(trim($value)), ENT_QUOTES, 'UTF-8');
            }

            if (is_array($value)) {
                return $this->sanitizeData($value);
            }

            return $value;
        })->toArray();
    }
}

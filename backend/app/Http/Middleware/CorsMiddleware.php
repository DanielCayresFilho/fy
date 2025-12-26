<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CorsMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $allowedOrigins = env('CORS_ALLOWED_ORIGINS', '*');
        $origins = $allowedOrigins === '*' ? ['*'] : array_map('trim', explode(',', $allowedOrigins));

        $response = $next($request);

        // Se for um preflight request (OPTIONS)
        if ($request->getMethod() === 'OPTIONS') {
            $response = response('', 200);
        }

        // Aplicar headers CORS
        if (in_array('*', $origins)) {
            $response->headers->set('Access-Control-Allow-Origin', '*');
        } else {
            $origin = $request->headers->get('Origin');
            if (in_array($origin, $origins)) {
                $response->headers->set('Access-Control-Allow-Origin', $origin);
            }
        }

        $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
        $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
        $response->headers->set('Access-Control-Expose-Headers', 'Authorization');
        $response->headers->set('Access-Control-Allow-Credentials', env('CORS_SUPPORTS_CREDENTIALS', 'false'));
        
        $maxAge = (int) env('CORS_MAX_AGE', 0);
        if ($maxAge > 0) {
            $response->headers->set('Access-Control-Max-Age', $maxAge);
        }

        return $response;
    }
}


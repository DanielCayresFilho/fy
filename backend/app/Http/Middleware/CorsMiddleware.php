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
        // Se for OPTIONS (preflight), responder imediatamente
        if ($request->getMethod() === 'OPTIONS') {
            $response = response('', 200);
        } else {
            $response = $next($request);
        }

        // Obter origin da requisição
        $origin = $request->headers->get('Origin');
        
        // Obter origens permitidas do .env
        $allowedOrigins = env('CORS_ALLOWED_ORIGINS', '*');
        
        // Aplicar Access-Control-Allow-Origin
        if ($allowedOrigins === '*') {
            $response->headers->set('Access-Control-Allow-Origin', '*');
        } elseif ($origin && str_contains($allowedOrigins, $origin)) {
            $response->headers->set('Access-Control-Allow-Origin', $origin);
        } elseif ($origin) {
            // Fallback: permite a origin se ela estiver na lista (com vírgulas)
            $origins = array_map('trim', explode(',', $allowedOrigins));
            if (in_array($origin, $origins)) {
                $response->headers->set('Access-Control-Allow-Origin', $origin);
            } elseif (count($origins) > 0) {
                // Último fallback: permite a primeira origem configurada
                $response->headers->set('Access-Control-Allow-Origin', $origins[0]);
            }
        }

        // Headers obrigatórios para CORS
        $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
        $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
        $response->headers->set('Access-Control-Expose-Headers', 'Authorization');

        // Credentials (opcional)
        if (env('CORS_SUPPORTS_CREDENTIALS', 'false') === 'true') {
            $response->headers->set('Access-Control-Allow-Credentials', 'true');
        }

        // Max Age (opcional)
        $maxAge = (int) env('CORS_MAX_AGE', 0);
        if ($maxAge > 0) {
            $response->headers->set('Access-Control-Max-Age', (string) $maxAge);
        }

        return $response;
    }
}


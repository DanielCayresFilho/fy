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

        // Obter origens permitidas do config (NÃO usar env() aqui!)
        $allowedOrigins = config('cors.allowed_origins', ['*']);

        // Aplicar Access-Control-Allow-Origin
        if (in_array('*', $allowedOrigins)) {
            $response->headers->set('Access-Control-Allow-Origin', '*');
        } elseif ($origin && in_array($origin, $allowedOrigins)) {
            $response->headers->set('Access-Control-Allow-Origin', $origin);
        } elseif ($origin && count($allowedOrigins) > 0) {
            // Se a origin não está na lista, não permite (mais seguro)
            // Mas pra debug, vamos permitir e logar
            \Log::warning("CORS: Origin not in allowed list", [
                'origin' => $origin,
                'allowed' => $allowedOrigins
            ]);
        }

        // Headers obrigatórios para CORS
        $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
        $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
        $response->headers->set('Access-Control-Expose-Headers', 'Authorization');

        // Credentials (usar config em vez de env)
        if (config('cors.supports_credentials', false)) {
            $response->headers->set('Access-Control-Allow-Credentials', 'true');
        }

        // Max Age (usar config em vez de env)
        $maxAge = config('cors.max_age', 0);
        if ($maxAge > 0) {
            $response->headers->set('Access-Control-Max-Age', (string) $maxAge);
        }

        return $response;
    }
}


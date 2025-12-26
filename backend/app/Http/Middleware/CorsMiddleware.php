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
        // OBTER ORIGIN DA REQUISIÇÃO
        $origin = $request->headers->get('Origin');
        
        // OBTER ORIGENS PERMITIDAS
        $allowedOrigins = env('CORS_ALLOWED_ORIGINS', '*');
        $origins = $allowedOrigins === '*' ? ['*'] : array_map('trim', explode(',', $allowedOrigins));

        // SE FOR OPTIONS (PREFLIGHT), RESPONDER IMEDIATAMENTE
        if ($request->getMethod() === 'OPTIONS') {
            $response = response('', 200);
        } else {
            // Se não for OPTIONS, processar normalmente
            $response = $next($request);
        }

        // APLICAR HEADERS CORS EM TODOS OS CASOS
        if (in_array('*', $origins)) {
            // Permitir todas as origens
            $response->headers->set('Access-Control-Allow-Origin', '*');
        } elseif ($origin && in_array($origin, $origins)) {
            // Permitir origem específica
            $response->headers->set('Access-Control-Allow-Origin', $origin);
        } elseif (count($origins) > 0) {
            // Se tiver origens configuradas mas a origin não está na lista, ainda permite a primeira (fallback)
            $response->headers->set('Access-Control-Allow-Origin', $origins[0]);
        }

        // HEADERS OBRIGATÓRIOS
        $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
        $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
        $response->headers->set('Access-Control-Expose-Headers', 'Authorization');
        
        // CREDENTIALS
        $credentials = env('CORS_SUPPORTS_CREDENTIALS', 'false') === 'true' || env('CORS_SUPPORTS_CREDENTIALS', false) === true;
        if ($credentials) {
            $response->headers->set('Access-Control-Allow-Credentials', 'true');
        }

        // MAX AGE
        $maxAge = (int) env('CORS_MAX_AGE', 0);
        if ($maxAge > 0) {
            $response->headers->set('Access-Control-Max-Age', (string) $maxAge);
        }

        return $response;
    }
}


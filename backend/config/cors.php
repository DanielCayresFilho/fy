<?php

$allowedOrigins = env('CORS_ALLOWED_ORIGINS', '*');
if ($allowedOrigins === '*') {
    $origins = ['*'];
} else {
    // Remove espaços e divide por vírgula
    $origins = array_map('trim', explode(',', $allowedOrigins));
}

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie', '*'], // Permitir CORS em todas as rotas
    'allowed_methods' => ['*'],
    'allowed_origins' => $origins,
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => ['Authorization'],
    'max_age' => (int) env('CORS_MAX_AGE', 0),
    'supports_credentials' => (bool) env('CORS_SUPPORTS_CREDENTIALS', false),
];

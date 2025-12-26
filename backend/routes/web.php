<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'app' => 'Fy - Sistema de Gestão Financeira Pessoal',
        'version' => '1.0.0',
        'status' => 'online'
    ]);
});

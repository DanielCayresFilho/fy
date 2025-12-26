<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AccountFixController;
use App\Http\Controllers\AccountVariableController;
use App\Http\Controllers\CreditCardController;
use App\Http\Controllers\AccountCreditController;
use App\Http\Controllers\MoneyEntryController;
use App\Http\Controllers\MonthMovimentationController;
use App\Http\Controllers\DashboardController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Rotas públicas (sem autenticação)
Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
});

// Rotas protegidas (com autenticação JWT)
Route::middleware('jwt.auth')->group(function () {

    // Auth
    Route::prefix('auth')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::post('refresh', [AuthController::class, 'refresh']);
        Route::get('me', [AuthController::class, 'me']);
    });

    // Dashboard
    Route::prefix('dashboard')->group(function () {
        Route::get('/', [DashboardController::class, 'index']);
        Route::get('/balance', [DashboardController::class, 'balance']);
        Route::get('/credit-cards', [DashboardController::class, 'creditCards']);
        Route::get('/yearly-analysis', [DashboardController::class, 'yearlyAnalysis']);
    });

    // Contas Fixas
    Route::apiResource('account-fixes', AccountFixController::class);

    // Contas Variáveis
    Route::apiResource('account-variables', AccountVariableController::class);
    Route::post('account-variables/{id}/pay-installment', [AccountVariableController::class, 'payInstallment']);

    // Cartões de Crédito
    Route::apiResource('credit-cards', CreditCardController::class);

    // Contas de Crédito
    Route::apiResource('account-credits', AccountCreditController::class);
    Route::post('account-credits/{id}/pay-installment', [AccountCreditController::class, 'payInstallment']);

    // Entradas de Dinheiro
    Route::apiResource('money-entries', MoneyEntryController::class);

    // Movimentações Mensais
    Route::prefix('month-movimentations')->group(function () {
        Route::get('/', [MonthMovimentationController::class, 'index']);
        Route::post('/generate', [MonthMovimentationController::class, 'generateMonth']);
        Route::post('/{id}/pay', [MonthMovimentationController::class, 'markAsPaid']);
        Route::post('/update-late', [MonthMovimentationController::class, 'updateLateAccounts']);
        Route::get('/summary', [MonthMovimentationController::class, 'summary']);
    });
});

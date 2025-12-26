<?php

namespace App\Http\Controllers;

use App\Models\MoneyEntry;
use App\Models\MonthMovimentation;
use App\Models\CreditCard;
use App\Models\AccountVariable;
use App\Models\AccountCredit;
use Illuminate\Http\Request;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Dashboard completo com todas as informações financeiras
     */
    public function index(Request $request)
    {
        $month = $request->input('month', now()->month);
        $year = $request->input('year', now()->year);
        $userId = auth()->id();

        return response()->json([
            'success' => true,
            'data' => [
                'balance' => $this->getBalance($userId, $month, $year),
                'credit_cards' => $this->getCreditCardsInfo($userId),
                'monthly_summary' => $this->getMonthlySummary($userId, $month, $year),
                'upcoming_bills' => $this->getUpcomingBills($userId),
                'late_bills' => $this->getLateBills($userId),
            ]
        ]);
    }

    /**
     * Saldo disponível
     */
    public function balance(Request $request)
    {
        $month = $request->input('month', now()->month);
        $year = $request->input('year', now()->year);

        $balance = $this->getBalance(auth()->id(), $month, $year);

        return response()->json([
            'success' => true,
            'data' => $balance
        ]);
    }

    /**
     * Informações dos cartões de crédito
     */
    public function creditCards()
    {
        $cards = $this->getCreditCardsInfo(auth()->id());

        return response()->json([
            'success' => true,
            'data' => $cards
        ]);
    }

    /**
     * Calcular saldo disponível
     */
    private function getBalance($userId, $month, $year)
    {
        // Total de entradas do mês
        $totalIncome = MoneyEntry::where('user_id', $userId)
            ->whereMonth('entry_date', $month)
            ->whereYear('entry_date', $year)
            ->sum('amount');

        // Total de contas do mês
        $totalExpenses = MonthMovimentation::where('user_id', $userId)
            ->where('month', $month)
            ->where('year', $year)
            ->whereIn('account_type', ['fix', 'variable']) // Não incluir crédito aqui
            ->sum('amount');

        // Contas pagas do mês
        $paidExpenses = MonthMovimentation::where('user_id', $userId)
            ->where('month', $month)
            ->where('year', $year)
            ->where('status', 'paid')
            ->whereIn('account_type', ['fix', 'variable'])
            ->sum('amount');

        // Contas pendentes
        $pendingExpenses = $totalExpenses - $paidExpenses;

        // Saldo atual (entradas - contas pagas)
        $currentBalance = $totalIncome - $paidExpenses;

        // Saldo projetado (entradas - todas as contas)
        $projectedBalance = $totalIncome - $totalExpenses;

        return [
            'total_income' => number_format($totalIncome, 2, '.', ''),
            'total_expenses' => number_format($totalExpenses, 2, '.', ''),
            'paid_expenses' => number_format($paidExpenses, 2, '.', ''),
            'pending_expenses' => number_format($pendingExpenses, 2, '.', ''),
            'current_balance' => number_format($currentBalance, 2, '.', ''),
            'projected_balance' => number_format($projectedBalance, 2, '.', ''),
        ];
    }

    /**
     * Informações dos cartões de crédito
     */
    private function getCreditCardsInfo($userId)
    {
        $cards = CreditCard::where('user_id', $userId)->get();

        return $cards->map(function ($card) {
            $usedLimit = $card->usedLimit();
            $availableLimit = $card->availableLimit();
            $percentage = $card->usedPercentage();

            return [
                'id' => $card->id,
                'name' => $card->name,
                'total_limit' => number_format($card->total_limite, 2, '.', ''),
                'used_limit' => number_format($usedLimit, 2, '.', ''),
                'available_limit' => number_format($availableLimit, 2, '.', ''),
                'used_percentage' => number_format($percentage, 2, '.', ''),
                'vencible_at' => $card->vencible_at->format('d/m/Y'),
            ];
        });
    }

    /**
     * Resumo mensal
     */
    private function getMonthlySummary($userId, $month, $year)
    {
        $movimentations = MonthMovimentation::where('user_id', $userId)
            ->where('month', $month)
            ->where('year', $year)
            ->get();

        $fixAccounts = $movimentations->where('account_type', 'fix');
        $variableAccounts = $movimentations->where('account_type', 'variable');
        $creditAccounts = $movimentations->where('account_type', 'credit');

        return [
            'fixed_accounts' => [
                'total' => number_format($fixAccounts->sum('amount'), 2, '.', ''),
                'count' => $fixAccounts->count(),
                'paid' => $fixAccounts->where('status', 'paid')->count(),
                'pending' => $fixAccounts->where('status', 'pending')->count(),
                'late' => $fixAccounts->where('status', 'late')->count(),
            ],
            'variable_accounts' => [
                'total' => number_format($variableAccounts->sum('amount'), 2, '.', ''),
                'count' => $variableAccounts->count(),
                'paid' => $variableAccounts->where('status', 'paid')->count(),
                'pending' => $variableAccounts->where('status', 'pending')->count(),
                'late' => $variableAccounts->where('status', 'late')->count(),
            ],
            'credit_accounts' => [
                'total' => number_format($creditAccounts->sum('amount'), 2, '.', ''),
                'count' => $creditAccounts->count(),
                'paid' => $creditAccounts->where('status', 'paid')->count(),
                'pending' => $creditAccounts->where('status', 'pending')->count(),
                'late' => $creditAccounts->where('status', 'late')->count(),
            ],
            'total' => [
                'amount' => number_format($movimentations->sum('amount'), 2, '.', ''),
                'count' => $movimentations->count(),
                'paid' => $movimentations->where('status', 'paid')->count(),
                'pending' => $movimentations->where('status', 'pending')->count(),
                'late' => $movimentations->where('status', 'late')->count(),
            ]
        ];
    }

    /**
     * Próximas contas a vencer (próximos 7 dias)
     */
    private function getUpcomingBills($userId)
    {
        $today = Carbon::now();
        $nextWeek = Carbon::now()->addDays(7);

        $bills = MonthMovimentation::where('user_id', $userId)
            ->where('status', 'pending')
            ->whereBetween('due_date', [$today, $nextWeek])
            ->orderBy('due_date')
            ->get();

        return $bills->map(function ($bill) {
            return [
                'id' => $bill->id,
                'name' => $bill->account_name,
                'amount' => number_format($bill->amount, 2, '.', ''),
                'due_date' => $bill->due_date->format('d/m/Y'),
                'days_until_due' => $bill->due_date->diffInDays(now()),
                'type' => $bill->account_type,
            ];
        });
    }

    /**
     * Contas atrasadas
     */
    private function getLateBills($userId)
    {
        $bills = MonthMovimentation::where('user_id', $userId)
            ->whereIn('status', ['pending', 'late'])
            ->where('due_date', '<', now())
            ->orderBy('due_date')
            ->get();

        return $bills->map(function ($bill) {
            return [
                'id' => $bill->id,
                'name' => $bill->account_name,
                'amount' => number_format($bill->amount, 2, '.', ''),
                'due_date' => $bill->due_date->format('d/m/Y'),
                'days_late' => now()->diffInDays($bill->due_date),
                'type' => $bill->account_type,
            ];
        });
    }

    /**
     * Análise anual
     */
    public function yearlyAnalysis(Request $request)
    {
        $year = $request->input('year', now()->year);
        $userId = auth()->id();

        $monthlyData = [];

        for ($month = 1; $month <= 12; $month++) {
            $balance = $this->getBalance($userId, $month, $year);
            $summary = $this->getMonthlySummary($userId, $month, $year);

            $monthlyData[] = [
                'month' => $month,
                'month_name' => Carbon::create($year, $month, 1)->locale('pt_BR')->monthName,
                'balance' => $balance,
                'summary' => $summary,
            ];
        }

        return response()->json([
            'success' => true,
            'data' => [
                'year' => $year,
                'monthly_data' => $monthlyData,
            ]
        ]);
    }
}

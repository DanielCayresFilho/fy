<?php

namespace App\Http\Controllers;

use App\Models\MonthMovimentation;
use App\Models\AccountFix;
use App\Models\AccountVariable;
use App\Models\AccountCredit;
use Illuminate\Http\Request;
use Carbon\Carbon;

class MonthMovimentationController extends Controller
{
    /**
     * Gerar movimentações do mês
     */
    public function generateMonth(Request $request)
    {
        $month = $request->input('month', now()->month);
        $year = $request->input('year', now()->year);
        $userId = auth()->id();

        // Verificar se já existe movimentação para este mês
        $exists = MonthMovimentation::where('user_id', $userId)
            ->where('month', $month)
            ->where('year', $year)
            ->exists();

        if ($exists) {
            return response()->json([
                'success' => false,
                'message' => 'Movimentações para este mês já foram geradas'
            ], 400);
        }

        $movimentations = [];

        // Contas Fixas
        $fixedAccounts = AccountFix::where('user_id', $userId)->get();
        foreach ($fixedAccounts as $account) {
            $dueDate = Carbon::create($year, $month, $account->vencible_at->day);

            $movimentations[] = MonthMovimentation::create([
                'user_id' => $userId,
                'month' => $month,
                'year' => $year,
                'account_type' => 'fix',
                'account_id' => $account->id,
                'account_name' => $account->name,
                'amount' => $account->price,
                'status' => 'pending',
                'due_date' => $dueDate,
            ]);
        }

        // Contas Variáveis (apenas parcelas não pagas)
        $variableAccounts = AccountVariable::where('user_id', $userId)
            ->whereColumn('qt_payed', '<', 'quantity')
            ->get();

        foreach ($variableAccounts as $account) {
            if ($account->qt_payed < $account->quantity) {
                $dueDate = Carbon::create($year, $month, $account->vencible_at->day);

                $movimentations[] = MonthMovimentation::create([
                    'user_id' => $userId,
                    'month' => $month,
                    'year' => $year,
                    'account_type' => 'variable',
                    'account_id' => $account->id,
                    'account_name' => $account->name,
                    'amount' => $account->price,
                    'status' => 'pending',
                    'due_date' => $dueDate,
                ]);
            }
        }

        // Contas de Crédito (apenas parcelas não pagas)
        $creditAccounts = AccountCredit::where('user_id', $userId)
            ->whereColumn('installments_payed', '<', 'installments')
            ->with('creditCard')
            ->get();

        foreach ($creditAccounts as $account) {
            if ($account->installments_payed < $account->installments) {
                $dueDate = Carbon::create($year, $month, $account->creditCard->vencible_at->day);

                $movimentations[] = MonthMovimentation::create([
                    'user_id' => $userId,
                    'month' => $month,
                    'year' => $year,
                    'account_type' => 'credit',
                    'account_id' => $account->id,
                    'account_name' => $account->name . ' (' . $account->card_name . ')',
                    'amount' => $account->installments_price,
                    'status' => 'pending',
                    'due_date' => $dueDate,
                ]);
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Movimentações do mês geradas com sucesso',
            'data' => $movimentations
        ], 201);
    }

    /**
     * Listar movimentações do mês
     */
    public function index(Request $request)
    {
        $month = $request->input('month', now()->month);
        $year = $request->input('year', now()->year);

        $movimentations = MonthMovimentation::where('user_id', auth()->id())
            ->where('month', $month)
            ->where('year', $year)
            ->orderBy('due_date')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $movimentations
        ]);
    }

    /**
     * Marcar como paga
     */
    public function markAsPaid($id, Request $request)
    {
        $movimentation = MonthMovimentation::where('user_id', auth()->id())->find($id);

        if (!$movimentation) {
            return response()->json([
                'success' => false,
                'message' => 'Movimentação não encontrada'
            ], 404);
        }

        if ($movimentation->status === 'paid') {
            return response()->json([
                'success' => false,
                'message' => 'Esta conta já está paga'
            ], 400);
        }

        $paymentDate = $request->input('payment_date', now());
        $movimentation->markAsPaid($paymentDate);

        // Atualizar contador de parcelas pagas na conta original
        if ($movimentation->account_type === 'variable') {
            $account = AccountVariable::find($movimentation->account_id);
            if ($account && $account->qt_payed < $account->quantity) {
                $account->qt_payed += 1;
                $account->save();
            }
        } elseif ($movimentation->account_type === 'credit') {
            $account = AccountCredit::find($movimentation->account_id);
            if ($account && $account->installments_payed < $account->installments) {
                $account->installments_payed += 1;
                $account->save();
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Conta marcada como paga',
            'data' => $movimentation
        ]);
    }

    /**
     * Atualizar status de contas atrasadas
     */
    public function updateLateAccounts(Request $request)
    {
        $month = $request->input('month', now()->month);
        $year = $request->input('year', now()->year);

        $movimentations = MonthMovimentation::where('user_id', auth()->id())
            ->where('month', $month)
            ->where('year', $year)
            ->where('status', 'pending')
            ->get();

        $updated = 0;
        foreach ($movimentations as $movimentation) {
            if ($movimentation->isLate()) {
                $movimentation->markAsLate();
                $updated++;
            }
        }

        return response()->json([
            'success' => true,
            'message' => "$updated contas marcadas como atrasadas"
        ]);
    }

    /**
     * Resumo do mês
     */
    public function summary(Request $request)
    {
        $month = $request->input('month', now()->month);
        $year = $request->input('year', now()->year);

        $movimentations = MonthMovimentation::where('user_id', auth()->id())
            ->where('month', $month)
            ->where('year', $year)
            ->get();

        $total = $movimentations->sum('amount');
        $paid = $movimentations->where('status', 'paid')->sum('amount');
        $pending = $movimentations->where('status', 'pending')->sum('amount');
        $late = $movimentations->where('status', 'late')->sum('amount');

        $countTotal = $movimentations->count();
        $countPaid = $movimentations->where('status', 'paid')->count();
        $countPending = $movimentations->where('status', 'pending')->count();
        $countLate = $movimentations->where('status', 'late')->count();

        return response()->json([
            'success' => true,
            'data' => [
                'month' => $month,
                'year' => $year,
                'summary' => [
                    'total_amount' => $total,
                    'paid_amount' => $paid,
                    'pending_amount' => $pending,
                    'late_amount' => $late,
                ],
                'count' => [
                    'total' => $countTotal,
                    'paid' => $countPaid,
                    'pending' => $countPending,
                    'late' => $countLate,
                ],
            ]
        ]);
    }
}

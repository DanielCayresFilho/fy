<?php

namespace App\Http\Controllers;

use App\Models\AccountCredit;
use App\Models\CreditCard;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AccountCreditController extends Controller
{
    public function index()
    {
        $accounts = auth()->user()->accountCredits()
            ->with('creditCard')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $accounts
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'card_id' => 'required|exists:credit_cards,id',
            'name' => 'required|string|max:255',
            'total_price' => 'required|numeric|min:0',
            'installments' => 'required|integer|min:1',
        ], [
            'card_id.required' => 'O cartão é obrigatório',
            'card_id.exists' => 'Cartão não encontrado',
            'name.required' => 'O nome é obrigatório',
            'total_price.required' => 'O preço total é obrigatório',
            'installments.required' => 'O número de parcelas é obrigatório',
            'installments.min' => 'O número de parcelas deve ser no mínimo 1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $card = auth()->user()->creditCards()->find($request->card_id);

        if (!$card) {
            return response()->json([
                'success' => false,
                'message' => 'Cartão não encontrado'
            ], 404);
        }

        $installmentsPrice = $request->total_price / $request->installments;

        // Verificar se tem limite disponível
        if ($card->availableLimit() < $installmentsPrice) {
            return response()->json([
                'success' => false,
                'message' => 'Limite insuficiente no cartão'
            ], 400);
        }

        $data = $request->all();
        $data['card_name'] = $card->name;
        $data['installments_price'] = $installmentsPrice;
        $data['installments_payed'] = $request->input('installments_payed', 0);

        $account = auth()->user()->accountCredits()->create($data);

        return response()->json([
            'success' => true,
            'message' => 'Compra no crédito criada com sucesso',
            'data' => $account
        ], 201);
    }

    public function show($id)
    {
        $account = auth()->user()->accountCredits()->with('creditCard')->find($id);

        if (!$account) {
            return response()->json([
                'success' => false,
                'message' => 'Conta não encontrada'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $account
        ]);
    }

    public function update(Request $request, $id)
    {
        $account = auth()->user()->accountCredits()->find($id);

        if (!$account) {
            return response()->json([
                'success' => false,
                'message' => 'Conta não encontrada'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'installments_payed' => 'sometimes|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $account->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Conta atualizada com sucesso',
            'data' => $account
        ]);
    }

    public function destroy($id)
    {
        $account = auth()->user()->accountCredits()->find($id);

        if (!$account) {
            return response()->json([
                'success' => false,
                'message' => 'Conta não encontrada'
            ], 404);
        }

        $account->delete();

        return response()->json([
            'success' => true,
            'message' => 'Conta excluída com sucesso'
        ]);
    }

    public function payInstallment($id)
    {
        $account = auth()->user()->accountCredits()->find($id);

        if (!$account) {
            return response()->json([
                'success' => false,
                'message' => 'Conta não encontrada'
            ], 404);
        }

        if ($account->isPaid()) {
            return response()->json([
                'success' => false,
                'message' => 'Esta conta já está totalmente paga'
            ], 400);
        }

        $account->installments_payed += 1;
        $account->save();

        return response()->json([
            'success' => true,
            'message' => 'Parcela paga com sucesso',
            'data' => $account
        ]);
    }
}

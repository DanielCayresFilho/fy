<?php

namespace App\Http\Controllers;

use App\Models\AccountVariable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AccountVariableController extends Controller
{
    public function index()
    {
        $accounts = auth()->user()->accountsVariable()->orderBy('vencible_at')->get();

        return response()->json([
            'success' => true,
            'data' => $accounts
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'vencible_at' => 'required|date',
            'price' => 'required|numeric|min:0',
            'quantity' => 'required|integer|min:1',
        ], [
            'name.required' => 'O nome é obrigatório',
            'vencible_at.required' => 'A data de vencimento é obrigatória',
            'price.required' => 'O preço é obrigatório',
            'quantity.required' => 'A quantidade de parcelas é obrigatória',
            'quantity.min' => 'A quantidade deve ser no mínimo 1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $request->all();
        $data['qt_payed'] = $request->input('qt_payed', 0);

        $account = auth()->user()->accountsVariable()->create($data);

        return response()->json([
            'success' => true,
            'message' => 'Conta variável criada com sucesso',
            'data' => $account
        ], 201);
    }

    public function show($id)
    {
        $account = auth()->user()->accountsVariable()->find($id);

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
        $account = auth()->user()->accountsVariable()->find($id);

        if (!$account) {
            return response()->json([
                'success' => false,
                'message' => 'Conta não encontrada'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'vencible_at' => 'sometimes|date',
            'price' => 'sometimes|numeric|min:0',
            'quantity' => 'sometimes|integer|min:1',
            'qt_payed' => 'sometimes|integer|min:0',
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
        $account = auth()->user()->accountsVariable()->find($id);

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
        $account = auth()->user()->accountsVariable()->find($id);

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

        $account->qt_payed += 1;
        $account->save();

        return response()->json([
            'success' => true,
            'message' => 'Parcela paga com sucesso',
            'data' => $account
        ]);
    }
}

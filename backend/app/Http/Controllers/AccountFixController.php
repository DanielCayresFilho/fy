<?php

namespace App\Http\Controllers;

use App\Models\AccountFix;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AccountFixController extends Controller
{
    public function index()
    {
        $accounts = auth()->user()->accountFixes()->orderBy('vencible_at')->get();

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
        ], [
            'name.required' => 'O nome é obrigatório',
            'vencible_at.required' => 'A data de vencimento é obrigatória',
            'vencible_at.date' => 'Data de vencimento inválida',
            'price.required' => 'O preço é obrigatório',
            'price.numeric' => 'O preço deve ser um número',
            'price.min' => 'O preço deve ser maior ou igual a zero',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $account = auth()->user()->accountFixes()->create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Conta fixa criada com sucesso',
            'data' => $account
        ], 201);
    }

    public function show($id)
    {
        $account = auth()->user()->accountFixes()->find($id);

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
        $account = auth()->user()->accountFixes()->find($id);

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
        $account = auth()->user()->accountFixes()->find($id);

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
}

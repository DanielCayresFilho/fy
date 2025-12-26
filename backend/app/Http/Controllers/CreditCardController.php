<?php

namespace App\Http\Controllers;

use App\Models\CreditCard;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CreditCardController extends Controller
{
    public function index()
    {
        $cards = auth()->user()->creditCards()->with('accountCredits')->get();

        $cards->map(function ($card) {
            $card->used_limit = $card->usedLimit();
            $card->available_limit = $card->availableLimit();
            $card->used_percentage = $card->usedPercentage();
            return $card;
        });

        return response()->json([
            'success' => true,
            'data' => $cards
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'vencible_at' => 'required|date',
            'total_limite' => 'required|numeric|min:0',
        ], [
            'name.required' => 'O nome é obrigatório',
            'vencible_at.required' => 'A data de vencimento é obrigatória',
            'total_limite.required' => 'O limite total é obrigatório',
            'total_limite.min' => 'O limite deve ser maior ou igual a zero',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $card = auth()->user()->creditCards()->create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Cartão criado com sucesso',
            'data' => $card
        ], 201);
    }

    public function show($id)
    {
        $card = auth()->user()->creditCards()->with('accountCredits')->find($id);

        if (!$card) {
            return response()->json([
                'success' => false,
                'message' => 'Cartão não encontrado'
            ], 404);
        }

        $card->used_limit = $card->usedLimit();
        $card->available_limit = $card->availableLimit();
        $card->used_percentage = $card->usedPercentage();

        return response()->json([
            'success' => true,
            'data' => $card
        ]);
    }

    public function update(Request $request, $id)
    {
        $card = auth()->user()->creditCards()->find($id);

        if (!$card) {
            return response()->json([
                'success' => false,
                'message' => 'Cartão não encontrado'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'vencible_at' => 'sometimes|date',
            'total_limite' => 'sometimes|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $card->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Cartão atualizado com sucesso',
            'data' => $card
        ]);
    }

    public function destroy($id)
    {
        $card = auth()->user()->creditCards()->find($id);

        if (!$card) {
            return response()->json([
                'success' => false,
                'message' => 'Cartão não encontrado'
            ], 404);
        }

        $card->delete();

        return response()->json([
            'success' => true,
            'message' => 'Cartão excluído com sucesso'
        ]);
    }
}

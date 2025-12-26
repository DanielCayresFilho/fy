<?php

namespace App\Http\Controllers;

use App\Models\MoneyEntry;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MoneyEntryController extends Controller
{
    public function index()
    {
        $entries = auth()->user()->moneyEntries()->orderBy('entry_date', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $entries
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'entry_date' => 'required|date',
            'amount' => 'required|numeric|min:0',
        ], [
            'name.required' => 'O nome é obrigatório',
            'entry_date.required' => 'A data de entrada é obrigatória',
            'amount.required' => 'O valor é obrigatório',
            'amount.min' => 'O valor deve ser maior ou igual a zero',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $entry = auth()->user()->moneyEntries()->create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Entrada de dinheiro criada com sucesso',
            'data' => $entry
        ], 201);
    }

    public function show($id)
    {
        $entry = auth()->user()->moneyEntries()->find($id);

        if (!$entry) {
            return response()->json([
                'success' => false,
                'message' => 'Entrada não encontrada'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $entry
        ]);
    }

    public function update(Request $request, $id)
    {
        $entry = auth()->user()->moneyEntries()->find($id);

        if (!$entry) {
            return response()->json([
                'success' => false,
                'message' => 'Entrada não encontrada'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'entry_date' => 'sometimes|date',
            'amount' => 'sometimes|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $entry->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Entrada atualizada com sucesso',
            'data' => $entry
        ]);
    }

    public function destroy($id)
    {
        $entry = auth()->user()->moneyEntries()->find($id);

        if (!$entry) {
            return response()->json([
                'success' => false,
                'message' => 'Entrada não encontrada'
            ], 404);
        }

        $entry->delete();

        return response()->json([
            'success' => true,
            'message' => 'Entrada excluída com sucesso'
        ]);
    }
}

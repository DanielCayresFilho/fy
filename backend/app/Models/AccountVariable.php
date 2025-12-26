<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AccountVariable extends Model
{
    use HasFactory;

    protected $table = 'accounts_variable';

    protected $fillable = [
        'user_id',
        'name',
        'vencible_at',
        'price',
        'quantity',
        'qt_payed',
    ];

    protected function casts(): array
    {
        return [
            'vencible_at' => 'date',
            'price' => 'decimal:2',
            'quantity' => 'integer',
            'qt_payed' => 'integer',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Verificar se está completamente paga
    public function isPaid(): bool
    {
        return $this->qt_payed >= $this->quantity;
    }

    // Valor restante
    public function remainingAmount(): float
    {
        $remaining = $this->quantity - $this->qt_payed;
        return $remaining > 0 ? $remaining * $this->price : 0;
    }
}

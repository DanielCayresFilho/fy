<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AccountCredit extends Model
{
    use HasFactory;

    protected $table = 'account_credits';

    protected $fillable = [
        'user_id',
        'card_id',
        'card_name',
        'name',
        'total_price',
        'installments_price',
        'installments',
        'installments_payed',
    ];

    protected function casts(): array
    {
        return [
            'total_price' => 'decimal:2',
            'installments_price' => 'decimal:2',
            'installments' => 'integer',
            'installments_payed' => 'integer',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function creditCard()
    {
        return $this->belongsTo(CreditCard::class, 'card_id');
    }

    // Verificar se está completamente paga
    public function isPaid(): bool
    {
        return $this->installments_payed >= $this->installments;
    }

    // Parcelas restantes
    public function remainingInstallments(): int
    {
        $remaining = $this->installments - $this->installments_payed;
        return $remaining > 0 ? $remaining : 0;
    }

    // Valor restante
    public function remainingAmount(): float
    {
        return $this->remainingInstallments() * $this->installments_price;
    }
}

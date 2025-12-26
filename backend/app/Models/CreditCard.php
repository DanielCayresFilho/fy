<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CreditCard extends Model
{
    use HasFactory;

    protected $table = 'credit_cards';

    protected $fillable = [
        'user_id',
        'name',
        'vencible_at',
        'total_limite',
    ];

    protected function casts(): array
    {
        return [
            'vencible_at' => 'date',
            'total_limite' => 'decimal:2',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function accountCredits()
    {
        return $this->hasMany(AccountCredit::class, 'card_id');
    }

    // Calcular limite usado
    public function usedLimit(): float
    {
        return $this->accountCredits()
            ->whereColumn('installments_payed', '<', 'installments')
            ->get()
            ->sum('installments_price');
    }

    // Calcular limite disponível
    public function availableLimit(): float
    {
        return $this->total_limite - $this->usedLimit();
    }

    // Percentual usado
    public function usedPercentage(): float
    {
        if ($this->total_limite == 0) {
            return 0;
        }
        return ($this->usedLimit() / $this->total_limite) * 100;
    }
}

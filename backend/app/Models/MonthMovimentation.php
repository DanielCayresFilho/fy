<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MonthMovimentation extends Model
{
    use HasFactory;

    protected $table = 'month_movimentations';

    protected $fillable = [
        'user_id',
        'month',
        'year',
        'account_type',
        'account_id',
        'account_name',
        'amount',
        'status',
        'payment_date',
        'due_date',
    ];

    protected function casts(): array
    {
        return [
            'month' => 'integer',
            'year' => 'integer',
            'amount' => 'decimal:2',
            'payment_date' => 'date',
            'due_date' => 'date',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Verificar se está atrasada
    public function isLate(): bool
    {
        if ($this->status === 'paid') {
            return false;
        }

        return now()->gt($this->due_date);
    }

    // Marcar como paga
    public function markAsPaid($date = null)
    {
        $this->status = 'paid';
        $this->payment_date = $date ?? now();
        $this->save();
    }

    // Marcar como atrasada
    public function markAsLate()
    {
        if ($this->status === 'pending' && $this->isLate()) {
            $this->status = 'late';
            $this->save();
        }
    }
}

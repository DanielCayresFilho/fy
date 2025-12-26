<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AccountFix extends Model
{
    use HasFactory;

    protected $table = 'account_fixes';

    protected $fillable = [
        'user_id',
        'name',
        'vencible_at',
        'price',
    ];

    protected function casts(): array
    {
        return [
            'vencible_at' => 'date',
            'price' => 'decimal:2',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

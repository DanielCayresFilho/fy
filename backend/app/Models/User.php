<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Support\Facades\Hash;

class User extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'nome',
        'email',
        'password',
    ];

    protected $hidden = [
        'password',
    ];

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
        ];
    }

    // Usar Argon2id para hash de senha
    public function setPasswordAttribute($value)
    {
        $this->attributes['password'] = Hash::make($value, [
            'algo' => PASSWORD_ARGON2ID,
        ]);
    }

    // JWT Methods
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }

    // Relationships
    public function accountFixes()
    {
        return $this->hasMany(AccountFix::class);
    }

    public function accountsVariable()
    {
        return $this->hasMany(AccountVariable::class);
    }

    public function creditCards()
    {
        return $this->hasMany(CreditCard::class);
    }

    public function accountCredits()
    {
        return $this->hasMany(AccountCredit::class);
    }

    public function moneyEntries()
    {
        return $this->hasMany(MoneyEntry::class);
    }

    public function monthMovimentations()
    {
        return $this->hasMany(MonthMovimentation::class);
    }
}

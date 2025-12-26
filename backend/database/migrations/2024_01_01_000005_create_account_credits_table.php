<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('account_credits', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('card_id')->constrained('credit_cards')->onDelete('cascade');
            $table->string('card_name');
            $table->string('name');
            $table->decimal('total_price', 10, 2);
            $table->decimal('installments_price', 10, 2);
            $table->integer('installments');
            $table->integer('installments_payed')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('account_credits');
    }
};

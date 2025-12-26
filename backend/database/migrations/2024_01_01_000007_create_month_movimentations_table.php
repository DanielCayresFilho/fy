<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('month_movimentations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->integer('month');
            $table->integer('year');
            $table->string('account_type'); // 'fix', 'variable', 'credit'
            $table->unsignedBigInteger('account_id');
            $table->string('account_name');
            $table->decimal('amount', 10, 2);
            $table->enum('status', ['pending', 'paid', 'late', 'advanced'])->default('pending');
            $table->date('payment_date')->nullable();
            $table->date('due_date');
            $table->timestamps();

            $table->index(['user_id', 'month', 'year']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('month_movimentations');
    }
};

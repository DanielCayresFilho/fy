<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Verificar se o usuário já existe
        $user = User::where('email', 'daniju@mail.com')->first();

        if (!$user) {
            User::create([
                'nome' => 'Daniju',
                'email' => 'daniju@mail.com',
                'password' => Hash::make('@D4n1Ju.2409', [
                    'algo' => PASSWORD_ARGON2ID,
                ]),
            ]);

            $this->command->info('Usuário padrão criado com sucesso!');
            $this->command->info('Email: daniju@mail.com');
            $this->command->info('Senha: @D4n1Ju.2409');
        } else {
            $this->command->info('Usuário padrão já existe. Atualizando senha...');
            
            // Atualizar a senha caso o usuário já exista
            $user->password = Hash::make('@D4n1Ju.2409', [
                'algo' => PASSWORD_ARGON2ID,
            ]);
            $user->save();
            
            $this->command->info('Senha do usuário padrão atualizada!');
        }
    }
}


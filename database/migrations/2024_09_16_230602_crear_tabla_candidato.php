<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('candidato', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_usuario')->constrained('usuario');
            $table->foreignId('departamento')->constrained('tipo_departamento');
            $table->string('documento_identidad', 14)->unique();
            $table->string('nombre', 250);
            $table->foreignId('puesto_postula')->constrained('puesto');
            $table->decimal('salario_aspira', 13, 2);
            $table->string('recomendado_por');
            $table->foreignId('estatus')->constrained('tipo_estatus_candidato');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('candidato');
    }
};

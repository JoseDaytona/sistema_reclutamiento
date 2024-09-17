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
        Schema::create('puesto', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_departamento')->constrained('tipo_departamento');
            $table->string('nombre')->unique();
            $table->foreignId('nivel_riesgo')->constrained('tipo_nivel_riesgo');
            $table->decimal('salario_minimo', 13, 2);
            $table->decimal('salario_maximo', 13, 2);
            $table->foreignId('estatus')->constrained('tipo_estatus');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('puesto');
    }
};

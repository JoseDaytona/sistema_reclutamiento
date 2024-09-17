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
        Schema::create('empleado', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_candidato')->constrained('candidato');
            $table->string('cedula');
            $table->string('nombre');
            $table->string('fecha_ingreso');
            $table->foreignId('puesto')->constrained('puesto');
            $table->decimal('salario_mensual', 13, 2);
            $table->foreignId('estatus')->constrained('tipo_estatus');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('empleado');
    }
};

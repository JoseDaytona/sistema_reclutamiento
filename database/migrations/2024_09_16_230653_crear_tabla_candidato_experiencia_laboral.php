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
        Schema::create('candidato_experiencia_laboral', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_candidato')->constrained('candidato');
            $table->string('empresa');
            $table->string('descripcion_puesto');
            $table->string('fecha_desde');
            $table->string('fecha_hasta');
            $table->decimal('salario', 13, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('candidato_experiencia_laboral');
    }
};

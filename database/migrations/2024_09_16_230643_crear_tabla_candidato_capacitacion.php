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
        Schema::create('candidato_capacitacion', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_candidato')->constrained('candidato');
            $table->string('descripcion');
            $table->foreignId('id_nivel')->constrained('tipo_nivel_capacitacion');
            $table->string('fecha_desde');
            $table->string('fecha_hasta');
            $table->boolean('cursando');
            $table->string('institucion');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('candidato_capacitacion');
    }
};

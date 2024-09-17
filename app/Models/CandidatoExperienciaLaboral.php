<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CandidatoExperienciaLaboral extends Model
{
    protected $table = 'candidato_experiencia_laboral';
    
    protected $fillable = [
        'id_candidato',
        'empresa',
        'descripcion_puesto',
        'fecha_desde',
        'fecha_hasta',
        'salario'
    ];
}

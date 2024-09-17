<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CandidatoCapacitacion extends Model
{
    protected $table = 'candidato_capacitacion';
    
    protected $fillable = [
        'id_candidato',
        'descripcion',
        'id_nivel',
        'fecha_desde',
        'fecha_hasta',
        'cursando',
        'institucion'
    ];
}

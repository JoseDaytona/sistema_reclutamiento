<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Puesto extends Model
{
    protected $table = 'puesto';
    
    protected $fillable = [
        'id_departamento',
        'nombre',
        'nivel_riesgo',
        'salario_minimo',
        'salario_maximo',
        'estatus'
    ];
}

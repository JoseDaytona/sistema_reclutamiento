<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Empleado extends Model
{
    protected $table = 'empleado';
    
    protected $fillable = [
        'id_candidato',
        'cedula',
        'nombre',
        'fecha_ingreso',
        'puesto',
        'salario_mensual',
        'estatus'
    ];
}

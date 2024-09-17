<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TipoDepartamento extends Model
{
    protected $table = 'tipo_departamento';

    protected $fillable = [
        'nombre',
        'estatus'
    ];
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Idioma extends Model
{
    protected $table = 'idioma';
    
    protected $fillable = [
        'nombre',
        'estatus'
    ];
}

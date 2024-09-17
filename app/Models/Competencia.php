<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Competencia extends Model
{
    protected $table = 'competencia';
    
    protected $fillable = [
        'nombre',
        'estatus'
    ];
}

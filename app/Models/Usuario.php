<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Usuario extends Model
{
    protected $table = 'usuario';
    
    protected $fillable = [
        'id_role',
        'documento_identidad',
        'nombre',
        'email',
        'usuario',
        'password'
    ];
}

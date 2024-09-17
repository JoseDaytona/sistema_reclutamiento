<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CandidatoCompetencia extends Model
{
    protected $table = 'candidato_competencia';
    
    protected $fillable = [
        'id_candidato',
        'id_competencia'
    ];
}

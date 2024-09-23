<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Candidato extends Model
{
    protected $table = 'candidato';
    
    protected $fillable = [
        'id_usuario',
        'departamento',
        'documento_identidad',
        'nombre',
        'puesto_postula',
        'salario_aspira',
        'recomendado_por',
        'estatus'
    ];

    public function capacitacion()
    {
        return $this->hasMany(CandidatoCapacitacion::class);
    }

    public function competencia()
    {
        return $this->hasMany(CandidatoCompetencia::class);
    }
    public function experiencia_laboral()
    {
        return $this->hasMany(CandidatoExperienciaLaboral::class);
    }
}

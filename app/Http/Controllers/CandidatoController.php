<?php

namespace App\Http\Controllers;

use App\Models\Candidato;
use App\Models\CandidatoCapacitacion;
use App\Models\CandidatoCompetencia;
use App\Models\CandidatoExperienciaLaboral;
use App\Models\Competencia;
use App\Models\TipoDepartamento;
use App\Models\TipoEstatus;
use App\Models\TipoEstatusCandidato;
use App\Models\TipoNivelCapacitacion;
use Illuminate\Http\Request;

class CandidatoController extends Controller
{
    public function __construct()
    {
        // $this->middleware('permisos:5,1', ['only' => ['index']]);
        // $this->middleware('permisos:5,2', ['only' => ['create']]);
        // $this->middleware('permisos:5,3', ['only' => ['edit']]);
        // $this->middleware('permisos:5,4', ['only' => ['destroy']]);
    }

    public function index()
    {
        $table = Candidato::all();
        return view("candidato.consulta", compact("table"));
    }

    public function create()
    {
        $id = null;
        $select_departamento = TipoDepartamento::all();
        $select_competencia = Competencia::all();
        $select_estatus = TipoEstatusCandidato::all();
        $select_nivel_capacitacion = TipoNivelCapacitacion::all();
        return view("candidato.registrar", compact("id", "select_departamento", "select_estatus", "select_nivel_capacitacion"));
    }

    public function edit($id)
    {
        $info = Candidato::where("id", $id)->first();
        $select_departamento = TipoDepartamento::all();
        $select_competencia = Competencia::all();
        $select_estatus = TipoEstatusCandidato::all();
        $select_nivel_capacitacion = TipoNivelCapacitacion::all();
        return view("candidato.registrar", compact("id", "info", "select_departamento", "select_estatus", "select_nivel_capacitacion"));
    }

    public function store(Request $request)
    {
        try {

            $id = $request->get("id");

            $candidato = Candidato::updateOrCreate([
                'id' => $id,
            ], [
                'departamento' => $request->get("departamento"),
                'documento_identidad' => $request->get("documento_identidad"),
                'nombre' => $request->get("nombre"),
                'puesto_postula' => $request->get("puesto_postula"),
                'salario_aspira' => $request->get("salario_aspira"),
                'recomendado_por' => $request->get("recomendado_por"),
                'estatus' => $request->get("estatus")
            ]);

            $id_candidato = $candidato->id;

            CandidatoCapacitacion::where("id_candidato", $id_candidato)->delete();

            $lista_capacitacion =  $request->get("listado_capacitacion");

            if (!empty($lista_capacitacion)) {
                foreach ($lista_capacitacion as $fila) {

                    $descripcion = $fila['descripcion'];
                    $id_nivel = $fila['id_nivel'];
                    $fecha_desde = $fila['fecha_desde'];
                    $fecha_hasta = $fila['fecha_hasta'];
                    $cursando = $fila['cursando'];
                    $institucion = $fila['institucion'];

                    CandidatoCapacitacion::updateOrCreate([
                        'id' => 0,
                    ], [
                        'id_candidato' => $id_candidato,
                        'descripcion' => $descripcion,
                        'id_nivel' => $id_nivel,
                        'fecha_desde' => $fecha_desde,
                        'fecha_hasta' => $fecha_hasta,
                        'cursando' => $cursando,
                        'institucion' => $institucion
                    ]);
                }
            }

            CandidatoCompetencia::where("id_candidato", $id_candidato)->delete();

            $lista_competencia =  $request->get("listado_competencia");

            if (!empty($lista_competencia)) {
                foreach ($lista_competencia as $fila) {

                    $id_competencia = $fila['id_competencia'];

                    CandidatoCompetencia::updateOrCreate([
                        'id' => 0,
                    ], [
                        'id_candidato' => $id_candidato,
                        'id_competencia' => $id_competencia
                    ]);
                }
            }

            CandidatoExperienciaLaboral::where("id_candidato", $id_candidato)->delete();

            
            $lista_competencia =  $request->get("listado_competencia");

            if (!empty($lista_competencia)) {
                foreach ($lista_competencia as $fila) {

                    $empresa = $fila['empresa'];
                    $descripcion_puesto = $fila['descripcion_puesto'];
                    $fecha_desde = $fila['fecha_desde'];
                    $fecha_hasta = $fila['fecha_hasta'];
                    $salario = $fila['salario'];
            
                    CandidatoExperienciaLaboral::updateOrCreate([
                        'id' => 0,
                    ], [
                        'id_candidato' => $id_candidato,
                        'empresa' => $empresa,
                        'descripcion_puesto' => $descripcion_puesto,
                        'fecha_desde' => $fecha_desde,
                        'fecha_hasta' => $fecha_hasta,
                        'salario' => $salario
                    ]);
                }
            }

            return route('candidato.index');
        } catch (\Throwable $th) {
            throw $th;
        }
    }

    public function destroy($id)
    {
        Candidato::where("id", $id)->delete();
        CandidatoCapacitacion::where("id_candidato", $id)->delete();
        CandidatoCompetencia::where("id_candidato", $id)->delete();
        CandidatoExperienciaLaboral::where("id_candidato", $id)->delete();
        return redirect('/candidato')->with('Deleted', 'Candidato Anulado!');
    }
}

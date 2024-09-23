<?php

namespace App\Http\Controllers;

use App\Models\Puesto;
use App\Models\TipoDepartamento;
use App\Models\TipoEstatus;
use App\Models\TipoNivelRiesgo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PuestoController extends Controller
{
    public function __construct()
    {
        // $this->middleware('permisos:5,1', ['only' => ['index']]);
        // $this->middleware('permisos:5,2', ['only' => ['create']]);
        // $this->middleware('permisos:5,3', ['only' => ['edit']]);
        // $this->middleware('permisos:5,4', ['only' => ['destroy']]);
    }

    public function listado_general()
    {
        if (tipo_role() != 3) {
            $table = Puesto::join("tipo_departamento", "puesto.id_departamento", "=", "tipo_departamento.id")
                ->join("tipo_estatus", "puesto.estatus", "=", "tipo_estatus.id")
                ->join("tipo_nivel_riesgo", "puesto.nivel_riesgo", "=", "tipo_nivel_riesgo.id")
                ->leftjoin("candidato", "candidato.puesto_postula", "=", "puesto.id")
                ->select(
                    "puesto.id",
                    "puesto.nombre As nombre_puesto",
                    "tipo_departamento.nombre As str_departamento",
                    "tipo_estatus.nombre As str_estatus",
                    "tipo_nivel_riesgo.nombre As str_nivel_riesgo",
                    DB::raw("CONCAT(FORMAT(puesto.salario_minimo, 2), ' a ', FORMAT(puesto.salario_maximo, 2)) As rango_salarial"),
                    DB::raw("COUNT(candidato.id) As cantidad_candidato")
                )
                ->where("puesto.estatus", 1) //Solo activos
                ->groupby(
                    "puesto.id",
                    "puesto.nombre",
                    "tipo_departamento.nombre",
                    "tipo_estatus.nombre",
                    "tipo_nivel_riesgo.nombre",
                    "puesto.salario_minimo",
                    "puesto.salario_maximo"
                )
                ->get();
        } else {

            $userId = id();

            $table = Puesto::join("tipo_departamento", "puesto.id_departamento", "=", "tipo_departamento.id")
                ->join("tipo_estatus", "puesto.estatus", "=", "tipo_estatus.id")
                ->join("tipo_nivel_riesgo", "puesto.nivel_riesgo", "=", "tipo_nivel_riesgo.id")
                ->leftjoin(
                    "candidato",
                    function ($join) use ($userId) {
                        $join->on('candidato.puesto_postula', '=', 'puesto.id');
                        $join->on('candidato.id_usuario', '!=', DB::raw($userId));
                    }
                )
                ->select(
                    "puesto.id",
                    "puesto.nombre As nombre_puesto",
                    "tipo_departamento.nombre As str_departamento",
                    "tipo_estatus.nombre As str_estatus",
                    "tipo_nivel_riesgo.nombre As str_nivel_riesgo",
                    DB::raw("CONCAT(FORMAT(puesto.salario_minimo, 2), ' a ', FORMAT(puesto.salario_maximo, 2)) As rango_salarial"),
                    DB::raw("COUNT(candidato.id) As cantidad_candidato")
                )
                ->where("puesto.estatus", 1) //Solo activos
                ->groupby(
                    "puesto.id",
                    "puesto.nombre",
                    "tipo_departamento.nombre",
                    "tipo_estatus.nombre",
                    "tipo_nivel_riesgo.nombre",
                    "puesto.salario_minimo",
                    "puesto.salario_maximo"
                )
                ->get();
        }
        return view("inicio.consulta", compact("table"));
    }

    public function index()
    {
        $table = Puesto::join("tipo_departamento", "puesto.id_departamento", "=", "tipo_departamento.id")
            ->join("tipo_estatus", "puesto.estatus", "=", "tipo_estatus.id")
            ->join("tipo_nivel_riesgo", "puesto.nivel_riesgo", "=", "tipo_nivel_riesgo.id")
            ->select(
                "puesto.id",
                "puesto.nombre",
                "tipo_departamento.nombre As str_departamento",
                "tipo_estatus.nombre As str_estatus",
                "tipo_nivel_riesgo.nombre As str_nivel_riesgo",
                DB::raw("CONCAT(FORMAT(puesto.salario_minimo, 2), ' a ', FORMAT(puesto.salario_maximo, 2)) As rango_salarial")
            )
            ->get();;
        return view("puesto.consulta", compact("table"));
    }

    public function create()
    {
        $id = null;
        $select_departamento = TipoDepartamento::all();
        $select_estatus = TipoEstatus::all();
        $select_nivel_riesgo = TipoNivelRiesgo::all();
        return view("puesto.registrar", compact("id", "select_departamento", "select_estatus", "select_nivel_riesgo"));
    }

    public function edit($id)
    {
        $info = Puesto::where("id", $id)->first();
        $select_departamento = TipoDepartamento::all();
        $select_estatus = TipoEstatus::all();
        $select_nivel_riesgo = TipoNivelRiesgo::all();
        return view("puesto.registrar", compact("id", "info", "select_departamento", "select_estatus", "select_nivel_riesgo"));
    }

    public function store(Request $request)
    {
        try {

            $id = $request->get("id");

            Puesto::updateOrCreate([
                'id' => $id,
            ], [
                'id_departamento' => $request->get("id_departamento"),
                'nombre' => $request->get("nombre"),
                'nivel_riesgo' => $request->get("nivel_riesgo"),
                'salario_minimo' => $request->get("salario_minimo"),
                'salario_maximo' => $request->get("salario_maximo"),
                'estatus' => $request->get("estatus")
            ]);

            return route('puesto.index');
        } catch (\Throwable $th) {
            throw $th;
        }
    }

    public function destroy($id)
    {
        $info = Puesto::where("id", $id);
        $info->delete();
        return redirect('/puesto')->with('Deleted', 'Puesto Eliminado!');
    }
}

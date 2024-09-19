<?php

namespace App\Http\Controllers;

use App\Models\Puesto;
use App\Models\TipoDepartamento;
use App\Models\TipoEstatus;
use App\Models\TipoNivelRiesgo;
use Illuminate\Http\Request;

class PuestoController extends Controller
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
        $table = Puesto::all();
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
            
            TipoDepartamento::updateOrCreate([
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

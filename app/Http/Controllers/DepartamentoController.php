<?php

namespace App\Http\Controllers;

use App\Models\TipoDepartamento;
use App\Models\TipoEstatus;
use Illuminate\Http\Request;

class DepartamentoController extends Controller
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
        $table = TipoDepartamento::join("tipo_estatus", "tipo_departamento.estatus", "=", "tipo_estatus.id")
            ->select("tipo_departamento.*", "tipo_estatus.nombre As str_estatus")
            ->get();
        return view("departamento.consulta", compact("table"));
    }

    public function create()
    {
        $id = null;
        $select_estatus = TipoEstatus::all();
        return view("departamento.registrar", compact("id", "select_estatus"));
    }

    public function edit($id)
    {
        $info = TipoDepartamento::where("id", $id)->first();
        $select_estatus = TipoEstatus::all();
        return view("departamento.registrar", compact("id", "info", "select_estatus"));
    }

    public function store(Request $request)
    {
        try {

            $id = $request->get("id");

            TipoDepartamento::updateOrCreate([
                'id' => $id,
            ], [
                'nombre' => $request->get("nombre"),
                'estatus' => $request->get("estatus")
            ]);

            return route('departamento.index');
        } catch (\Throwable $th) {
            throw $th;
        }
    }

    public function destroy($id)
    {
        $info = TipoDepartamento::where("id", $id);
        $info->delete();
        return redirect('/departamento')->with('Deleted', 'Departamento Eliminado!');
    }
}

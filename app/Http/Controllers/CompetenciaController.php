<?php

namespace App\Http\Controllers;

use App\Models\Competencia;
use App\Models\TipoEstatus;
use Illuminate\Http\Request;

class CompetenciaController extends Controller
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
        $table = Competencia::join("tipo_estatus", "competencia.estatus", "=", "tipo_estatus.id")
            ->select("competencia.*", "tipo_estatus.nombre As str_estatus")
            ->get();
        return view("competencia.consulta", compact("table"));
    }

    public function create()
    {
        $id = null;
        $select_estatus = TipoEstatus::all();
        return view("competencia.registrar", compact("id", "select_estatus"));
    }

    public function edit($id)
    {
        $info = Competencia::where("id", $id)->first();
        $select_estatus = TipoEstatus::all();
        return view("competencia.registrar", compact("id", "info", "select_estatus"));
    }

    public function store(Request $request)
    {
        try {

            $id = $request->get("id");

            Competencia::updateOrCreate([
                'id' => $id,
            ], [
                'nombre' => $request->get("nombre"),
                'estatus' => $request->get("estatus")
            ]);

            return route('competencia.index');
        } catch (\Throwable $th) {
            throw $th;
        }
    }

    public function destroy($id)
    {
        $info = Competencia::where("id", $id);
        $info->delete();
        return redirect('/competencia')->with('Deleted', 'Competencia Eliminado!');
    }
}

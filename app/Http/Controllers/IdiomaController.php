<?php

namespace App\Http\Controllers;

use App\Models\Idioma;
use App\Models\TipoEstatus;
use Illuminate\Http\Request;

class IdiomaController extends Controller
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
        $table = Idioma::join("tipo_estatus", "idioma.estatus", "=", "tipo_estatus.id")
                    ->select("idioma.*", "tipo_estatus.nombre As str_estatus")
                    ->get();
        return view("idioma.consulta", compact("table"));
    }

    public function create()
    {
        $id = null;
        $select_estatus = TipoEstatus::all();
        return view("idioma.registrar", compact("id", "select_estatus"));
    }

    public function edit($id)
    {
        $info = Idioma::where("id", $id)->first();
        $select_estatus = TipoEstatus::all();
        return view("idioma.registrar", compact("id", "info", "select_estatus"));
    }

    public function store(Request $request)
    {
        try {

            $id = $request->get("id");
            
            Idioma::updateOrCreate([
                'id' => $id,
                ], [
                'nombre' => $request->get("nombre"),
                'estatus' => $request->get("estatus")
            ]);

            return route('idioma.index');
            
        } catch (\Throwable $th) {
            throw $th;
        }
    }

    public function destroy($id)
    {
        $info = Idioma::where("id", $id);
        $info->delete();
        return redirect('/idioma')->with('Deleted', 'Idioma Eliminado!');
    }
}

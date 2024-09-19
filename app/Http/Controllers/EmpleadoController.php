<?php

namespace App\Http\Controllers;

use App\Models\Candidato;
use App\Models\Empleado;
use App\Models\Puesto;
use App\Models\TipoEstatus;
use Illuminate\Http\Request;

class EmpleadoController extends Controller
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
        $table = Empleado::all();
        return view("empledo.consulta", compact("table"));
    }

    public function edit($id)
    {
        $info = Empleado::where("id", $id)->first();
        $select_puesto = Puesto::all();
        $select_estatus = TipoEstatus::all();
        return view("empleado.registrar", compact("id", "info", "select_puesto", "select_estatus"));
    }

    public function store(Request $request)
    {
        try {

            $id = $request->get("id");
            
            Empleado::updateOrCreate([
                'id' => $id,
                ], [
                'cedula' => $request->get("cedula"),
                'nombre' => $request->get("nombre"),
                'fecha_ingreso' => $request->get("fecha_ingreso"),
                'puesto' => $request->get("puesto"),
                'salario_mensual' => $request->get("salario_mensual"),
                'estatus' => $request->get("estatus")
            ]);

            return route('empleado.index');
            
        } catch (\Throwable $th) {
            throw $th;
        }
    }

    public function destroy($id)
    {
        $info = Empleado::where("id", $id);
        $info->delete();
        return redirect('/empleado')->with('Deleted', 'Empleado Eliminado!');
    }
}

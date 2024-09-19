<?php

namespace App\Http\Controllers;

use App\Models\TipoEstatus;
use App\Models\TipoRole;
use App\Models\Usuario;
use Illuminate\Http\Request;

class UsuarioController extends Controller
{
    public function __construct()
    {
        // $this->middleware('permisos:1,1', ['only' => ['index']]);
        // $this->middleware('permisos:1,2', ['only' => ['create']]);
        // $this->middleware('permisos:1,3', ['only' => ['edit']]);
        // $this->middleware('permisos:1,4', ['only' => ['destroy']]);
    }

    public function index()
    {
        $table = Usuario::where("usuario.id", "!=", 0)->get();
        return view("usuario.consulta", compact("table"));
    }

    public function create()
    {
        $id = null;
        $select_role = TipoRole::select("id", "nombre")->get();
        return view("usuario.registrar", compact("id", "select_role"));
    }

    public function edit($id)
    {
        $info = Usuario::find($id);
        //$select_estatus = TipoEstatus::all();
        $select_role = TipoRole::select("id", "nombre")->get();
        return view("usuario.registrar", compact("id", "info", "select_role"));
    }

    public function store(Request $request)
    {
        try {

            if (empty($request->get("id"))) {
                Usuario::updateOrCreate([
                    'id' => $request->get("id"),
                ], [
                    'id_role' => $request->get("id_role"),
                    'nombre' => $request->get("nombre"),
                    'usuario' => $request->get("usuario"),
                    'password' => bcrypt($request->get('clave')),
                ]);
            } else {
                Usuario::updateOrCreate([
                    'id' => $request->get("id"),
                ], [
                    'id_role' => $request->get("id_role"),
                    'nombre' => $request->get("nombre"),
                    'usuario' => $request->get("usuario"),
                ]);
            }

            return route('usuario.index');
        } catch (\Throwable $th) {
            throw $th;
        }
    }

    public function actualizar_clave(Request $request)
    {
        try {

            $id = $request->get("id");

            Usuario::updateOrCreate([
                'id' => $id,
            ], [
                'password' => bcrypt($request->get('password')),
            ]);

            return route("usuario.index");
        } catch (\Throwable $th) {
            throw $th;
        }
    }

    public function destroy($id)
    {
        $usuario = Usuario::where("id", $id)->delete();
        return redirect('/usuario')->with('Deleted', 'Usuario Eliminado!');
    }
}

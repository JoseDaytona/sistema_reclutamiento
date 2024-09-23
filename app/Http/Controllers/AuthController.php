<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function login()
    {
        if (!check()) {
            return view('auth.login');
        } else {
            return redirect('/');
        }
    }

    public function registrar()
    {
        if (!check()) {
            return view('auth.registrar');
        } else {
            return redirect('/');
        }
    }

    public function store(Request $request)
    {
        try {
            $role = 3; //Candidato

            Usuario::updateOrCreate([
                'id' => 0,
            ], [
                'id_role' => $role,
                'documento_identidad' => $request->get("documento_identidad"),
                'nombre' => $request->get("nombre"),
                'usuario' => $request->get("usuario"),
                'email' => $request->get("correo_electronico"),
                'password' => bcrypt($request->get('clave')),
            ]);

            return route('login');

        } catch (\Throwable $th) {
            throw $th;
        }
    }

    public function auth(Request $request)
    {
        if (autenticar($request->get('usuario'), $request->get('password'))) {
            return redirect('/');
        } else {
            return redirect('/login')->with("Info", "Credenciales Incorrectas");
        }
    }

    public function logout()
    {
        logoff();
        return redirect('login');
    }
}

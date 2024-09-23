@extends('layout.login')
@section('main')
<div class="max-w-lg mx-auto  bg-white dark:bg-gray-800 rounded-lg shadow-md px-8 py-10 flex flex-col items-center">
    <h1 class="text-xl font-bold text-center text-gray-700 dark:text-gray-200 mb-8">Sistema Reclutamiento</h1>
    <form action="{{ route('auth') }}" method="Post" id="EntidadForm" class="w-full flex flex-col gap-4">
        @csrf
        <div class="flex items-start flex-col justify-start">
            <label for="usuario" class="text-sm text-gray-700 dark:text-gray-200 mr-2">Usuario</label>
            <input type="text" name="usuario" class="w-full px-3 dark:text-gray-200 dark:bg-gray-900 py-2 rounded-md border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500">
            <div for="usuario" class="text-xs text-red-700 mr-2"></div>
        </div>
        <div class="flex items-start flex-col justify-start">
            <label for="password" class="text-sm text-gray-700 dark:text-gray-200 mr-2">Contraseña</label>
            <input type="password" name="password" class="w-full px-3 dark:text-gray-200 dark:bg-gray-900 py-2 rounded-md border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500">
            <div for="password" class="text-xs text-red-700 mr-2"></div>
        </div>
        <button type="button" class="iniciarSesion bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md shadow-sm">Iniciar Sesión</button>
    </form>
    <div class="mt-4 text-center">
        <span class="text-sm text-gray-500 dark:text-gray-300">Aun no tiene una cuenta? </span>
        <a href="{{ route('registrarme') }}" class="text-blue-500 hover:text-blue-600">Registrate</a>
    </div>
    </form>
</div>
@endsection
@section('jquery')
<script>
    $(".iniciarSesion").click(function(e) {
        e.preventDefault();

        var entidad = $("#EntidadForm");

        if (validar(entidad)) {
            entidad.submit();
        }
    });
</script>
@endsection
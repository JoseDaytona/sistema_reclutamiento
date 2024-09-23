@extends('layout.login')
@section('main')
<div class="max-w-lg mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md px-8 py-10 flex flex-col items-center">
    <h1 class="text-xl font-bold text-center text-gray-700 dark:text-gray-200 mb-8">Sistema de Reclutamiento</h1>
    <form action="#" id="EntidadForm" class="w-full flex flex-col gap-4">
        <div class="grid grid-cols-2 gap-2">
            <div>
                <label for="documento_identidad" class="text-sm font-bold text-gray-700 dark:text-gray-200 mr-2">Documento Identidad</label>
                <input type="text" required name="documento_identidad" class="w-full px-3 dark:text-gray-200 dark:bg-gray-900 py-2 rounded-md border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500">
                <div for="documento_identidad" class="text-xs text-red-700 mr-2"></div>
            </div>
            <div>
                <label for="nombre" class="text-sm font-bold text-gray-700 dark:text-gray-200 mr-2">Nombre</label>
                <input type="text" required name="nombre" class="w-full px-3 dark:text-gray-200 dark:bg-gray-900 py-2 rounded-md border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500">
                <div for="nombre" class="text-xs text-red-700 mr-2"></div>
            </div>
        </div>
        <div class="grid grid-cols-2 gap-2">
            <div>
                <label for="usuario" class="text-sm font-bold text-gray-700 dark:text-gray-200 mr-2">Usuario</label>
                <input type="text" required name="usuario" class="w-full px-3 dark:text-gray-200 dark:bg-gray-900 py-2 rounded-md border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500">
                <div for="usuario" class="text-xs text-red-700 mr-2"></div>
            </div>
            <div>
                <label for="email" class="text-sm font-bold text-gray-700 dark:text-gray-200 mr-2">Correo Electronico</label>
                <input type="email" required name="email" class="w-full px-3 dark:text-gray-200 dark:bg-gray-900 py-2 rounded-md border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500">
                <div for="email" class="text-xs text-red-700 mr-2"></div>
            </div>
        </div>
        <div class="grid grid-cols-2 gap-2">
            <div>
                <label for="password" class="text-sm font-bold text-gray-700 dark:text-gray-200 mr-2">Contraseña</label>
                <input type="password" required name="password" class="w-full px-3 dark:text-gray-200 dark:bg-gray-900 py-2 rounded-md border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500">
                <div for="password" class="text-xs text-red-700 mr-2"></div>
            </div>
            <div>
                <label for="confirmPassword" class="text-sm font-bold text-gray-700 dark:text-gray-200 mr-2">Confirmar Contraseña</label>
                <input type="password" required name="confirmPassword" class="w-full px-3 dark:text-gray-200 dark:bg-gray-900 py-2 rounded-md border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500">
                <div for="confirmPassword" class="text-xs text-red-700 mr-2"></div>
            </div>
        </div>
        <button type="button" class="registrar bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md shadow-sm">Registrar</button>
    </form>
    <div class="mt-4 text-center">
        <span class="text-sm text-gray-500 dark:text-gray-300">Ya tienes una cuenta registrada? </span>
        <a href="login" class="text-blue-500 hover:text-blue-600">Iniciar Sesión</a>
    </div>
    </form>
</div>
@endsection
@section('jquery')
<script>
    $(document).ready(() => {
        $("input[name='documento_identidad']").inputmask("999-9999999-9");
    });
    
    $(".registrar").click(function(e) {
        e.preventDefault();

        var entidad = $("#EntidadForm");

        if (validar(entidad)) {
            notificarConfirmacion("Aviso", "Desea guardar este registro?", GuardarRegistro);
        }
    });

    function GuardarRegistro() {

        let documento_identidad = $("input[name='documento_identidad']").val();
        let nombre = $("input[name='nombre']").val();
        let usuario = $("input[name='usuario']").val();
        let correo_electronico = $("input[name='email']").val();
        let password = $("input[name='password']").val();

        $.ajax({
            type: "POST",
            url: "{{ route('registrar_usuario') }}",
            data: {
                documento_identidad: documento_identidad,
                nombre: nombre,
                usuario: usuario,
                correo_electronico: correo_electronico,
                clave: password,
            },
            beforeSend: function() {
                //loader_logo_shown();
            },
            error: function(data) {
                //console.log(data)
                notificar("error", data.responseJSON.message)
                //loader_logo_hidden();
            },
            success: function(data) {
                //console.log(data)
                //loader_logo_hidden();
                var tipo = "success";
                var mensaje = "Perfil Registrado";
                notificar_url(tipo, mensaje, data)
            },
            complete: function(data) {
                //console.log(data)
            }
        })
    }
</script>
@endsection
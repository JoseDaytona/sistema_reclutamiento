@extends('layout.main')
@section('main')
<h1 class="text-2xl font-bold text-black pb-3">Gestión de Competencias</h1>
<hr>
<div class="w-full mt-2 bg-white">
    <p class="text-xl p-2 pl-3 flex items-center">
        <i class="fas fa-list mr-3"></i> Registar
    </p>
    <hr>
    <div class="leading-loose">
        <form class="p-4 bg-white rounded shadow-xl" id="EntidadForm">
            <input type="hidden" name="id" value="{{ $id }}">
            <div class="grid grid-cols-2 gap-2 mb-2">
                <div>
                    <label for="nombre" class="block text-sm text-gray-600">Nombre</label>
                    <input name="nombre" value="{{ !empty($info) ? $info->nombre : '' }}" type="text" required class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                    <div for="nombre" class="text-xs text-red-700 mr-2"></div>
                </div>
                <div>
                    <label for="estatus" class="block text-sm text-gray-600">Estatus</label>
                    <select required name="estatus" class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
                        <option value="">Elegir una opción</option>
                        @foreach($select_estatus as $row)
                        <option value="{{ $row->id }}" {{ !empty($info) ? ($info->estatus == $row->id ? 'Selected' : '') : '' }}>{{ $row->nombre }}</option>
                        @endforeach
                    </select>
                    <div for="estatus" class="text-xs text-red-700 mr-2"></div>
                </div>
            </div>
            <hr>
            <div class="grid grid-cols-2 gap-4 mt-2">
                <button type="button" class="registrar px-4 py-1 text-white font-light tracking-wider bg-green-600 rounded">Guardar</button>
                <a href="/competencia" class="px-4 text-center py-1 text-white font-light tracking-wider bg-red-800 rounded">Cancelar</a>
            </div>
        </form>
    </div>
</div>
@endsection
@section('jquery')
<script>
    $(".registrar").click(function(e) {
        e.preventDefault();

        var entidad = $("#EntidadForm");

        if (validar(entidad)) {
            notificarConfirmacion("Aviso", "Desea guardar este registro?", GuardarRegistro);
        }
    });

    function GuardarRegistro() {

        let id = $("input[name='id']").val();
        let nombre = $("input[name='nombre']").val();
        let estatus = $("select[name='estatus']").val();

        $.ajax({
            type: "POST",
            url: "{{ route('competencia.store') }}",
            data: {
                id: id,
                nombre: nombre,
                estatus: estatus
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
                var mensaje = "Registro Guardado!";
                notificar_url(tipo, mensaje, data)
            },
            complete: function(data) {
                //console.log(data)
            }
        })
    }
</script>
@endsection
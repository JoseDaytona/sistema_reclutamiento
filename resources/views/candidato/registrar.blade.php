@extends('layout.main')
@section('main')
<span><label class="text-2xl font-bold text-black pb-3">Aplicar Puesto: </label> <label class="text-xl">{{ $puesto->nombre }}</label></span>
<hr>
<div class="w-full mt-2 bg-white">
    <p class="text-xl p-2 pl-3 flex items-center">
        <i class="fas fa-list mr-3"></i> Registar Solicitud
    </p>
    <hr>
    <div class="leading-loose">
        <form class="p-4 bg-white rounded shadow-xl" id="EntidadForm">
            <input type="hidden" name="id" value="{{ $id }}">
            <input type="hidden" name="puesto_postula" value="{{ $puesto->id }}">
            <input type="hidden" name="departamento" value="{{ $puesto->id_departamento }}">
            <div class="grid grid-cols-4 gap-2 mb-4">
                <div>
                    <label for="documento_identidad" class="block text-sm text-gray-600">Nombre Puesto</label>
                    <input name="documento_identidad" value="{{ !empty($info) ? $info->nombre : user()->documento_identidad }}" type="text" required class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                    <div for="documento_identidad" class="text-xs text-red-700 mr-2"></div>
                </div>
                <div>
                    <label for="nombre" class="block text-sm text-gray-600">Nombre Puesto</label>
                    <input name="nombre" value="{{ !empty($info) ? $info->nombre : user()->nombre }}" type="text" required class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                    <div for="nombre" class="text-xs text-red-700 mr-2"></div>
                </div>
                <div>
                    <label for="salario_aspira" class="block text-sm text-gray-600">Salario Aspira</label>
                    <input name="salario_aspira" value="{{ !empty($info) ? $info->salario_aspira : $puesto->salario_minimo }}" type="number" required class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                    <div for="salario_aspira" class="text-xs text-red-700 mr-2"></div>
                </div>
                <div>
                    <label for="recomendado_por" class="block text-sm text-gray-600">Recomendado Por</label>
                    <input name="recomendado_por" value="{{ !empty($info) ? $info->recomendado_por : '' }}" type="text" required class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                    <div for="recomendado_por" class="text-xs text-red-700 mr-2"></div>
                </div>
            </div>
            <div class="grid grid-cols-3 gap-4 mb-3">
                <div>
                    <hr>
                    <h1 class="font-bold">Competencias</h1>
                    <hr>
                    <div class="grid grid-cols-3 gap-2 mb-2">
                        <div class="col-span-2">
                            <label for="competencia" class="block text-sm text-gray-600">Competencia</label>
                            <select name="competencia" class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
                                <option value="">Elegir una opción</option>
                                @foreach($select_competencia as $row)
                                <option value="{{ $row->id }}">{{ $row->nombre }}</option>
                                @endforeach
                            </select>
                            <div for="competencia" class="text-xs text-red-700 mr-2"></div>
                        </div>
                        <div class="mt-4">
                            <button type="button" class="registrar_competencia px-4 py-1 text-white font-light tracking-wider bg-blue-700 rounded">Agregar +</button>
                        </div>
                    </div>
                    <hr>
                    <div id="gvcompetencia"></div>
                </div>
                <div class="col-span-2">
                    <hr>
                    <h1 class="font-bold">Capacitaciones</h1>
                    <hr>
                    <div class="grid grid-cols-3 gap-2 mb-2">
                        <div>
                            <label for="descripcion_capacitacion" class="block text-sm text-gray-600">Nombre</label>
                            <input name="descripcion_capacitacion" type="text" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                            <div for="descripcion_capacitacion" class="text-xs text-red-700 mr-2"></div>
                        </div>
                        <div>
                            <label for="nivel_capacitacion" class="block text-sm text-gray-600">Nivel</label>
                            <select required name="nivel_capacitacion" class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
                                <option value="">Elegir una opción</option>
                                @foreach($select_nivel_capacitacion as $row)
                                <option value="{{ $row->id }}">{{ $row->nombre }}</option>
                                @endforeach
                            </select>
                            <div for="nivel_capacitacion" class="text-xs text-red-700 mr-2"></div>
                        </div>
                        <div>
                            <label for="fecha_desde_capacitacion" class="block text-sm text-gray-600">Desde</label>
                            <input name="fecha_desde_capacitacion" type="date" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                            <div for="fecha_desde_capacitacion" class="text-xs text-red-700 mr-2"></div>
                        </div>
                        <div>
                            <label for="fecha_hasta_capacitacion" class="block text-sm text-gray-600">Hasta</label>
                            <input name="fecha_hasta_capacitacion" type="date" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                            <div for="fecha_hasta_capacitacion" class="text-xs text-red-700 mr-2"></div>
                        </div>
                        <div>
                            <label for="institucion_capacitacion" class="block text-sm text-gray-600">Instutición</label>
                            <input name="institucion_capacitacion" type="text" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                            <div for="institucion_capacitacion" class="text-xs text-red-700 mr-2"></div>
                        </div>
                        <div class="mt-4">
                            <button type="button" class="registrar_capacitacion px-4 py-1 text-white font-light tracking-wider bg-blue-700 rounded">Agregar +</button>
                        </div>
                    </div>
                    <hr>
                    <div id="gvCapacitacion"></div>
                </div>
            </div>
            <div class="grid grid-cols-1 gap-4 mt-2">
                <div>
                    <hr>
                    <h1 class="font-bold">Experiencia Laboral</h1>
                    <hr>
                    <div class="grid grid-cols-6 gap-2 mb-2">
                        <div>
                            <label for="empresa_experiencia" class="block text-sm text-gray-600">Empresa</label>
                            <input name="empresa_experiencia" type="text" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                            <div for="empresa_experiencia" class="text-xs text-red-700 mr-2"></div>
                        </div>
                        <div>
                            <label for="puesto_experiencia" class="block text-sm text-gray-600">Puesto Ocupado</label>
                            <input name="puesto_experiencia" type="text" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                            <div for="puesto_experiencia" class="text-xs text-red-700 mr-2"></div>
                        </div>
                        <div>
                            <label for="fecha_desde_experiencia" class="block text-sm text-gray-600">Desde</label>
                            <input name="fecha_desde_experiencia" type="date" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                            <div for="fecha_desde_experiencia" class="text-xs text-red-700 mr-2"></div>
                        </div>
                        <div>
                            <label for="fecha_hasta_experiencia" class="block text-sm text-gray-600">Hasta</label>
                            <input name="fecha_hasta_experiencia" type="date" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                            <div for="fecha_hasta_experiencia" class="text-xs text-red-700 mr-2"></div>
                        </div>
                        <div>
                            <label for="salario_experiencia" class="block text-sm text-gray-600">Salario</label>
                            <input name="salario_experiencia" type="number" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                            <div for="salario_experiencia" class="text-xs text-red-700 mr-2"></div>
                        </div>
                        <div class="mt-4">
                            <button type="button" class="registrar_experiencias px-4 py-1 text-white font-light tracking-wider bg-blue-700 rounded">Agregar +</button>
                        </div>
                    </div>
                    <hr>
                    <div id="gvExperiencia"></div>
                </div>
            </div>
            <hr>
            <div class="grid grid-cols-2 gap-4 mt-2">
                <button type="button" class="registrar px-4 py-1 text-white font-light tracking-wider bg-green-600 rounded">Guardar</button>
                <a href="/puesto" class="px-4 text-center py-1 text-white font-light tracking-wider bg-red-800 rounded">Cancelar</a>
            </div>
        </form>
    </div>
</div>
@endsection
@section('jquery')
<script>
    let _gvcompetencia, _gvCapacitacion, _gvExperienciaLaboral;

    $(document).ready(() => {
        onloadGvCompetencia([]);
        onloadGvCapacitacion([]);
        onloadGvExperiencia([]);
    });

    $(".registrar").click(function(e) {
        e.preventDefault();

        var entidad = $("#EntidadForm");

        if (validar(entidad)) {
            notificarConfirmacion("Aviso", "Desea guardar este registro?", GuardarRegistro);
        }
    });

    $(".registrar_competencia").click(() => {

        let _competencia = $("select[name='competencia'] option:selected").val();
        let _strCompetencia = $("select[name='competencia'] option:selected").text();

        let _fila = {
            id_competencia: _competencia,
            str_competencia: _strCompetencia
        };

        let _listadoCompetencias = _gvcompetencia.getDataSource()._store._array;

        _listadoCompetencias.push(_fila);

        _gvcompetencia.option("dataSource", _listadoCompetencias);
    });

    $(".registrar_capacitacion").click(() => {

        let _descripcion_capacitacion = $("input[name='descripcion_capacitacion']").val();
        let _nivel_capacitacion = $("select[name='nivel_capacitacion'] option:selected").val();
        let _strnivel_capacitacion = $("select[name='nivel_capacitacion'] option:selected").text();
        let _fecha_desde_capacitacion = $("input[name='fecha_desde_capacitacion']").val();
        let _fecha_hasta_capacitacion = $("input[name='fecha_hasta_capacitacion']").val();
        let _institucion_capacitacion = $("input[name='institucion_capacitacion']").val();

        let _fila = {
            descripcion: _descripcion_capacitacion,
            id_nivel: _nivel_capacitacion,
            str_nivel: _strnivel_capacitacion,
            fecha_desde: _fecha_desde_capacitacion,
            fecha_hasta: _fecha_hasta_capacitacion,
            institucion: _institucion_capacitacion
        };

        let _listadoCapacitacion = _gvCapacitacion.getDataSource()._store._array;

        _listadoCapacitacion.push(_fila);

        _gvCapacitacion.option("dataSource", _listadoCapacitacion);
    });

    $(".registrar_experiencias").click(() => {
        let _empresaExperiencia = $("input[name='empresa_experiencia']").val();
        let _puesto_experiencia = $("input[name='puesto_experiencia']").val();
        let _fecha_desde_experiencia = $("input[name='fecha_desde_experiencia']").val();
        let _fecha_hasta_experiencia = $("input[name='fecha_hasta_experiencia']").val();
        let _salario_experiencia = $("input[name='salario_experiencia']").val();

        let _fila = {
            empresa: _empresaExperiencia,
            descripcion_puesto: _puesto_experiencia,
            fecha_desde: _fecha_desde_experiencia,
            fecha_hasta: _fecha_hasta_experiencia,
            salario: _salario_experiencia
        };

        let _listadoExperienciaLaboral = _gvExperienciaLaboral.getDataSource()._store._array;

        _listadoExperienciaLaboral.push(_fila);

        _gvExperienciaLaboral.option("dataSource", _listadoExperienciaLaboral);

    });

    function GuardarRegistro() {

        let id = $("input[name='id']").val();
        let id_departamento = $("input[name='departamento']").val();
        let puesto_postula = $("input[name='puesto_postula']").val();
        let documento_identidad = $("input[name='documento_identidad']").val();
        let nombre = $("input[name='nombre']").val();
        let salario_aspira = $("input[name='salario_aspira']").val();
        let recomendado_por = $("input[name='recomendado_por']").val();

        let _listadoCapacitacion = _gvCapacitacion.getDataSource()._store._array;
        let _listadoCompetencias = _gvcompetencia.getDataSource()._store._array;
        let _listadoExperienciaLaboral = _gvExperienciaLaboral.getDataSource()._store._array;

        $.ajax({
            type: "POST",
            url: "{{ route('candidato.store') }}",
            data: {
                id: id,
                departamento: id_departamento,
                documento_identidad: documento_identidad,
                puesto_postula: puesto_postula,
                nombre: nombre,
                puesto_postula: puesto_postula,
                salario_aspira: salario_aspira,
                recomendado_por: recomendado_por,
                listado_capacitacion: _listadoCapacitacion,
                listado_competencia: _listadoCompetencias,
                listado_experiencia: _listadoExperienciaLaboral
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

    function onloadGvCompetencia(data) {
        _gvcompetencia = $("#gvcompetencia").dxDataGrid({
            dataSource: data,
            // columnHidingEnabled: true,
            columnsAutoWidth: false,
            allowColumnResizing: false,
            showBorders: true,
            columnChooser: {
                enabled: false,
                mode: "select" // or "dragAndDrop"
            },
            headerFilter: {
                visible: true,
            },
            paging: {
                enabled: true,
                pageSize: 10
            },
            export: {
                fileName: "",
                proxyUrl: "",
            },
            scrolling: {
                columnRenderingMode: "virtual"
            },
            sorting: {
                mode: 'multiple'
            },
            filterRow: {
                visible: false,
                applyFilter: "auto"
            },
            searchPanel: {
                visible: false,
                width: 240,
                placeholder: "Filtrar..."
            },
            pager: {
                showPageSizeSelector: true,
                allowedPageSizes: [10, 25, 50, 100],
                showNavigationButtons: true,
                showInfo: true
            },
            rowAlternationEnabled: false,
            remoteOperations: false,
            groupPanel: {
                visible: false
            },
            columns: [{
                caption: "Competencia",
                dataField: "str_competencia",
                alignment: "left",
                width: "20%",
                cssClass: "alignment-center text-uppercase",
            }],
            width: '100%',
        }).dxDataGrid('instance');
    }

    function onloadGvCapacitacion(data) {
        _gvCapacitacion = $("#gvCapacitacion").dxDataGrid({
            dataSource: data,
            // columnHidingEnabled: true,
            columnsAutoWidth: false,
            allowColumnResizing: false,
            showBorders: true,
            columnChooser: {
                enabled: false,
                mode: "select" // or "dragAndDrop"
            },
            headerFilter: {
                visible: true,
            },
            paging: {
                enabled: true,
                pageSize: 10
            },
            export: {
                fileName: "",
                proxyUrl: "",
            },
            scrolling: {
                columnRenderingMode: "virtual"
            },
            sorting: {
                mode: 'multiple'
            },
            filterRow: {
                visible: false,
                applyFilter: "auto"
            },
            searchPanel: {
                visible: false,
                width: 240,
                placeholder: "Filtrar..."
            },
            pager: {
                showPageSizeSelector: true,
                allowedPageSizes: [10, 25, 50, 100],
                showNavigationButtons: true,
                showInfo: true
            },
            rowAlternationEnabled: false,
            remoteOperations: false,
            groupPanel: {
                visible: false
            },
            columns: [{
                caption: "Capacitación",
                dataField: "descripcion",
                alignment: "left",
                width: "auto",
                cssClass: "alignment-center text-uppercase",
            },{
                caption: "Nivel",
                dataField: "str_nivel",
                alignment: "left",
                width: "auto",
                cssClass: "alignment-center text-uppercase",
            },{
                caption: "Desde",
                dataField: "fecha_desde",
                alignment: "left",
                width: "auto",
                cssClass: "alignment-center text-uppercase",
            },{
                caption: "Hasta",
                dataField: "fecha_hasta",
                alignment: "left",
                width: "auto",
                cssClass: "alignment-center text-uppercase",
            },{
                caption: "Institución",
                dataField: "institucion",
                alignment: "left",
                width: "auto",
                cssClass: "alignment-center text-uppercase",
            }],
            width: '100%',
        }).dxDataGrid('instance');
    }

    function onloadGvExperiencia(data) {
        _gvExperienciaLaboral = $("#gvExperiencia").dxDataGrid({
            dataSource: data,
            // columnHidingEnabled: true,
            columnsAutoWidth: false,
            allowColumnResizing: false,
            showBorders: true,
            columnChooser: {
                enabled: false,
                mode: "select" // or "dragAndDrop"
            },
            headerFilter: {
                visible: true,
            },
            paging: {
                enabled: true,
                pageSize: 10
            },
            export: {
                fileName: "",
                proxyUrl: "",
            },
            scrolling: {
                columnRenderingMode: "virtual"
            },
            sorting: {
                mode: 'multiple'
            },
            filterRow: {
                visible: false,
                applyFilter: "auto"
            },
            searchPanel: {
                visible: false,
                width: 240,
                placeholder: "Filtrar..."
            },
            pager: {
                showPageSizeSelector: true,
                allowedPageSizes: [10, 25, 50, 100],
                showNavigationButtons: true,
                showInfo: true
            },
            rowAlternationEnabled: false,
            remoteOperations: false,
            groupPanel: {
                visible: false
            },
            columns: [{
                caption: "Empresa",
                dataField: "empresa",
                alignment: "left",
                width: "20%",
                cssClass: "alignment-center text-uppercase",
            },{
                caption: "Puesto",
                dataField: "descripcion_puesto",
                alignment: "left",
                width: "20%",
                cssClass: "alignment-center text-uppercase",
            },{
                caption: "Desde",
                dataField: "fecha_desde",
                alignment: "left",
                width: "20%",
                cssClass: "alignment-center text-uppercase",
            },{
                caption: "Hasta",
                dataField: "fecha_hasta",
                alignment: "left",
                width: "20%",
                cssClass: "alignment-center text-uppercase",
            },{
                caption: "Salario",
                dataField: "salario",
                alignment: "left",
                width: "20%",
                cssClass: "alignment-center text-uppercase",
            }],
            width: '100%',
        }).dxDataGrid('instance');
    }
</script>
@endsection
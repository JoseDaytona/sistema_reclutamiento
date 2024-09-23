@extends('layout.main')
@section('main')
<h1 class="text-2xl font-bold text-black pb-3">Gestión de Empleados</h1>
<hr>
<div class="w-full mt-6 bg-white">
    <div class="p-4">
        <div id="gvtable"></div>
    </div>
</div>
@endsection
@section('jquery')
<script>
    $(document).ready(function() {
        CargarGrilla(@json($table));
    });

    function CargarGrilla(data) {
        $("#gvtable").dxDataGrid({
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
                visible: true,
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
                    caption: "Acción",
                    alignment: "left",
                    width: "auto",
                    cssClass: "alignment-center text-uppercase d-flex justify-content-center btns-tb",
                    cellTemplate: function(container, cellInfo) {
                        var html = "<div class='grid grid-cols-2 gap-1'>";

                        var url_e = "{{ route('empleado.edit', 'key_codigo') }}";
                        url_e = url_e.replace("key_codigo", cellInfo.data.id);
                        html += '<a href="' + url_e + '" style="margin-left: 10px;" class="px-4 py-1 text-white text-center font-light tracking-wider bg-blue-700 rounded">Editar</a>';

                        var url_d = '{{ route("empleado.destroy", "key_codigo") }}';
                        url_d = url_d.replace("key_codigo", cellInfo.data.id);
                        html += '<form name="frm_delete" action="' + url_d + '" method="post" class="ml-2" style="margin-left: 10px;">';
                        html += '@method("delete")'
                        html += '@csrf'
                        html += '<button type="button" class="px-4 py-1 text-white font-light tracking-wider text-center bg-red-600 rounded btn_delete_consultar">Eliminar</button></form>';
                        html += '</div>'
                        $(html).appendTo(container);
                    }
                },
                {
                    caption: "Departamento",
                    dataField: "str_departamento",
                    alignment: "left",
                    width: "20%",
                    cssClass: "alignment-center text-uppercase",
                },
                {
                    caption: "Puesto",
                    dataField: "str_puesto",
                    alignment: "left",
                    width: "20%",
                    cssClass: "alignment-center text-uppercase",
                },
                {
                    caption: "Nombre",
                    dataField: "nombre",
                    alignment: "left",
                    width: "20%",
                    cssClass: "alignment-center text-uppercase",
                },
                {
                    caption: "Salario",
                    dataField: "salario_mensual",
                    alignment: "left",
                    width: "auto",
                    cssClass: "alignment-center text-uppercase",
                },
                {
                    caption: "Fecha Ingreso",
                    dataField: "fecha_ingreso",
                    dataType: "date",
                    format: "dd/MM/yyyy",
                    deserializeValue: function(value) {
                        if (value != null) {
                            return ConvertISODatetoDateFormat(value);
                        }
                    },
                    alignment: "left",
                    width: "auto",
                    cssClass: "alignment-center text-uppercase",
                }
            ],
            width: '100%',
        }).dxDataGrid('instance');
    }
</script>
@endsection
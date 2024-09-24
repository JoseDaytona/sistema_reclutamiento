@extends('layout.main')
@section('main')
<h1 class="text-2xl font-bold text-black pb-3">Gestión de Empleados</h1>
<hr>
<div class="w-full mt-6 bg-white">
    <div class="flex p-2">
        <button type="button" class="btnExportarLista w-40 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md shadow-sm">Exportar Reporte</a>
    </div>
    <hr>
    <div class="p-4">
        <div id="gvtable"></div>
    </div>
</div>
@endsection
@section('jquery')
<script>
    let _gvTable;

    $(document).ready(function() {
        CargarGrilla(@json($table));
    });

    $(".btnExportarLista").click(function() {
        // Llamar al método de exportación
        _gvTable.exportToExcel(false);
    });

    function CargarGrilla(data) {
        _gvTable = $("#gvtable").dxDataGrid({
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
                enabled: true,
                fileName: "Empleados",
                allowExportSelectedData: false
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
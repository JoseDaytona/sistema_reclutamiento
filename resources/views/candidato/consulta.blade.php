@extends('layout.main')
@section('main')
<label><span class="text-2xl font-bold text-black pb-3">Candidatos al Puesto: </span><span class="text-xl text-black pb-3">{{ $puesto_postula->nombre }}</span></label>
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
                        if (cellInfo.data.id_estatus == 1) {
                            var url_e = "{{ route('procesar_candidato', ['candidato' => 'key_codigo', 'estatus' => '2' ]) }}";
                            url_e = url_e.replace("key_codigo", cellInfo.data.id);
                            html += '<a href="' + url_e + '" style="margin-left: 10px;" class="px-4 py-1 text-white text-center font-light tracking-wider bg-blue-700 rounded">Aceptar</a>';

                            url_e = "{{ route('procesar_candidato', ['candidato' => 'key_codigo', 'estatus' => '3' ]) }}";
                            url_e = url_e.replace("key_codigo", cellInfo.data.id);
                            html += '<a href="' + url_e + '" style="margin-left: 10px;" class="px-4 py-1 text-white text-center font-light tracking-wider bg-red-700 rounded">Rechazar</a>';
                        }
                        else
                        {
                            html += '<label class="text-xl font-bold ' + (cellInfo.data.id_estatus == 2 ? 'text-green-700' : 'text-red-700') + '">' + cellInfo.data.estatus + '</label>';
                        }

                        html += '</div>';
                        $(html).appendTo(container);
                    }
                },
                {
                    caption: "Candidato",
                    dataField: "str_candidato",
                    alignment: "left",
                    width: "20%",
                    cssClass: "alignment-center text-uppercase",
                },
                {
                    caption: "Puesto",
                    dataField: "puesto_postula",
                    alignment: "left",
                    width: "20%",
                    cssClass: "alignment-center text-uppercase",
                },
                {
                    caption: "Salario Aspira",
                    dataField: "salario_aspira",
                    alignment: "left",
                    width: "20%",
                    cssClass: "alignment-center text-uppercase",
                },
                {
                    caption: "Recomendado por",
                    dataField: "recomendado_por",
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
@extends('layout.main')
@section('main')
<h1 class="text-2xl font-bold text-black pb-3">Mis Postulaciones</h1>
<hr>
<div class="w-full mt-6 bg-white">
    <div class="p-4">
        <div class="flex space-x-4">
            @if($table->count() > 0)
            @foreach($table as $row)
            <div class="max-w-sm p-4 pb-3 bg-white border border-gray-200 rounded-lg shadow-md">
                <h5 class="mb-2 text-xl font-bold tracking-tight text-gray-900">{{ $row->nombre_puesto }}</h5>
                <hr>
                <p class="mt-3 mb-3 text-gray-700"><span class="font-bold">Departamento: </span>{{ $row->str_departamento }}</p>
                <p class="mb-3 text-gray-700"><span class="font-bold">Nivel Riesgo: </span>{{ $row->str_nivel_riesgo }}</p>
                <p class="mb-3 text-gray-700"><span class="font-bold">Rango Salarial: </span>{{ $row->rango_salarial }}</p>
                <p class="mb-3 text-gray-700"><span class="font-bold">Candidatos: </span>{{ $row->cantidad_candidato }}</p>
                <hr>
                <!-- @if(tipo_role() != 3)
                <div class="grid grid-cols-1 mt-2">
                    <a href="{{ route('candidatos', $row->id) }}" class="w-full px-4 py-1 text-center text-white font-light tracking-wider bg-green-600 rounded">
                        Ver Candidatos
                    </a>
                </div>
                @else
                <div class="grid grid-cols-1 mt-2">
                    <a href="{{ route('postularme', $row->id) }}" class="w-full px-4 py-1 text-center text-white font-light tracking-wider bg-blue-700 rounded">
                        Postularme
                    </a>
                </div>
                @endif -->
            </div>
            @endforeach
            @else
            <div class="grid grid-rows-4 grid-flow-col gap-4">
                <div class="grid grid-rows-subgrid gap-4 row-span-3">
                    <div class="row-start-2">
                        <h2 class="row-start-2 w-full px-4 py-1 text-center text-black font-light tracking-wider bg-green-300 rounded">
                            No has aplicado a ningun puesto
                        </h2>
                    </div>
                </div>
            </div>
            @endif
        </div>
    </div>
</div>
@endsection
@section('jquery')
<script>

</script>
@endsection
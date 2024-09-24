<aside class="relative bg-sidebar h-screen w-64 hidden sm:block shadow-xl">
    <div class="p-3">
        <a href="/" class="text-white text-md font-semibold uppercase hover:text-gray-300">Sistema de Reclutamiento</a>
    </div>
    <hr>
    <nav class="text-white text-base font-semibold pt-3">
        <a href="" class="{{ (request()->is('/')) ? 'active-nav-link' : 'opacity-75 hover:opacity-100' }} flex items-center text-white py-4 pl-6 nav-item">
            <i class="fas fa-tachometer-alt mr-3"></i>
            Inicio
        </a>
        @if(tipo_role() != 3)
        <a href="empleado" class="{{ (request()->is('empleado*')) ? 'active-nav-link' : 'opacity-75 hover:opacity-100' }} flex items-center text-white py-4 pl-6 nav-item">
            <i class="fas fa-calendar mr-3"></i>
            Empleados
        </a>
        <a href="competencia" class="{{ (request()->is('competencia*')) ? 'active-nav-link' : 'opacity-75 hover:opacity-100' }} flex items-center text-white py-4 pl-6 nav-item">
            <i class="fas fa-sticky-note mr-3"></i>
            Competencias
        </a>
        <a href="puesto" class="{{ (request()->is('puesto*')) ? 'active-nav-link' : 'opacity-75 hover:opacity-100' }} flex items-center text-white py-4 pl-6 nav-item">
            <i class="fas fa-table mr-3"></i>
            Puestos
        </a>
        <a href="idioma" class="{{ (request()->is('idioma*')) ? 'active-nav-link' : 'opacity-75 hover:opacity-100' }} flex items-center text-white py-4 pl-6 nav-item">
            <i class="fas fa-align-left mr-3"></i>
            Idiomas
        </a>
        <a href="departamento" class="{{ (request()->is('departamento*')) ? 'active-nav-link' : 'opacity-75 hover:opacity-100' }} flex items-center text-white py-4 pl-6 nav-item">
            <i class="fas fa-tablet-alt mr-3"></i>
            Departamentos
        </a>
        @endif
    </nav>
    @if(tipo_role() == 3)
    <a href="mis_postulaciones" class="absolute w-full upgrade-btn bottom-0 active-nav-link text-white flex items-center justify-center py-4">
        <i class="fas fa-list mr-3"></i>
        Mis Postulaciones
    </a>
    @endif
</aside>
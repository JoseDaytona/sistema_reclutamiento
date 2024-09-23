<header class="w-full flex items-center bg-white py-2 px-6 hidden sm:flex">
    <div class="w-1/2"></div>
    <div x-data="{ isOpen: false }" class="relative w-1/2 flex justify-end">
        <button @click="isOpen = !isOpen" class="realtive z-10 w-12 h-12 rounded-full overflow-hidden border-4 border-gray-400 hover:border-gray-300 focus:border-gray-300 focus:outline-none">
            <img src="https://static-00.iconduck.com/assets.00/user-icon-2048x2048-ihoxz4vq.png">
        </button>
        <button x-show="isOpen" @click="isOpen = false" class="h-full w-full fixed inset-0 cursor-default"></button>
        <div x-show="isOpen" class="absolute w-[30%] bg-white rounded-lg shadow-lg py-2 mt-16">
            <label class="block px-4 py-2 font-bold">{{ user()->nombre }}</label>
            <hr>
            <a href="{{ route('logout') }}" class="block px-4 py-2 account-link hover:text-white">Cerrar Sesión</a>
        </div>
    </div>
</header>
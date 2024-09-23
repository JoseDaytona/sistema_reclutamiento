<!DOCTYPE html>
<html lang="en">

<head>
    <base href="../" />
    <title>{{ nombre_sistema() }}</title>
    <meta name="csrf-token" content="{{ csrf_token() }}" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="mobile-web-app-capable" content="yes" />
    <!-- <link rel="shortcut icon" href="{{ asset('theme/media/logos/favicon.ico') }}" /> -->
    <link href="https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css" rel="stylesheet">
    <link rel="stylesheet" href="{{ asset('theme/plugins/devExpress/css/dx.light.css') }}" />
    <link href="{{ asset('theme/plugins/select2/css/select2.min.css') }}" rel="stylesheet" />
    <link rel="stylesheet" href="{{ asset('theme/plugins/sweetalert/sweetalert.css') }}">
    <style>
        @import url('https://fonts.googleapis.com/css?family=Karla:400,700&display=swap');

        .font-family-karla {
            font-family: karla;
        }

        .bg-sidebar {
            background: #3d68ff;
        }

        .cta-btn {
            color: #3d68ff;
        }

        .upgrade-btn {
            background: #1947ee;
        }

        .upgrade-btn:hover {
            background: #0038fd;
        }

        .active-nav-link {
            background: #1947ee;
        }

        .nav-item:hover {
            background: #1947ee;
        }

        .account-link:hover {
            background: #3d68ff;
        }
    </style>
</head>

<body class="bg-gray-100 font-family-karla flex">
    @include('layout.menu')
    <div class="relative w-full flex flex-col h-screen overflow-y-hidden">
        @include('layout.header')
        <div class="w-full h-screen overflow-x-hidden border-t flex flex-col">
            <main class="w-full flex-grow p-6">
                @yield('main')
            </main>
            @include('layout.footer')
        </div>
    </div>
    <script
        src="https://code.jquery.com/jquery-3.7.1.js"
        integrity="sha256-eKhayi8LEQwp4NKxN+CfCh+3qOVUtJn3QNZ0TciWLP4="
        crossorigin="anonymous"></script>

    <script src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine.min.js" defer></script>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/js/all.min.js" integrity="sha256-KzZiKy0DWYsnwMF+X1DvQngQ2/FxF7MF3Ff72XcpuPs=" crossorigin="anonymous"></script>

    <script src="{{ asset('theme/plugins/inputmask/min/jquery.inputmask.bundle.min.js') }}"></script>

    <script src="{{ asset('theme/plugins/select2/js/select2.min.js') }}"></script>

    <script src="{{ asset('theme/plugins/sweetalert/sweetalert.js') }}"></script>
    
    <script type="text/javascript" src="{{ asset('theme/plugins/devExpress/js/jszip.js') }}"></script>
    
    <script type="text/javascript" src="{{ asset('theme/plugins/devExpress/js/dx.all.js') }}"></script>
    
    <script type="text/javascript" src="{{ asset('theme/plugins/devExpress/js/localization/dx.messages.es.js') }}"></script>

    <script src="{{ asset('theme/js/app_reclutamiento.js?v=' . random_number()) }}"></script>
    @if(session()->get('Info'))
    <script>
        $(function() {
            swal({
                title: "{{ subdominio() }}",
                text: "{{ session()->get('Info') }}",
                type: "info",
            });
        });
    </script>
    @endif
    @if(session()->get('Saved'))
    <script>
        $(function() {
            swal({
                title: "Registro Guardado",
                text: "{{ session()->get('Saved') }}",
                type: "success",
            });
        });
    </script>
    @endif
    @if(session()->get('Updated'))
    <script>
        $(function() {
            swal({
                title: "Registro Actualizado",
                text: "{{ session()->get('Updated') }}",
                type: "success",
            });
        });
    </script>
    @endif
    @if(session()->get('Deleted'))
    <script>
        $(function() {
            swal({
                title: "Registro Eliminado",
                text: "{{ session()->get('Deleted') }}",
                type: "error",
            });
        });
    </script>
    @endif
    @if(session()->get('Warning'))
    <script>
        $(function() {
            swal({
                title: "Detente!",
                text: "{{ session()->get('Warning') }}",
                type: "warning",
            });
        });
    </script>
    @endif
    @yield('jquery')
    @yield('modal_post_jquery')
</body>

</html>
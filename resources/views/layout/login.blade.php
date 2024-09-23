<!DOCTYPE html>
<html lang="en">
<!--begin::Head-->

<head>
	<title>{{ nombre_sistema() }}</title>
	<meta charset="utf-8" />
	<meta name="csrf-token" content="{{ csrf_token() }}" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<link href="https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css" rel="stylesheet">
	<link rel="stylesheet" href="{{ asset('theme/plugins/sweetalert/sweetalert.css') }}">
</head>

<body class="h-screen overflow-hidden flex items-center justify-center" style="background: #a3bdd8;">
	@yield('main')
	<script
		src="https://code.jquery.com/jquery-3.7.1.js"
		integrity="sha256-eKhayi8LEQwp4NKxN+CfCh+3qOVUtJn3QNZ0TciWLP4="
		crossorigin="anonymous"></script>

	<script src="{{ asset('theme/plugins/inputmask/min/jquery.inputmask.bundle.min.js') }}"></script>

	<script src="{{ asset('theme/plugins/select2/js/select2.min.js') }}"></script>

	<script src="{{ asset('theme/plugins/sweetalert/sweetalert.js') }}"></script>

	<script src="{{ asset('theme/js/app_reclutamiento.js?v=' . random_number()) }}"></script>
	@if(session()->get('Warning'))
	<script>
		$(function() {
			swal.fire({
				title: "Detente!",
				text: "{{ session()->get('Warning') }}",
				icon: "warning",
			});
		});
	</script>
	@endif
	@if(session()->get('Info'))
	<script>
		$(function() {

			swal({
				title: "Alerta!",
				text: "{{ session()->get('Info') }}",
				icon: "info",
			});
		});
	</script>
	@endif
	@yield('jquery')
</body>

</html>
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title>{{ config('app.name', 'Laravel') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @vite(['resources/css/app.css', 'resources/js/app.js'])
    </head>
    <body class="font-sans text-gray-900 antialiased" style="background: linear-gradient(135deg, #0F2027 0%, #203A43 50%, #2C5364 100%);">
        <div class="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0">
            <div class="mb-4 px-4">
                <a href="/" class="flex items-center justify-center">
                    <div class="flex flex-col items-center">
                        <span class="text-4xl font-extrabold text-white tracking-wider" style="letter-spacing: 0.05em;">Manajemen Barang</span>
                    </div>
                </a>
            </div>

            <div class="w-full sm:max-w-md mt-6 px-6 py-8 bg-white shadow-2xl overflow-hidden sm:rounded-2xl border border-gray-200/50 backdrop-blur-sm">
                {{ $slot }}
            </div>

            <div class="mt-8 text-center text-sm text-gray-300">
                <p>&copy; 2026 Manajemen Barang CSC. All rights reserved.</p>
            </div>
        </div>
    </body>
</html>

<x-guest-layout>
    <!-- Session Status -->
    <x-auth-session-status class="mb-6" :status="session('status')" />

    <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900 text-center">Selamat Datang</h1>
        <p class="text-center text-gray-600 text-sm mt-2">Masuk ke akun Anda untuk melanjutkan</p>
    </div>

    <form method="POST" action="{{ route('login') }}" class="space-y-5">
        @csrf

        <!-- Email Address -->
        <div>
            <x-input-label for="email" :value="__('Email')" />
            <x-text-input id="email" class="block mt-2 w-full" type="email" name="email" :value="old('email')" required autofocus autocomplete="username" placeholder="your@email.com" />
            <x-input-error :messages="$errors->get('email')" class="mt-2" />
        </div>

        <!-- Password -->
        <div>
            <x-input-label for="password" :value="__('Password')" />

            <x-text-input id="password" class="block mt-2 w-full"
                            type="password"
                            name="password"
                            required autocomplete="current-password"
                            placeholder="••••••••" />

            <x-input-error :messages="$errors->get('password')" class="mt-2" />
        </div>

        <!-- Remember Me -->
        <div class="flex items-center justify-between">
            <label for="remember_me" class="inline-flex items-center">
                <input id="remember_me" type="checkbox" class="rounded border-2 border-gray-300 text-teal-600 shadow-sm focus:ring-2 focus:ring-teal-500/20" name="remember">
                <span class="ms-2 text-sm text-gray-600">{{ __('Ingat saya') }}</span>
            </label>

            @if (Route::has('password.request'))
                <a class="text-sm text-teal-600 hover:text-teal-700 font-medium transition-colors" href="{{ route('password.request') }}">
                    {{ __('Lupa password?') }}
                </a>
            @endif
        </div>

        <div class="flex flex-col space-y-4 pt-2">
            <x-primary-button class="w-full justify-center">
                {{ __('Masuk') }}
            </x-primary-button>

            <p class="text-center text-sm text-gray-600">
                {{ __('Belum punya akun?') }}
                <a href="{{ route('register') }}" class="text-teal-600 hover:text-teal-700 font-semibold transition-colors">
                    {{ __('Daftar sekarang') }}
                </a>
            </p>
        </div>
    </form>
</x-guest-layout>

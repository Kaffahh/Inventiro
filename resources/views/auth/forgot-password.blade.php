<x-guest-layout>
    <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900 text-center">Lupa Password?</h1>
        <p class="text-center text-gray-600 text-sm mt-2">Tidak masalah. Kami akan mengirimkan link reset password ke email Anda.</p>
    </div>

    <div class="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
        <p>{{ __('Masukkan alamat email Anda dan kami akan mengirimkan link untuk reset password.') }}</p>
    </div>

    <!-- Session Status -->
    <x-auth-session-status class="mb-6" :status="session('status')" />

    <form method="POST" action="{{ route('password.email') }}" class="space-y-5">
        @csrf

        <!-- Email Address -->
        <div>
            <x-input-label for="email" :value="__('Email')" />
            <x-text-input id="email" class="block mt-2 w-full" type="email" name="email" :value="old('email')" required autofocus placeholder="your@email.com" />
            <x-input-error :messages="$errors->get('email')" class="mt-2" />
        </div>

        <div class="flex flex-col space-y-4 pt-2">
            <x-primary-button class="w-full justify-center">
                {{ __('Kirim Link Reset') }}
            </x-primary-button>

            <div class="text-center">
                <a class="text-sm text-teal-600 hover:text-teal-700 font-medium transition-colors" href="{{ route('login') }}">
                    {{ __('Kembali ke login') }}
                </a>
            </div>
        </div>
    </form>
</x-guest-layout>

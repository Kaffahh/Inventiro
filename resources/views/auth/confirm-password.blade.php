<x-guest-layout>
    <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900 text-center">Konfirmasi Password</h1>
        <p class="text-center text-gray-600 text-sm mt-2">Ini adalah area aman. Silakan konfirmasi password Anda terlebih dahulu</p>
    </div>

    <div class="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
        <p>{{ __('Masukkan password Anda untuk melanjutkan ke area yang aman.') }}</p>
    </div>

    <form method="POST" action="{{ route('password.confirm') }}" class="space-y-5">
        @csrf

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

        <div class="flex items-center justify-center pt-2">
            <x-primary-button class="w-full justify-center">
                {{ __('Konfirmasi') }}
            </x-primary-button>
        </div>
    </form>
</x-guest-layout>

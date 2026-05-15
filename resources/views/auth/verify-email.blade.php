<x-guest-layout>
    <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900 text-center">Verifikasi Email</h1>
        <p class="text-center text-gray-600 text-sm mt-2">Terima kasih sudah mendaftar!</p>
    </div>

    <div class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
        <p>{{ __('Silakan verifikasi alamat email Anda dengan mengklik link yang kami kirim. Jika Anda tidak menerima email, kami dengan senang hati akan mengirimkan yang lain.') }}</p>
    </div>

    @if (session('status') == 'verification-link-sent')
        <div class="mb-6 px-4 py-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800 font-medium flex items-start space-x-3">
            <svg class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
            <span>{{ __('Link verifikasi baru telah dikirim ke email yang Anda gunakan saat mendaftar.') }}</span>
        </div>
    @endif

    <div class="flex flex-col space-y-3">
        <form method="POST" action="{{ route('verification.send') }}">
            @csrf
            <x-primary-button class="w-full justify-center">
                {{ __('Kirim Ulang Email Verifikasi') }}
            </x-primary-button>
        </form>

        <form method="POST" action="{{ route('logout') }}">
            @csrf
            <button type="submit" class="w-full px-6 py-3 text-center border-2 border-gray-300 text-gray-700 rounded-lg font-semibold text-sm hover:border-gray-400 hover:bg-gray-50 transition-all duration-200">
                {{ __('Logout') }}
            </button>
        </form>
    </div>
</x-guest-layout>

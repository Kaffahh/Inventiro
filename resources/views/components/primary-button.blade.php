<button {{ $attributes->merge(['type' => 'submit', 'class' => 'inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-lg font-semibold text-sm text-white uppercase tracking-widest transform hover:scale-105 transition ease-in-out duration-150 shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2', 'style' => 'background: linear-gradient(135deg, #203A43 0%, #2C5364 100%); focus-ring-color: rgba(44, 83, 100, 0.5);']) }}>
    {{ $slot }}
</button>

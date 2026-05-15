@props(['disabled' => false])

<input @disabled($disabled) {{ $attributes->merge(['class' => 'block w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:ring-offset-0 transition-all duration-200 text-gray-900 placeholder-gray-500 disabled:bg-gray-100 disabled:text-gray-600 disabled:cursor-not-allowed']) }}>

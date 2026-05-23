@props(['messages'])

@if ($messages)
    <ul {{ $attributes->merge(['class' => 'text-sm text-red-600 space-y-1 mt-1.5 flex items-start space-x-2']) }}>
        @foreach ((array) $messages as $message)
            <li class="flex items-center"><span class="inline-block w-1 h-1 bg-red-600 rounded-full mr-2"></span>{{ $message }}</li>
        @endforeach
    </ul>
@endif

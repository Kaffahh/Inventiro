import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { FormEventHandler } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';

export default function Login({
    status,
}: {
    status?: string;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />
            <div className="relative overflow-hidden rounded-xl bg-white px-6 py-8 shadow-xl ring-1 ring-gray-200 dark:bg-gray-800 dark:ring-gray-700 sm:px-8">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.14),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.12),_transparent_35%)] dark:bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.18),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.14),_transparent_35%)]" />
                <div className="relative mb-8 space-y-3 text-center">
                    <div className="inline-flex items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1 text-xs font-bold uppercase tracking-[0.3em] text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
                        Inventiro
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                            Selamat datang kembali
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-400">
                            Masuk untuk melanjutkan pengelolaan barang dan transaksi.
                        </p>
                    </div>
                </div>

                {status && (
                    <div className="relative mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-200">
                        {status}
                    </div>
                )}

                <form onSubmit={submit} className="relative space-y-5">
                    <div>
                        <InputLabel
                            htmlFor="email"
                            value="Email"
                            className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-gray-500 dark:text-gray-400"
                        />
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full rounded-2xl border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-emerald-500 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500"
                            autoComplete="username"
                            isFocused={true}
                            placeholder="nama@perusahaan.com"
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel
                            htmlFor="password"
                            value="Password"
                            className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-gray-500 dark:text-gray-400"
                        />
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="mt-1 block w-full rounded-2xl border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-emerald-500 focus:ring-emerald-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500"
                            autoComplete="current-password"
                            placeholder="Masukkan password"
                            onChange={(e) => setData('password', e.target.value)}
                        />
                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <div className="flex items-center justify-between gap-3">
                        <label className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                            <Checkbox
                                name="remember"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                            />
                            <span>Ingat saya</span>
                        </label>
                    </div>

                    <PrimaryButton
                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-400 focus:bg-emerald-400 focus:ring-emerald-400 dark:bg-emerald-400 dark:text-gray-950"
                        disabled={processing}
                    >
                        Masuk ke dashboard
                        <ArrowRight size={16} />
                    </PrimaryButton>
                </form>
            </div>
        </GuestLayout>
    );
}
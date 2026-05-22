import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { FormEventHandler } from 'react';

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
        <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
            <Head title="Log in" />

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.24),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(34,197,94,0.18),_transparent_35%),linear-gradient(135deg,_#020617_0%,_#0f172a_45%,_#08111f_100%)]" />
            <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(148,163,184,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.12)_1px,transparent_1px)] [background-size:48px_48px]" />

            <div className="relative mx-auto flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
                <div className="w-full max-w-lg overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-[0_30px_120px_-30px_rgba(0,0,0,0.8)] backdrop-blur-xl">
                    <div className="flex items-center justify-center p-6 sm:p-8 lg:p-10">
                        <div className="w-full rounded-[1.75rem] border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-black/30 sm:p-8">
                            <div className="mb-8 space-y-4 text-center">
                                <div>
                                    <p className="text-xl font-bold uppercase tracking-[0.25em] text-emerald-300/80">
                                        Inventiro
                                    </p>
                                    <h2 className="mt-2 text-3xl font-bold tracking-tight text-white">
                                        Selamat datang kembali
                                    </h2>
                                    <p className="mt-2 text-sm leading-6 text-slate-400">
                                        Masuk untuk melanjutkan pengelolaan barang dan transaksi.
                                    </p>
                                </div>
                            </div>

                            {status && (
                                <div className="mb-6 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                                    {status}
                                </div>
                            )}

                            <form onSubmit={submit} className="space-y-5">
                                <div>
                                    <InputLabel
                                        htmlFor="email"
                                        value="Email"
                                        className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-400"
                                    />
                                    <TextInput
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        className="mt-1 block w-full rounded-2xl border-white/10 bg-white/5 px-4 py-3 text-white shadow-none placeholder:text-slate-500 focus:border-emerald-400 focus:ring-emerald-400"
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
                                        className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-400"
                                    />
                                    <TextInput
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={data.password}
                                        className="mt-1 block w-full rounded-2xl border-white/10 bg-white/5 px-4 py-3 text-white shadow-none placeholder:text-slate-500 focus:border-emerald-400 focus:ring-emerald-400"
                                        autoComplete="current-password"
                                        placeholder="Masukkan password"
                                        onChange={(e) => setData('password', e.target.value)}
                                    />
                                    <InputError message={errors.password} className="mt-2" />
                                </div>

                                <div className="flex items-center justify-between gap-3">
                                    <label className="flex items-center gap-3 text-sm text-slate-300">
                                        <Checkbox
                                            name="remember"
                                            checked={data.remember}
                                            onChange={(e) => setData('remember', e.target.checked)}
                                        />
                                        <span>Ingat saya</span>
                                    </label>
                                </div>

                                <PrimaryButton
                                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-950 shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-400 focus:bg-emerald-400 focus:ring-emerald-400"
                                    disabled={processing}
                                >
                                    Masuk ke dashboard
                                    <ArrowRight size={16} />
                                </PrimaryButton>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
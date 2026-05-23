import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, useForm, router } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import React, { useMemo, useState } from 'react';
import { Filter, Mail, MapPin, PencilLine, Plus, Search, Trash2, Users, UserRound, X } from 'lucide-react';

export default function UserManagementIndex() {
    const { users = { data: [] }, roles = [], gudangs = [], flash = { success: null, error: null } } = usePage().props as any;
    const form = useForm({ name: '', email: '', password: '', role_id: '', gudang_id: '' });
    const editForm = useForm({ id: '', name: '', email: '', role_id: '', password: '', gudang_id: '' });
    const [editing, setEditing] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRole, setSelectedRole] = useState<string>('Semua');

    const roleOptions = Array.isArray(roles) ? roles : [];
    const gudangOptions = Array.isArray(gudangs) ? gudangs : [];
    const userList = Array.isArray(users?.data) ? users.data : [];

    const filteredUsers = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();

        return userList.filter((user: any) => {
            const matchesSearch =
                !query ||
                [user.name, user.email, user.role?.name, user.gudang?.name]
                    .filter(Boolean)
                    .some((value: string) => value.toLowerCase().includes(query));

            const matchesRole = selectedRole === 'Semua' || user.role?.name === selectedRole;

            return matchesSearch && matchesRole;
        });
    }, [searchTerm, selectedRole, userList]);

    const roleChipClass = (roleName?: string) => {
        if (roleName === 'admin') return 'bg-slate-100 text-slate-700 dark:bg-slate-900/60 dark:text-slate-300';
        if (roleName === 'staff') return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300';
    };

    const closeEditModal = () => {
        setEditing(null);
        editForm.reset();
        editForm.clearErrors();
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post(route('users.store'), {
            onSuccess: () => form.reset(),
        });
    };

    const openEdit = (u: any) => {
        setEditing(u.id);
        editForm.setData({ id: u.id, name: u.name, email: u.email, role_id: u.role_id, password: '', gudang_id: u.gudang_id ?? '' });
        editForm.clearErrors();
    };

    const submitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        editForm.put(route('users.update', editForm.data.id), {
            onSuccess: () => setEditing(null),
        });
    };

    const doDelete = (id: number) => {
        if (!confirm('Hapus user ini?')) return;
        router.delete(route('users.destroy', id));
    };

    return (
        <AuthenticatedLayout header="Manajemen User">
            <Head title="Manajemen User" />

            <div className="space-y-6">
                {flash.success && (
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-400">
                        {flash.success}
                    </div>
                )}
                {flash.error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800 dark:border-red-800 dark:bg-red-950/20 dark:text-red-400">
                        {flash.error}
                    </div>
                )}

                <div className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 lg:flex-row lg:items-center lg:justify-between lg:p-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manajemen User</h1>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Kelola akun admin dan staff dalam satu halaman yang bersih dan mudah dibaca.</p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:min-w-[560px] lg:justify-end">
                        <div className="relative flex-1">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Cari nama, email, role, gudang..."
                                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 pl-10 text-sm text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-gray-800 dark:bg-gray-950 dark:text-white"
                            />
                        </div>
                        <div className="relative sm:w-48">
                            <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <select
                                value={selectedRole}
                                onChange={(e) => setSelectedRole(e.target.value)}
                                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 pl-10 text-sm text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-gray-800 dark:bg-gray-950 dark:text-white"
                            >
                                <option value="Semua">Semua Role</option>
                                {roleOptions.map((role: any) => (
                                    <option key={role.id} value={role.name}>{role.name}</option>
                                ))}
                            </select>
                        </div>
                        <button
                            onClick={() => {
                                setEditing(null);
                                form.reset();
                                form.clearErrors();
                            }}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500"
                        >
                            <Plus size={16} />
                            User Baru
                        </button>
                    </div>
                </div>

                <div className="grid gap-6 xl:grid-cols-5">
                    <div className="xl:col-span-2 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
                        <div className="border-b border-gray-100 px-6 py-5 dark:border-gray-800">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Buat User Baru</h2>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Tambahkan akun baru dengan role dan gudang yang sesuai.</p>
                        </div>

                        <form onSubmit={submit} className="space-y-4 p-6">
                            <div>
                                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">Nama</label>
                                <input
                                    placeholder="Nama lengkap"
                                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-gray-800 dark:bg-gray-950 dark:text-white"
                                    value={form.data.name}
                                    onChange={(e) => form.setData('name', e.target.value)}
                                />
                                <InputError message={form.errors.name} className="mt-1" />
                            </div>

                            <div>
                                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">Email</label>
                                <div className="relative">
                                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        placeholder="nama@email.com"
                                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pl-10 text-sm text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-gray-800 dark:bg-gray-950 dark:text-white"
                                        value={form.data.email}
                                        onChange={(e) => form.setData('email', e.target.value)}
                                    />
                                </div>
                                <InputError message={form.errors.email} className="mt-1" />
                            </div>

                            <div>
                                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">Password</label>
                                <input
                                    placeholder="Minimal 8 karakter"
                                    type="password"
                                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-gray-800 dark:bg-gray-950 dark:text-white"
                                    value={form.data.password}
                                    onChange={(e) => form.setData('password', e.target.value)}
                                />
                                <InputError message={form.errors.password} className="mt-1" />
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">Role</label>
                                    <select
                                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-gray-800 dark:bg-gray-950 dark:text-white"
                                        value={form.data.role_id}
                                        onChange={(e) => form.setData('role_id', e.target.value)}
                                    >
                                        <option value="">Pilih role</option>
                                        {roleOptions.map((role: any) => (
                                            <option key={role.id} value={role.id}>{role.name}</option>
                                        ))}
                                    </select>
                                    <InputError message={form.errors.role_id} className="mt-1" />
                                </div>

                                <div>
                                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">Gudang</label>
                                    <select
                                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-gray-800 dark:bg-gray-950 dark:text-white"
                                        value={form.data.gudang_id}
                                        onChange={(e) => form.setData('gudang_id', e.target.value)}
                                    >
                                        <option value="">Pilih gudang (untuk staff)</option>
                                        {gudangOptions.map((gudang: any) => (
                                            <option key={gudang.id} value={gudang.id}>{gudang.name}</option>
                                        ))}
                                    </select>
                                    <InputError message={form.errors.gudang_id} className="mt-1" />
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={form.processing}
                                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {form.processing ? 'Menyimpan...' : 'Buat User'}
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="xl:col-span-3 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/80 dark:bg-gray-800/50 text-xs uppercase tracking-wider font-bold text-gray-500 dark:text-gray-400">
                                        <th className="px-6 py-4">User</th>
                                        <th className="px-6 py-4">Role</th>
                                        <th className="px-6 py-4">Gudang</th>
                                        <th className="px-6 py-4">Email</th>
                                        <th className="px-6 py-4 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {filteredUsers.length > 0 ? filteredUsers.map((user: any) => (
                                        <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                                                        <UserRound size={18} />
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-gray-900 dark:text-white">{user.name}</div>
                                                        <div className="text-xs text-gray-500 dark:text-gray-400">ID #{user.id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold capitalize ${roleChipClass(user.role?.name)}`}>
                                                    {user.role?.name ?? '-'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                                                {user.gudang?.name ? (
                                                    <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                                                        <MapPin size={12} />
                                                        {user.gudang.name}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{user.email}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => openEdit(user)}
                                                        className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-emerald-500 hover:text-emerald-600 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300"
                                                    >
                                                        <PencilLine size={14} />
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => doDelete(user.id)}
                                                        className="inline-flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-300 dark:hover:bg-red-900/30"
                                                    >
                                                        <Trash2 size={14} />
                                                        Hapus
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-14 text-center">
                                                <div className="mx-auto max-w-sm">
                                                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-300">
                                                        <Users size={20} />
                                                    </div>
                                                    <h3 className="mt-4 text-base font-semibold text-gray-900 dark:text-white">Tidak ada user yang cocok</h3>
                                                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Coba ubah kata kunci atau reset filter untuk melihat data lainnya.</p>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setSearchTerm('');
                                                            setSelectedRole('Semua');
                                                        }}
                                                        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500"
                                                    >
                                                        Reset Filter
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {editing && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeEditModal}></div>
                        <div className="relative z-10 w-full max-w-xl overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900">
                            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5 dark:border-gray-800">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Edit User</h3>
                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Perbarui nama, email, role, dan gudang.</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={closeEditModal}
                                    className="rounded-xl p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <form onSubmit={submitEdit} className="space-y-4 p-6">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">Nama</label>
                                        <input
                                            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-gray-800 dark:bg-gray-950 dark:text-white"
                                            value={editForm.data.name}
                                            onChange={(e) => editForm.setData('name', e.target.value)}
                                        />
                                        <InputError message={editForm.errors.name} className="mt-1" />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">Email</label>
                                        <input
                                            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-gray-800 dark:bg-gray-950 dark:text-white"
                                            value={editForm.data.email}
                                            onChange={(e) => editForm.setData('email', e.target.value)}
                                        />
                                        <InputError message={editForm.errors.email} className="mt-1" />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">Role</label>
                                        <select
                                            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-gray-800 dark:bg-gray-950 dark:text-white"
                                            value={editForm.data.role_id}
                                            onChange={(e) => editForm.setData('role_id', e.target.value)}
                                        >
                                            <option value="">Pilih role</option>
                                            {roleOptions.map((role: any) => (
                                                <option key={role.id} value={role.id}>{role.name}</option>
                                            ))}
                                        </select>
                                        <InputError message={editForm.errors.role_id} className="mt-1" />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">Gudang</label>
                                        <select
                                            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-gray-800 dark:bg-gray-950 dark:text-white"
                                            value={editForm.data.gudang_id}
                                            onChange={(e) => editForm.setData('gudang_id', e.target.value)}
                                        >
                                            <option value="">Pilih gudang (untuk staff)</option>
                                            {gudangOptions.map((gudang: any) => (
                                                <option key={gudang.id} value={gudang.id}>{gudang.name}</option>
                                            ))}
                                        </select>
                                        <InputError message={editForm.errors.gudang_id} className="mt-1" />
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-400">Password Baru</label>
                                    <input
                                        placeholder="Kosongkan jika tidak diubah"
                                        type="password"
                                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-gray-800 dark:bg-gray-950 dark:text-white"
                                        value={editForm.data.password}
                                        onChange={(e) => editForm.setData('password', e.target.value)}
                                    />
                                    <InputError message={editForm.errors.password} className="mt-1" />
                                </div>

                                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                                    <button
                                        type="button"
                                        onClick={closeEditModal}
                                        className="inline-flex items-center justify-center rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={editForm.processing}
                                        className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {editForm.processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}

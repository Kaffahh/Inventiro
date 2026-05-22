import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, useForm } from '@inertiajs/react';
import React from 'react';

export default function UserManagementIndex() {
    const { users = { data: [] }, roles = [] , auth } = usePage().props as any;
    const form = useForm({ name: '', email: '', password: '', role_id: '' });

    const submit = (e: any) => {
        e.preventDefault();
        form.post(route('users.store'), {
            onSuccess: () => form.reset()
        });
    }

    return (
        <AuthenticatedLayout header="Manajemen User">
            <Head title="Manajemen User" />

            <div className="space-y-6">
                <form onSubmit={submit} className="bg-white p-6 rounded-2xl border">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <input placeholder="Nama" className="rounded-xl border px-4 py-2" value={form.data.name} onChange={e => form.setData('name', e.target.value)} />
                        <input placeholder="Email" className="rounded-xl border px-4 py-2" value={form.data.email} onChange={e => form.setData('email', e.target.value)} />
                        <select className="rounded-xl border px-4 py-2" value={form.data.role_id} onChange={e => form.setData('role_id', e.target.value)}>
                            <option value="">Pilih role</option>
                            {roles.map((r: any) => (<option key={r.id} value={r.id}>{r.name}</option>))}
                        </select>
                    </div>
                    <div className="mt-4 flex justify-end">
                        <button type="submit" className="px-4 py-2 rounded-xl bg-emerald-600 text-white">Buat User</button>
                    </div>
                </form>

                <div className="bg-white p-6 rounded-2xl border">
                    <h3 className="font-bold mb-4">Daftar User</h3>
                    <div>
                        {users.data.map((u: any) => (
                            <div key={u.id} className="py-2 border-b last:border-b-0">{u.name} — {u.email} — {u.role?.name}</div>
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}

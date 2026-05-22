import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, useForm, router } from '@inertiajs/react';
import React, { useState } from 'react';

export default function UserManagementIndex() {
    const { users = { data: [] }, roles = [] , auth } = usePage().props as any;
    const form = useForm({ name: '', email: '', password: '', role_id: '' });
    const editForm = useForm({ id: '', name: '', email: '', role_id: '', password: '' });
    const [editing, setEditing] = useState<any>(null);

    const submit = (e: any) => {
        e.preventDefault();
        form.post(route('users.store'), {
            onSuccess: () => form.reset()
        });
    }

    const openEdit = (u: any) => {
        setEditing(u.id);
        editForm.setData({ id: u.id, name: u.name, email: u.email, role_id: u.role_id, password: '' });
    };

    const submitEdit = (e: any) => {
        e.preventDefault();
        editForm.put(route('users.update', editForm.data.id), {
            onSuccess: () => { setEditing(null); }
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
                <form onSubmit={submit} className="bg-white p-6 rounded-2xl border">
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                        <input placeholder="Nama" className="rounded-xl border px-4 py-2" value={form.data.name} onChange={e => form.setData('name', e.target.value)} />
                        <input placeholder="Email" className="rounded-xl border px-4 py-2" value={form.data.email} onChange={e => form.setData('email', e.target.value)} />
                        <input placeholder="Password" type="password" className="rounded-xl border px-4 py-2" value={form.data.password} onChange={e => form.setData('password', e.target.value)} />
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
                            <div key={u.id} className="py-2 border-b last:border-b-0 flex items-center justify-between">
                                <div>{u.name} — {u.email} — <span className="text-sm text-gray-500">{u.role?.name}</span></div>
                                <div className="flex gap-2">
                                    <button onClick={() => openEdit(u)} className="px-3 py-1 rounded-xl border text-sm">Edit</button>
                                    <button onClick={() => doDelete(u.id)} className="px-3 py-1 rounded-xl border text-sm text-red-600">Hapus</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {editing && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                        <div className="bg-black/40 absolute inset-0" onClick={() => setEditing(null)}></div>
                        <div className="bg-white p-6 rounded-2xl border z-10 w-full max-w-lg">
                            <h3 className="font-bold mb-4">Edit User</h3>
                            <form onSubmit={submitEdit} className="space-y-4">
                                <input className="w-full rounded-xl border px-4 py-2" value={editForm.data.name} onChange={e => editForm.setData('name', e.target.value)} />
                                <input className="w-full rounded-xl border px-4 py-2" value={editForm.data.email} onChange={e => editForm.setData('email', e.target.value)} />
                                <select className="w-full rounded-xl border px-4 py-2" value={editForm.data.role_id} onChange={e => editForm.setData('role_id', e.target.value)}>
                                    <option value="">Pilih role</option>
                                    {roles.map((r: any) => (<option key={r.id} value={r.id}>{r.name}</option>))}
                                </select>
                                <input placeholder="Kosongkan untuk tidak merubah password" type="password" className="w-full rounded-xl border px-4 py-2" value={editForm.data.password} onChange={e => editForm.setData('password', e.target.value)} />
                                <div className="flex justify-end gap-2">
                                    <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 rounded-xl border">Batal</button>
                                    <button type="submit" className="px-4 py-2 rounded-xl bg-emerald-600 text-white">Simpan</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    )
}

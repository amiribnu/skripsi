import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

interface PermissionSet {
    view: boolean;
    create: boolean;
    update: boolean;
}

interface UserPermissions {
    master_user: PermissionSet;
    articles: PermissionSet;
    category_articles: PermissionSet;
    sitekit: PermissionSet;
    roles: PermissionSet;
    faq: PermissionSet;
}

interface UserData {
    name: string;
    email: string;
    permissions: UserPermissions;
}

export default function Roles() {
    const [userData, setUserData] = useState<UserData>({
        name: '',
        email: '',
        permissions: {
            master_user: { view: false, create: false, update: false },
            articles: { view: false, create: false, update: false },
            category_articles: { view: false, create: false, update: false },
            sitekit: { view: false, create: false, update: false },
            roles: { view: false, create: false, update: false },
            faq: { view: false, create: false, update: false },
        },
    });

    const handlePermissionChange = (module: keyof UserPermissions, permission: keyof PermissionSet) => {
        setUserData((prev) => {
            const modulePermissions = prev.permissions[module];
            return {
                ...prev,
                permissions: {
                    ...prev.permissions,
                    [module]: {
                        ...modulePermissions,
                        [permission]: !modulePermissions[permission],
                    },
                },
            };
        });
    };
    const permissions = [
        { module: 'Master Users', actions: ['View User', 'Create User', 'Update User'] },
        { module: 'Articles', actions: ['View Article', 'Create Article', 'Import Article'] },
        { module: 'Category Articles', actions: ['View User', 'Create User', 'Update User'] },
        { module: 'Site Kit', actions: ['View Site Kit', 'Create Site Kit', 'Update Site Kit'] },
        { module: 'Roles', actions: ['View Role', 'Create Role', 'Update Role'] },
        { module: 'FAQS', actions: ['View FAQ', 'Create FAQ', 'Update FAQ'] },
    ];

    return (
        <AppLayout>
            <Head title="Manajemen User" />

            <main className="flex-1 bg-gray-300 p-4">
                <div className="rounded-lg bg-white p-6 shadow-md">
                    <h2 className="mb-4 text-xl font-bold">Role/Data Master</h2>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="mb-2 block">Jabatan</label>
                            <select className="mb-4 w-full rounded border border-gray-300 p-2">
                                <option value="Pilih Jabatan" disabled selected hidden>
                                    Pilih Jabatan
                                </option>
                                <option value="Direktur">Direktur</option>
                                <option value="Manajer">Manajer</option>
                                <option value="Staff">Staff</option>
                            </select>
                            <label className="mb-2 block">Nama Karyawan</label>
                            <textarea className="h-40 w-full rounded border border-gray-300 p-2"></textarea>
                            <div className="mt-4 flex justify-between">
                                <button className="rounded bg-green-500 px-4 py-2 text-white">Simpan</button>
                                <button className="rounded bg-red-500 px-4 py-2 text-white">Batal</button>
                            </div>
                        </div>
                        <div>
                            <label className="mb-2 block">Otoritas akses</label>
                            <table className="min-w-full border border-gray-300 bg-white">
                                <thead>
                                    <tr className="bg-gray-300">
                                        <th className="border-b border-gray-300 px-4 py-2 text-left">Modul</th>
                                        <th className="border-b border-gray-300 px-4 py-2 text-left">Permission name</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {permissions.map((permission, index) => (
                                        <tr key={index}>
                                            <td className="border-b border-gray-300 px-4 py-2">{permission.module}</td>
                                            <td className="border-b border-gray-300 px-4 py-2">
                                                <div className="grid grid-cols-3 gap-4">
                                                    {permission.actions.map((action, idx) => (
                                                        <label key={idx} className="flex items-center space-x-2">
                                                            <input
                                                                type="radio"
                                                                name={permission.module.toLowerCase().replace(' ', '_')}
                                                                className="form-radio"
                                                            />
                                                            <span>{action}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                         
            </main>
        </AppLayout>
    );
}

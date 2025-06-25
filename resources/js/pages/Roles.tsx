import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
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

interface User {
  id: number;
  name: string;
}

interface Role {
  id: number;
  jabatan: string;
  user: User;
  permissions: UserPermissions;
}

interface PageProps {
  users: User[];
  roles: Role[];
}

export default function Roles({ users, roles }: PageProps) {
  const [formData, setFormData] = useState({
    user_id: 0,
    jabatan: '',
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
    setFormData((prev) => {
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

  const handleSubmit = () => {
    if (!formData.user_id || formData.user_id === 0) {
      alert('Pilih nama karyawan terlebih dahulu');
      return;
    }
    if (!formData.jabatan) {
      alert('Pilih jabatan terlebih dahulu');
      return;
    }
    router.post('/roles', formData);
  };

  const permissions = [
    { module: 'master_user', label: 'Master Users', actions: ['view', 'create', 'update'] },
    { module: 'articles', label: 'Articles', actions: ['view', 'create', 'update'] },
    { module: 'category_articles', label: 'Category Articles', actions: ['view', 'create', 'update'] },
    { module: 'sitekit', label: 'Site Kit', actions: ['view', 'create', 'update'] },
    { module: 'roles', label: 'Roles', actions: ['view', 'create', 'update'] },
    { module: 'faq', label: 'FAQS', actions: ['view', 'create', 'update'] },
  ];

  return (
    <AppLayout>
      <Head title="Manajemen User" />

      <main className="flex-1 bg-gray-300 p-4">
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-bold">Role/Data Master</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="mb-2 block">Nama Karyawan</label>
              <select
                className="mb-4 w-full rounded border border-gray-300 p-2"
                value={formData.user_id || ''}
                onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (!isNaN(value)) {
                    setFormData({ ...formData, user_id: value });
                    }
                }}
              >
                <option value="" disabled hidden>Pilih Karyawan</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>{user.name}</option>
                ))}
              </select>

              <label className="mb-2 block">Jabatan</label>
              <select
                className="mb-4 w-full rounded border border-gray-300 p-2"
                value={formData.jabatan}
                onChange={(e) => setFormData({ ...formData, jabatan: e.target.value })}
              >
                <option value="" disabled hidden>Pilih Jabatan</option>
                <option value="Direktur">Direktur</option>
                <option value="Manajer">Manajer</option>
                <option value="Staff">Staff</option>
              </select>

              <div className="mt-4 flex justify-between">
                <button onClick={handleSubmit} className="rounded bg-green-500 px-4 py-2 text-white">Simpan</button>
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
                      <td className="border-b border-gray-300 px-4 py-2">{permission.label}</td>
                      <td className="border-b border-gray-300 px-4 py-2">
                        <div className="grid grid-cols-3 gap-4">
                          {permission.actions.map((action, idx) => (
                            <label key={idx} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={formData.permissions[permission.module as keyof UserPermissions][action as keyof PermissionSet]}
                                onChange={() => handlePermissionChange(permission.module as keyof UserPermissions, action as keyof PermissionSet)}
                                className="form-checkbox"
                              />
                              <span>{action.charAt(0).toUpperCase() + action.slice(1)}</span>
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

          <div className="mt-8">
            <h2 className="mb-4 text-xl font-bold">Daftar Role Karyawan</h2>
            <table className="min-w-full border border-gray-300 bg-white">
              <thead>
                <tr className="bg-gray-300">
                  <th className="border-b border-gray-300 px-4 py-2 text-left">Nama</th>
                  <th className="border-b border-gray-300 px-4 py-2 text-left">Jabatan</th>
                  <th className="border-b border-gray-300 px-4 py-2 text-left">Permissions</th>
                </tr>
              </thead>
              <tbody>
                {roles.map((role) => (
                  <tr key={role.id}>
                    <td className="border-b border-gray-300 px-4 py-2">{role.user.name}</td>
                    <td className="border-b border-gray-300 px-4 py-2">{role.jabatan}</td>
                    <td className="border-b border-gray-300 px-4 py-2">
                      <ul className="list-disc pl-4">
                        {Object.entries(role.permissions).map(([module, perms]) => {
                          const granted = Object.entries(perms as PermissionSet)
                            .filter(([, allowed]) => allowed)
                            .map(([perm]) => `${perm} ${module.replace('_', ' ')}`);
                          return granted.map((text, i) => <li key={i}>{text}</li>);
                        })}
                      </ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </AppLayout>
  );
}
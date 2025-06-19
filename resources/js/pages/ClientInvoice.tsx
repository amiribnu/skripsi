import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Calendar, Download, MoreVertical, Plus } from 'lucide-react';
import { useState } from 'react';

interface ClientInvoiceItem {
    id: number;
    clientId: string;
    phone: string;
    email: string;
    name: string;
    companyAddress: string;
}

const sampleData: ClientInvoiceItem[] = [];

const SortIcon = ({ sorted }: { sorted: 'asc' | 'desc' | null }) => {
    return (
        <span className="sort-icon ml-1 inline-flex flex-col space-y-0.5">
            <span
                className={`inline-block h-0 w-0 border-r-[3px] border-b-[5px] border-l-[3px] border-r-transparent border-l-transparent ${sorted === 'asc' ? 'border-b-primary' : 'border-b-gray-400'}`}
            />
            <span
                className={`inline-block h-0 w-0 border-t-[5px] border-r-[3px] border-l-[3px] border-r-transparent border-l-transparent ${sorted === 'desc' ? 'border-t-primary' : 'border-t-gray-400'}`}
            />
        </span>
    );
};

const RequiredStar = () => <span className="text-red-500">*</span>;

export default function ClientManagement() {
    const [fromDate, setFromDate] = useState<string>('');
    const [toDate, setToDate] = useState<string>('');

    const [data, setData] = useState<ClientInvoiceItem[]>(sampleData);
    const [sortConfig, setSortConfig] = useState<{
        key: keyof ClientInvoiceItem;
        direction: 'asc' | 'desc';
    } | null>(null);
    const [showMenu, setShowMenu] = useState<number | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [entriesPerPage, setEntriesPerPage] = useState<number>(10);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [formData, setFormData] = useState<Omit<ClientInvoiceItem, 'id'>>({
        clientId: '',
        phone: '',
        email: '',
        name: '',
        companyAddress: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.clientId) newErrors.clientId = 'ID Client wajib diisi';
        if (!formData.phone) newErrors.phone = 'Nomor telepon wajib diisi';
        if (!formData.email) newErrors.email = 'Email wajib diisi';
        if (!formData.name) newErrors.name = 'Nama wajib diisi';
        if (!formData.companyAddress) newErrors.companyAddress = 'Alamat perusahaan wajib diisi';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const filteredData = data;
    const totalPages = Math.ceil(filteredData.length / entriesPerPage);
    const paginatedData = filteredData.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage);

    const handleSort = (key: keyof ClientInvoiceItem) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig?.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });

        const sorted = [...data].sort((a, b) => {
            if (!a[key] || !b[key]) return 0;
            if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
            if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
            return 0;
        });

        setData(sorted);
    };

    const renderSortIcon = (key: keyof ClientInvoiceItem) => {
        if (sortConfig?.key !== key) {
            return <SortIcon sorted={null} />;
        }
        return <SortIcon sorted={sortConfig.direction} />;
    };

    const handleAdd = () => {
        if (validateForm()) {
            const newItem: ClientInvoiceItem = {
                id: data.length > 0 ? Math.max(...data.map((item) => item.id)) + 1 : 1,
                clientId: formData.clientId,
                phone: formData.phone,
                email: formData.email,
                name: formData.name,
                companyAddress: formData.companyAddress,
            };
            setData([...data, newItem]);
            resetForm();
            setShowModal(false);
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus client ini?')) {
            setData(data.filter((item) => item.id !== id));
        }
    };

    const resetForm = () => {
        setFormData({
            clientId: '',
            phone: '',
            email: '',
            name: '',
            companyAddress: '',
        });
        setErrors({});
    };

    const handleExport = () => {
        const csvHeader = ['ID', 'ID Client', 'Nomor Telepon', 'Email', 'Nama', 'Alamat Perusahaan'];
        const csvRows = [csvHeader, ...data.map((item) => [item.id, item.clientId, item.phone, item.email, item.name, item.companyAddress])];

        const csvContent = csvRows.map((row) => row.map(String).join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'data-client.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <AppLayout>
            <Head title="Client" />
            <div className="space-y-4 p-4">
                <h1 className="text-2xl font-bold">Data Invoice / Client</h1>

                <Card className="p-4">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div className="flex flex-wrap items-center gap-2">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm text-gray-700">Filter by Date:</span>
                                </div>
                                <input
                                    type="date"
                                    className="rounded border px-2 py-1 text-sm"
                                    value={fromDate}
                                    onChange={(e) => setFromDate(e.target.value)}
                                />
                                <span className="text-sm text-gray-500">to</span>
                                <input
                                    type="date"
                                    className="rounded border px-2 py-1 text-sm"
                                    value={toDate}
                                    onChange={(e) => setToDate(e.target.value)}
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <Button
                                    onClick={() => {
                                        resetForm();
                                        setShowModal(true);
                                    }}
                                    className="flex items-center gap-1"
                                >
                                    <Plus className="h-4 w-4" />
                                    Tambah Client
                                </Button>
                                <Button variant="outline" className="flex items-center gap-1" onClick={handleExport}>
                                    <Download className="h-4 w-4" />
                                    Export Data
                                </Button>

                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600">Show</span>
                                    <select
                                        className="rounded border p-1 text-sm"
                                        value={entriesPerPage}
                                        onChange={(e) => {
                                            setEntriesPerPage(Number(e.target.value));
                                            setCurrentPage(1);
                                        }}
                                    >
                                        {[5, 10, 20, 50, 100].map((num) => (
                                            <option key={num} value={num}>
                                                {num}
                                            </option>
                                        ))}
                                    </select>
                                    <span className="text-sm text-gray-600">entries</span>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto rounded-lg border shadow-sm">
                            <table className="min-w-full divide-y">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-semibold whitespace-nowrap">No</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold whitespace-nowrap">
                                            <button
                                                onClick={() => handleSort('clientId')}
                                                className="hover:text-primary flex items-center transition-colors"
                                            >
                                                ID Client
                                                {renderSortIcon('clientId')}
                                            </button>
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold whitespace-nowrap">
                                            <button
                                                onClick={() => handleSort('phone')}
                                                className="hover:text-primary flex items-center transition-colors"
                                            >
                                                Nomor Telepon
                                                {renderSortIcon('phone')}
                                            </button>
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold whitespace-nowrap">
                                            <button
                                                onClick={() => handleSort('email')}
                                                className="hover:text-primary flex items-center transition-colors"
                                            >
                                                Email
                                                {renderSortIcon('email')}
                                            </button>
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold whitespace-nowrap">
                                            <button
                                                onClick={() => handleSort('name')}
                                                className="hover:text-primary flex items-center transition-colors"
                                            >
                                                Nama
                                                {renderSortIcon('name')}
                                            </button>
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold whitespace-nowrap">
                                            <button
                                                onClick={() => handleSort('companyAddress')}
                                                className="hover:text-primary flex items-center transition-colors"
                                            >
                                                Alamat Perusahaan
                                                {renderSortIcon('companyAddress')}
                                            </button>
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold whitespace-nowrap">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y bg-white">
                                    {paginatedData.length > 0 ? (
                                        paginatedData.map((item, index) => (
                                            <tr key={item.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 whitespace-nowrap">{(currentPage - 1) * entriesPerPage + index + 1}</td>
                                                <td className="px-4 py-3 whitespace-nowrap">{item.clientId}</td>
                                                <td className="px-4 py-3 whitespace-nowrap">{item.phone}</td>
                                                <td className="px-4 py-3 whitespace-nowrap">{item.email}</td>
                                                <td className="px-4 py-3 whitespace-nowrap">{item.name}</td>
                                                <td className="px-4 py-3 whitespace-nowrap">{item.companyAddress}</td>
                                                <td className="relative px-4 py-3 whitespace-nowrap">
                                                    <button
                                                        onClick={() => setShowMenu(showMenu === item.id ? null : item.id)}
                                                        className="rounded p-1 hover:bg-gray-200"
                                                    >
                                                        <MoreVertical className="h-4 w-4" />
                                                    </button>

                                                    {showMenu === item.id && (
                                                        <div className="absolute right-4 z-10 mt-1 w-32 rounded border bg-white shadow-md">
                                                            <button
                                                                onClick={() => {
                                                                    router.visit(`/invoice/`);
                                                                    setShowMenu(null);
                                                                }}
                                                                className="w-full px-4 py-2 text-left hover:bg-gray-100"
                                                            >
                                                                Details
                                                            </button>

                                                            <Link href={`/clients/${item.id}/edit`}>
                                                                <div className="px-4 py-2 hover:bg-gray-100" onClick={() => setShowMenu(null)}>
                                                                    Edit
                                                                </div>
                                                            </Link>

                                                            <button
                                                                onClick={() => {
                                                                    handleDelete(item.id);
                                                                    setShowMenu(null);
                                                                }}
                                                                className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-100"
                                                            >
                                                                Hapus
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                                                Tidak ada data ditemukan.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-4 flex justify-center gap-2">
                            <Button
                                variant="outline"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(currentPage - 1)}
                                className="h-10 w-10 rounded-full border-gray-200 bg-gray-100 text-gray-700 hover:bg-gray-200"
                            >
                                ‹
                            </Button>
                            <Button
                                variant="outline"
                                className="h-10 w-10 rounded-full border-gray-200 bg-gray-100 font-medium text-gray-700 hover:bg-gray-200"
                            >
                                {currentPage}
                            </Button>
                            <Button
                                variant="outline"
                                disabled={currentPage >= totalPages}
                                onClick={() => setCurrentPage(currentPage + 1)}
                                className="h-10 w-10 rounded-full border-gray-200 bg-gray-100 text-gray-700 hover:bg-gray-200"
                            >
                                ›
                            </Button>
                        </div>
                    </div>
                </Card>

                {/* Modal Add Form */}
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                        <div className="w-full max-w-md rounded bg-white p-6 shadow-lg">
                            <h2 className="mb-4 text-xl font-semibold">Tambah Client</h2>
                            <div className="space-y-3">
                                <div>
                                    <label className="mb-1 block text-sm font-medium">
                                        ID Client <RequiredStar />
                                    </label>
                                    <Input
                                        placeholder="Masukkan ID Client"
                                        value={formData.clientId}
                                        onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                                    />
                                    {errors.clientId && <p className="mt-1 text-xs text-red-500">{errors.clientId}</p>}
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium">
                                        Nomor Telepon <RequiredStar />
                                    </label>
                                    <Input
                                        placeholder="Masukkan nomor telepon"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                    {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium">
                                        Email <RequiredStar />
                                    </label>
                                    <Input
                                        placeholder="Masukkan email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                    {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium">
                                        Nama <RequiredStar />
                                    </label>
                                    <Input
                                        placeholder="Masukkan nama"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                    {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium">
                                        Alamat Perusahaan <RequiredStar />
                                    </label>
                                    <Input
                                        placeholder="Masukkan alamat perusahaan"
                                        value={formData.companyAddress}
                                        onChange={(e) => setFormData({ ...formData, companyAddress: e.target.value })}
                                    />
                                    {errors.companyAddress && <p className="mt-1 text-xs text-red-500">{errors.companyAddress}</p>}
                                </div>
                            </div>
                            <div className="mt-4 flex justify-end gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        resetForm();
                                        setShowModal(false);
                                    }}
                                >
                                    Tutup
                                </Button>
                                <Button onClick={handleAdd}>Simpan</Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Calendar, Download, MoreVertical, Plus } from 'lucide-react';
import { useState } from 'react';

interface SuratKeluarClient {
    keluar_client_id: number;
    nama_client: string;
    no_telp_client: string;
    email_client: string;
    alamat_client: string;
}

interface PageProps{
    myklien: SuratKeluarClient[];
}

//const sampleData: ClientSuratKeluarItem[] = [];

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

export default function ClientSuratKeluar({myklien}: PageProps) {
    const [fromDate, setFromDate] = useState<string>('');
    const [toDate, setToDate] = useState<string>('');

    const [data, setData] = useState<SuratKeluarClient[]>([]);
    const [sortConfig, setSortConfig] = useState<{
        key: keyof PageProps;
        direction: 'asc' | 'desc';
    } | null>(null);
    const [showMenu, setShowMenu] = useState<number | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [entriesPerPage, setEntriesPerPage] = useState<number>(10);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [formData, setFormData] = useState({
        nama_client: '',
        no_telp_client: '',
        email_client: '',
        alamat_client: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.nama_client) newErrors.nama_client = 'Nama wajib diisi';
        if (!formData.no_telp_client) newErrors.no_telp_client = 'Nomor Telepon wajib diisi';
        if (!formData.email_client) newErrors.email_client = 'Email wajib diisi';
        if (!formData.alamat_client) newErrors.alamat_client = 'Alamat perusahaan wajib diisi';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const filteredData = data;
    const totalPages = Math.ceil(filteredData.length / entriesPerPage);
    const paginatedData = filteredData.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage);

    const handleSort = (key: keyof ClientSuratKeluarItem) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig?.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });

        const sorted = [...client].sort((a, b) => {
            if (!a[key] || !b[key]) return 0;
            if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
            if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
            return 0;
        });

        (sorted);
    };

    const renderSortIcon = (key: keyof ClientSuratKeluarItem) => {
        if (sortConfig?.key !== key) {
            return <SortIcon sorted={null} />;
        }
        return <SortIcon sorted={sortConfig.direction} />;
    };

    /*const handleAdd = () => {
        if (validateForm()) {
            const newItem: ClientSuratKeluarItem = {
                keluar_client_id: client.length > 0 ? Math.max(...client.map((item) => item.keluar_client_id)) + 1 : 1,
                nama_client: formData.nama_client,
                no_telp_client: formData.no_telp_client,
                email_client: formData.email_client,
                alamat_client: formData.alamat_client,
            };
            setFormData([...data, newItem]);
            router.post(route("surat-keluar-client.store"), formData); 
            resetForm();
            setShowModal(false);
        }
    };*/

    const handleAdd = () => {
  if (validateForm()) {
    const SuratKeluarClient = {
      keluar_client_id: myklien.length > 0 ? Math.max(...myklien.map((item) => item.keluar_client_id)) + 1 : 1,
      nama_client: formData.nama_client,
      no_telp_client: formData.no_telp_client,
      email_client: formData.email_client,
      alamat_client: formData.alamat_client,
    };

    router.post(route("surat-keluar-client.store"), SuratKeluarClient); // ✅ kirim newItem, bukan formData

    resetForm();
    setShowModal(false);
  }
};

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus client ini?')) {
            setData(client.filter((item) => item.keluar_client_id !== id));
        }
    };

    const resetForm = () => {
        setFormData({
            nama_client: '',
            no_telp_client: '',
            email_client: '',
            alamat_client: '',
        });
        setErrors({});
    };

    const handleExport = () => {
        const csvHeader = ['ID', 'ID Client', 'Nomor Telepon', 'Email', 'Nama', 'Alamat Perusahaan'];
        const csvRows = [csvHeader, ...client.map((item) => [item.keluar_client_id, item.nama_client, item.no_telp_client, item.email_client, item.alamat_client])];

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
                <h1 className="text-2xl font-bold">Data Surat Keluar / Client</h1>
                
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
                                                onClick={() => handleSort('nama_client')}
                                                className="hover:text-primary flex items-center transition-colors"
                                            >
                                                Nama Client
                                                {renderSortIcon('nama_client')}
                                            </button>
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold whitespace-nowrap">
                                            <button
                                                onClick={() => handleSort('no_telp_client')}
                                                className="hover:text-primary flex items-center transition-colors"
                                            >
                                                Nomor Telepon Client
                                                {renderSortIcon('no_telp_client')}
                                            </button>
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold whitespace-nowrap">
                                            <button
                                                onClick={() => handleSort('email_client')}
                                                className="hover:text-primary flex items-center transition-colors"
                                            >
                                                Email Client
                                                {renderSortIcon('email_client')}
                                            </button>
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold whitespace-nowrap">
                                            <button
                                                onClick={() => handleSort('alamat_client')}
                                                className="hover:text-primary flex items-center transition-colors"
                                            >
                                                Alamat Client
                                                {renderSortIcon('alamat_client')}
                                            </button>
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold whitespace-nowrap">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y bg-white">
                                    {paginatedData.length > 0 ? (
                                        paginatedData.map((item, index) => (
                                            <tr key={item.keluar_client_id} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 whitespace-nowrap">{(currentPage - 1) * entriesPerPage + index + 1}</td>
                                                <td className="px-4 py-3 whitespace-nowrap">{item.nama_client}</td>
                                                <td className="px-4 py-3 whitespace-nowrap">{item.no_telp_client}</td>
                                                <td className="px-4 py-3 whitespace-nowrap">{item.email_client}</td>
                                                <td className="px-4 py-3 whitespace-nowrap">{item.alamat_client}</td>
                                                <td className="relative px-4 py-3 whitespace-nowrap">
                                                    <button
                                                        onClick={() => setShowMenu(showMenu === item.keluar_client_id ? null : item.keluar_client_id)}
                                                        className="rounded p-1 hover:bg-gray-200"
                                                    >
                                                        <MoreVertical className="h-4 w-4" />
                                                    </button>

                                                    {showMenu === item.keluar_client_id && (
                                                        <div className="absolute right-4 z-10 mt-1 w-32 rounded border bg-white shadow-md">
                                                            <button
                                                                onClick={() => {
                                                                    router.visit(`/persuratan/surat-keluar/`);
                                                                    setShowMenu(null);
                                                                }}
                                                                className="w-full px-4 py-2 text-left hover:bg-gray-100"
                                                            >
                                                                Details
                                                            </button>

                                                                <div className="px-4 py-2 hover:bg-gray-100" onClick={() => setShowMenu(null)}>
                                                                    Edit
                                                                </div>
                                                            

                                                            <button
                                                                onClick={() => {
                                                                    handleDelete(item.keluar_client_id);
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
                                        Nama Client <RequiredStar />
                                    </label>
                                    <Input
                                        placeholder="Masukkan nomor telepon"
                                        value={formData.nama_client}
                                        onChange={(e) => setFormData({ ...formData, nama_client: e.target.value })}
                                    />
                                    {errors.nama_client && <p className="mt-1 text-xs text-red-500">{errors.nama_client}</p>}
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium">
                                        Nomor Telepon Client <RequiredStar />
                                    </label>
                                    <Input
                                        placeholder="Masukkan Nomor Telepon"
                                        value={formData.no_telp_client}
                                        onChange={(e) => setFormData({ ...formData, no_telp_client: e.target.value })}
                                    />
                                    {errors.no_telp_client && <p className="mt-1 text-xs text-red-500">{errors.no_telp_client}</p>}
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium">
                                        Email Client <RequiredStar />
                                    </label>
                                    <Input
                                        placeholder="Masukkan Email Client"
                                        type="email"
                                        value={formData.email_client}
                                        onChange={(e) => setFormData({ ...formData, email_client: e.target.value })}
                                    />
                                    {errors.email_client && <p className="mt-1 text-xs text-red-500">{errors.email_client}</p>}
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium">
                                        Alamat Perusahaan <RequiredStar />
                                    </label>
                                    <Input
                                        placeholder="Masukkan alamat perusahaan"
                                        value={formData.alamat_client}
                                        onChange={(e) => setFormData({ ...formData, alamat_client: e.target.value })}
                                    />
                                    {errors.alamat_client && <p className="mt-1 text-xs text-red-500">{errors.alamat_client}</p>}
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

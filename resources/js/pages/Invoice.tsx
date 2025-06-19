import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Calendar, Download, MoreVertical, Plus } from 'lucide-react';
import { useState } from 'react';

interface InvoiceItem {
    id: number;
    customer: string;
    invoiceDate: string;
    totalNominal: string;
    tipeFile: string;
    namaFile: string;
    fileContent?: string;
}

const sampleData: InvoiceItem[] = [];

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

export default function SuratMasuk() {
    const [fromDate, setFromDate] = useState<string>('');
    const [toDate, setToDate] = useState<string>('');

    const [data, setData] = useState<InvoiceItem[]>(sampleData);
    const [sortConfig, setSortConfig] = useState<{
        key: keyof InvoiceItem;
        direction: 'asc' | 'desc';
    } | null>(null);
    const [showMenu, setShowMenu] = useState<number | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [viewItem, setViewItem] = useState<InvoiceItem | null>(null);
    const [entriesPerPage, setEntriesPerPage] = useState<number>(10);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [formData, setFormData] = useState<Omit<InvoiceItem, 'id'> & { file?: File }>({
        customer: '',
        invoiceDate: '',
        totalNominal: '',
        tipeFile: '',
        namaFile: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.customer) newErrors.customer = 'Customer wajib diisi';
        if (!formData.invoiceDate) newErrors.invoiceDate = 'Invoice date wajib diisi';
        if (!formData.totalNominal) newErrors.totalNominal = 'Nominal total wajib diisi';
        if (!formData.tipeFile) newErrors.tipeFile = 'Tipe file wajib dipilih';
        if (!formData.file) newErrors.file = 'File wajib diunggah';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const filteredData = data.filter((item) => {
        const itemDate = new Date(item.invoiceDate);
        const from = fromDate ? new Date(fromDate) : null;
        const to = toDate ? new Date(toDate) : null;

        return (!from || itemDate >= from) && (!to || itemDate <= to);
    });

    const totalPages = Math.ceil(filteredData.length / entriesPerPage);
    const paginatedData = filteredData.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage);

    const handleSort = (key: keyof InvoiceItem) => {
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

    const renderSortIcon = (key: keyof InvoiceItem) => {
        if (sortConfig?.key !== key) {
            return <SortIcon sorted={null} />;
        }
        return <SortIcon sorted={sortConfig.direction} />;
    };

    const handleAdd = () => {
        if (validateForm() && formData.file) {
            const newItem: InvoiceItem = {
                id: data.length > 0 ? Math.max(...data.map((item) => item.id)) + 1 : 1,
                customer: formData.customer,
                invoiceDate: formData.invoiceDate,
                totalNominal: formData.totalNominal,
                tipeFile: formData.tipeFile,
                namaFile: formData.file.name,
                fileContent: URL.createObjectURL(formData.file),
            };
            setData([...data, newItem]);
            resetForm();
            setShowModal(false);
            setViewItem(newItem);
            setShowViewModal(true);
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
            setData(data.filter((item) => item.id !== id));
        }
    };

    const handleDownload = (id: number) => {
        window.open(`/storage/invoice/${id}/download`, '_blank');
    };

    const handleView = (id: number) => {
        const item = data.find((item) => item.id === id);
        if (item) {
            setViewItem(item);
            setShowViewModal(true);
        }
    };

    const resetForm = () => {
        setFormData({
            customer: '',
            invoiceDate: '',
            totalNominal: '',
            tipeFile: '',
            namaFile: '',
        });
        setErrors({});
    };

    const handleExport = () => {
        const csvHeader = ['ID', 'Customer', 'Invoice Date', 'Total Nominal', 'Tipe File', 'Nama File'];
        const csvRows = [
            csvHeader,
            ...data.map((item) => [item.id, item.customer, item.invoiceDate, item.totalNominal, item.tipeFile, item.namaFile]),
        ];

        const csvContent = csvRows.map((row) => row.map(String).join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'data-customer.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <AppLayout>
            <Head title="Data Invoice" />
            <div className="space-y-4 p-4">
                <h1 className="text-2xl font-bold">Data Invoice</h1>

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
                                    Tambah Data
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
                                        <th className="px-4 py-3 text-left text-sm font-semibold whitespace-nowrap">
                                            <button
                                                onClick={() => handleSort('id')}
                                                className="hover:text-primary flex items-center transition-colors"
                                            >
                                                No
                                                {renderSortIcon('id')}
                                            </button>
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold whitespace-nowrap">
                                            <button
                                                onClick={() => handleSort('customer')}
                                                className="hover:text-primary flex items-center transition-colors"
                                            >
                                                Customer
                                                {renderSortIcon('customer')}
                                            </button>
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold whitespace-nowrap">
                                            <button
                                                onClick={() => handleSort('invoiceDate')}
                                                className="hover:text-primary flex items-center transition-colors"
                                            >
                                                Invoice Date
                                                {renderSortIcon('invoiceDate')}
                                            </button>
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold whitespace-nowrap">
                                            <button
                                                onClick={() => handleSort('totalNominal')}
                                                className="hover:text-primary flex items-center transition-colors"
                                            >
                                                Total Nominal
                                                {renderSortIcon('totalNominal')}
                                            </button>
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold whitespace-nowrap">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y bg-white">
                                    {paginatedData.length > 0 ? (
                                        paginatedData.map((item) => (
                                            <tr key={item.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 whitespace-nowrap">{item.id}</td>
                                                <td className="px-4 py-3 whitespace-nowrap">{item.customer}</td>
                                                <td className="px-4 py-3 whitespace-nowrap">{item.invoiceDate}</td>
                                                <td className="px-4 py-3 whitespace-nowrap">{item.totalNominal}</td>
                                                <td className="relative px-4 py-3 whitespace-nowrap">
                                                    <button
                                                        onClick={() => setShowMenu(showMenu === item.id ? null : item.id)}
                                                        className="rounded p-1 hover:bg-gray-200"
                                                    >
                                                        <MoreVertical className="h-4 w-4" />
                                                    </button>
                                                    {showMenu === item.id && (
                                                        <div className="absolute right-4 z-10 mt-1 w-32 rounded border bg-white shadow-md">
                                                            <Link href={`/customer/${item.id}/edit`}>
                                                                <div className="px-4 py-2 hover:bg-gray-100" onClick={() => setShowMenu(null)}>
                                                                    Edit
                                                                </div>
                                                            </Link>
                                                            <button
                                                                onClick={() => {
                                                                    handleDownload(item.id);
                                                                    setShowMenu(null);
                                                                }}
                                                                className="w-full px-4 py-2 text-left hover:bg-gray-100"
                                                            >
                                                                Download
                                                            </button>
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
                                            <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
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

                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                        <div className="w-full max-w-md rounded bg-white p-6 shadow-lg">
                            <h2 className="mb-4 text-xl font-semibold">Tambah Data Invoice</h2>
                            <div className="space-y-3">
                                <div>
                                    <label className="mb-1 block text-sm font-medium">
                                        Customer <RequiredStar />
                                    </label>
                                    <Input
                                        placeholder="Nama customer"
                                        value={formData.customer}
                                        onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                                    />
                                    {errors.customer && <p className="mt-1 text-xs text-red-500">{errors.customer}</p>}
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium">
                                        Invoice Date <RequiredStar />
                                    </label>
                                    <Input
                                        type="date"
                                        value={formData.invoiceDate}
                                        onChange={(e) => setFormData({ ...formData, invoiceDate: e.target.value })}
                                    />
                                    {errors.invoiceDate && <p className="mt-1 text-xs text-red-500">{errors.invoiceDate}</p>}
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium">
                                        Nominal Tagihan <RequiredStar />
                                    </label>
                                    <Input
                                        placeholder="Nominal total"
                                        value={formData.totalNominal}
                                        onChange={(e) => setFormData({ ...formData, totalNominal: e.target.value })}
                                    />
                                    {errors.totalAmount && <p className="mt-1 text-xs text-red-500">{errors.totalAmount}</p>}
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium">
                                        Tipe File <RequiredStar />
                                    </label>
                                    <select
                                        className="w-full rounded border px-3 py-2"
                                        value={formData.tipeFile}
                                        onChange={(e) => setFormData({ ...formData, tipeFile: e.target.value })}
                                    >
                                        <option value="">Pilih tipe file</option>
                                        {['PDF', 'Word', 'Lainnya'].map((type) => (
                                            <option key={type} value={type}>
                                                {type}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.tipeFile && <p className="mt-1 text-xs text-red-500">{errors.tipeFile}</p>}
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium">
                                        File Invoice <RequiredStar />
                                    </label>
                                    <div className="rounded border p-2">
                                        <input
                                            type="file"
                                            accept=".pdf,.doc,.docx,.xls,.xlsx"
                                            className="w-full"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    setFormData({
                                                        ...formData,
                                                        file,
                                                        tipeFile: file.type.includes('pdf') ? 'PDF' : file.type.includes('word') ? 'Word' : 'Lainnya',
                                                        namaFile: file.name,
                                                    });
                                                }
                                            }}
                                        />
                                    </div>
                                    {formData.file && <p className="mt-1 text-sm text-gray-600">File dipilih: {formData.file.name}</p>}
                                    {errors.file && <p className="mt-1 text-xs text-red-500">{errors.file}</p>}
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
                                    Close
                                </Button>
                                <Button onClick={handleAdd}>Simpan</Button>
                            </div>
                        </div>
                    </div>
                )}

                {showViewModal && viewItem && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                        <div className="w-full max-w-2xl rounded bg-white p-6 shadow-lg">
                            <div className="mb-4 flex items-start justify-between">
                                <h2 className="text-xl font-semibold">Details Invoice</h2>
                                <button onClick={() => setShowViewModal(false)} className="text-gray-500 hover:text-gray-700">
                                    ✕
                                </button>
                            </div>
                            <div className="mb-6 grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Customer</p>
                                    <p className="font-medium">{viewItem.customer}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Invoice Date</p>
                                    <p className="font-medium">{viewItem.invoiceDate}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Total Nominal</p>
                                    <p className="font-medium">{viewItem.totalNominal}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Tipe File</p>
                                    <p className="font-medium">{viewItem.tipeFile}</p>
                                </div>
                            </div>
                            <div className="border-t pt-4">
                                <h3 className="mb-2 font-medium">Pratinjau Dokumen</h3>
                                {viewItem.fileContent ? (
                                    <div className="flex h-96 items-center justify-center rounded border bg-gray-50">
                                        {viewItem.tipeFile === 'PDF' ? (
                                            <iframe src={viewItem.fileContent} className="h-full w-full" title="Document preview" />
                                        ) : (
                                            <div className="p-4 text-center">
                                                <p className="mb-2">Pratinjau tidak tersedia untuk file {viewItem.tipeFile}</p>
                                                <Button variant="outline" onClick={() => handleDownload(viewItem.id)}>
                                                    <Download className="mr-2 h-4 w-4" />
                                                    Download File
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex h-32 items-center justify-center rounded border bg-gray-50 text-gray-500">
                                        Tidak ada konten untuk ditampilkan
                                    </div>
                                )}
                            </div>
                            <div className="mt-4 flex justify-end">
                                <Button variant="outline" onClick={() => setShowViewModal(false)}>
                                    Tutup
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

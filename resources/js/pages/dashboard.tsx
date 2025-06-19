import { Card } from '@/components/ui/card';
import { ChartComponent } from '@/components/ui/chart';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

export default function Dashboard() {
    const [year, setYear] = useState('2023');
    const [data, setData] = useState([
        { category: 'Agency', value: 57 },
        { category: 'Development', value: 38 },
        { category: 'Marketing', value: 25 },
        { category: 'Communication', value: 38 },
        { category: 'Web Development', value: 13 },
        { category: 'Web Development', value: 13 },
        { category: 'Marketing', value: 25 },
        { category: 'Travel Agency', value: 11 },
    ]);

    const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setYear(event.target.value);
    };

    return (
        <AppLayout>
            <Head title="Dashboard" />
            <Card>
                <div className="bg-gray-200 p-4">
                    <div className="shadow-box mb-6 rounded-lg bg-white p-4">
                        <div className="font-bold">Dashboard</div>
                        <div>
                            Selamat Datang <span className="font-bold">Perwiraputra</span> di Sistem Surat Menyurat, Anda Login Sebagai{' '}
                            <span className="font-bold">Admin</span>
                        </div>
                    </div>

                    <div className="mb-4 grid grid-cols-4 gap-4">
                        <div className="shadow-box flex items-center rounded-lg bg-white p-4">
                            <i className="fas fa-folder-open mr-2 text-2xl text-blue-600"></i>
                            <div>
                                <div className="font-bold">Surat Masuk</div>
                                <div>2</div>
                            </div>
                        </div>
                        <div className="shadow-box flex items-center rounded-lg bg-white p-4">
                            <i className="fas fa-folder mr-2 text-2xl text-red-600"></i>
                            <div>
                                <div className="font-bold">Surat Keluar</div>
                                <div>10</div>
                            </div>
                        </div>
                        <div className="shadow-box flex items-center rounded-lg bg-white p-4">
                            <i className="fas fa-folder-open mr-2 text-2xl text-blue-600"></i>
                            <div>
                                <div className="font-bold">Data Invoice</div>
                                <div>2</div>
                            </div>
                        </div>
                        <div className="shadow-box flex items-center rounded-lg bg-white p-4">
                            <i className="fas fa-folder-open mr-2 text-2xl text-blue-600"></i>
                            <div>
                                <div className="font-bold">Data Kwitansi</div>
                                <div>2</div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* LEFT COLUMN */}
                        <div className="space-y-4">
                            {/* Pie Chart */}
                            <div className="shadow-box rounded-lg bg-white">
                                <div className="rounded-t-lg bg-blue-500 p-2 text-white">Statistik Data Per Bulan</div>
                                <div className="p-4">
                                    <div className="flex h-64 items-center justify-center">
                                        <ChartComponent
                                            type="doughnut"
                                            data={{
                                                labels: ['Data Masuk', 'Data Keluar'],
                                                datasets: [
                                                    {
                                                        data: [60, 40],
                                                        backgroundColor: ['#06b6d4', '#67e8f9'],
                                                    },
                                                ],
                                            }}
                                            options={{
                                                responsive: true,
                                                maintainAspectRatio: false,
                                            }}
                                            className="h-64 w-full"
                                        />
                                    </div>
                                    <div className="mt-4 flex justify-center space-x-4">
                                        <div className="flex items-center">
                                            <div className="mr-2 h-4 w-4 bg-cyan-400"></div>
                                            <div>Data Masuk</div>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="mr-2 h-4 w-4 bg-cyan-200"></div>
                                            <div>Data Keluar</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Companies Sending Letters */}
                            <div className="shadow-box rounded-lg bg-white">
                                <div className="rounded-t-lg bg-blue-500 p-2 text-center text-white">
                                    <h1 className="text-xl font-bold">Data Perusahaan yang Mengirim Surat ke ProudIT</h1>
                                </div>
                                <div className="p-4">
                                    <div className="flex items-center">
                                        <span className="flex items-center rounded-full bg-green-100 px-2 py-1 text-left text-sm text-green-600">
                                            <i className="fas fa-arrow-up mr-1"></i> 12%
                                        </span>
                                        <select className="ml-4 rounded border-gray-300 px-4 py-1 text-left" value={year} onChange={handleYearChange}>
                                            <option value="2023">2023</option>
                                            <option value="2022">2022</option>
                                            <option value="2021">2021</option>
                                            <option value="2020">2020</option>
                                        </select>
                                    </div>
                                    <h2 className="mt-4 mb-4 text-4xl font-bold">341 Companies</h2>
                                    <h3 className="mb-4 text-gray-500">This Year: {year}</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        {data.map((item, index) => (
                                            <div key={index} className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm">{item.category}</span>
                                                    <span className="text-sm font-medium">{item.value}</span>
                                                </div>
                                                <div className="h-2 rounded-full bg-gray-200">
                                                    <div className="h-2 rounded-full bg-blue-500" style={{ width: `${item.value}%` }}></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN */}
                        <div className="space-y-4">
                            {/* Bar Chart - Statistik Sepanjang Tahun */}
                            <div className="shadow-box rounded-lg bg-white">
                                <div className="rounded-t-lg bg-blue-500 p-2 text-white">Statistik Sepanjang Tahun (12 Bulan Terakhir)</div>
                                <div className="p-4">
                                    <div className="mt-6 mb-4 flex h-64 items-center justify-center">
                                        <ChartComponent
                                            type="bar"
                                            data={{
                                                labels: [
                                                    'Januari',
                                                    'Februari',
                                                    'Maret',
                                                    'April',
                                                    'Mei',
                                                    'Juni',
                                                    'Juli',
                                                    'Agustus',
                                                    'September',
                                                    'Oktober',
                                                    'November',
                                                    'Desember',
                                                ],
                                                datasets: [
                                                    {
                                                        label: 'Data Masuk',
                                                        data: [20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130],
                                                        backgroundColor: '#06b6d4',
                                                    },
                                                    {
                                                        label: 'Data Keluar',
                                                        data: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120],
                                                        backgroundColor: '#67e8f9',
                                                    },
                                                ],
                                            }}
                                            options={{
                                                responsive: true,
                                                maintainAspectRatio: false,
                                                scales: {
                                                    y: {
                                                        beginAtZero: true,
                                                    },
                                                },
                                            }}
                                            className="h-64 w-full"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Data Perusahaan Menerima Surat */}
                            <div className="shadow-box rounded-lg bg-white">
                                <div className="mb-2 rounded-t-lg bg-blue-500 p-2 text-center text-white">
                                    <h1 className="text-xl font-bold">Data Perusahaan yang Menerima Surat dari ProudIT</h1>
                                </div>
                                <div className="p-4">
                                    <div className="mb-4 flex items-center justify-between">
                                        <span className="flex items-center rounded-full bg-green-100 px-2 py-1 text-sm text-green-600">
                                            <i className="fas fa-arrow-up mr-1"></i> 12%
                                        </span>
                                        <select className="rounded border-gray-300 px-3 py-1 text-sm" value={year} onChange={handleYearChange}>
                                            <option value="2023">2023</option>
                                            <option value="2022">2022</option>
                                            <option value="2021">2021</option>
                                            <option value="2020">2020</option>
                                        </select>
                                    </div>
                                    <h2 className="mb-2 text-4xl font-bold">341 Companies</h2>
                                    <h3 className="mb-4 text-gray-500">This Year: {year}</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        {data.map((item, index) => (
                                            <div key={index} className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm">{item.category}</span>
                                                    <span className="text-sm font-medium">{item.value}</span>
                                                </div>
                                                <div className="h-2 rounded-full bg-gray-200">
                                                    <div className="h-2 rounded-full bg-blue-500" style={{ width: `${item.value}%` }}></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </AppLayout>
    );
}

// Updated UI layout to match screenshot style (filter, button alignment, spacing)
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
//import { Textarea } from "@/components/ui/textarea";
//import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Trash2, Download } from "lucide-react";
import { router, Head, useForm, usePage } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";

interface SuratKeluarData {
  ID_Surat_Keluar: number;
  Nomor_surat: number;
  Penerima: string;
  link: string;
  Perihal: string;
  Tanggal_Kirim: string;
  Lampiran: boolean;
  file_path?: string;
}

export default function SuratKeluar() {
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { suratKeluar } = usePage<{ suratKeluar: SuratKeluarData[] }>().props;

  type SuratKeluarForm = {
    Nomor_surat: string;
    Tanggal_Kirim: string;
    Penerima: string;
    Perihal: string;
    Lampiran: boolean;
    file_Lampiran: File | null;
    link: string;
  };

  const { data, setData, post, processing, reset, errors } =
    useForm<SuratKeluarForm>({
      Nomor_surat: "",
      Tanggal_Kirim: "",
      Penerima: "",
      Perihal: "",
      Lampiran: false,
      file_Lampiran: null,
      link: "",
    });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("Nomor_surat", data.Nomor_surat);
    formData.append("Tanggal_Kirim", data.Tanggal_Kirim);
    formData.append("Penerima", data.Penerima);
    formData.append("Perihal", data.Perihal);
    formData.append("Lampiran", data.Lampiran ? "1" : "0");
    if (data.file_Lampiran) {
      formData.append("file_Lampiran", data.file_Lampiran);
    }
    formData.append("link", data.link);

    router.post(route("surat-keluar.store"), formData, {
      forceFormData: true,
      onSuccess: () => reset(),
    });
  };

  const handleDelete = (id: number) => {
    if (confirm("Yakin ingin menghapus?")) {
      router.delete(route("surat-keluar.destroy", id));
    }
  };

  const handleExport = () => {
    window.open(route("surat-keluar.export"), "_blank");
  };

  const handleDownloadSigned = (id: number) => {
    window.open(route("surat-keluar.download", id), "_blank");
  };

  const filtered = suratKeluar.filter((item) =>
    item.Penerima?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout>
      <Head title="Surat Keluar" />
      <Card className="m-4 shadow-md">
        <CardHeader>
          <CardTitle className="text-xl">Input Surat Keluar</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Nomor Surat"
              value={data.Nomor_surat}
              onChange={(e) => setData("Nomor_surat", e.target.value)}
            />
            <Input
              type="date"
              value={data.Tanggal_Kirim}
              onChange={(e) => setData("Tanggal_Kirim", e.target.value)}
            />
            <Input
              placeholder="Penerima"
              value={data.Penerima}
              onChange={(e) => setData("Penerima", e.target.value)}
            />
            <Input
              placeholder="Perihal"
              value={data.Perihal}
              onChange={(e) => setData("Perihal", e.target.value)}
            />
            <div className="mt-2">
                <label>File:</label>
                <input
                  id="file-upload"
                  type="file"
                  onChange={(e) => setData("file_Lampiran", e.target.files?.[0] || null)}
                  className="border p-1 rounded w-full"
                />
            </div>
            <Input
              placeholder="Link Lampiran (opsional)"
              value={data.link}
              onChange={(e) => setData("link", e.target.value)}
            />
            <Button type="submit" disabled={processing}>
              Simpan
            </Button>
          </form>
        </CardContent>
      </Card>
      <Card className="m-4 shadow-md">
        <CardHeader>
          <CardTitle className="text-xl">Surat Keluar</CardTitle>
          <div className="flex items-center gap-2 mt-4">
            <label>Filter by Date:</label>
            <Input type="date" className="w-[160px]" />
            <span>to</span>
            <Input type="date" className="w-[160px]" />
            <div className="ml-auto flex gap-2">
              <Button onClick={() => router.visit(route("surat-keluar.create"))}>
                + Tambah Data
              </Button>
              <Button variant="outline" onClick={handleExport}>
                Export Data
              </Button>
              <Input
                placeholder="Search..."
                className="w-[200px]"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Penerima</TableHead>
                <TableHead>Perihal</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Lampiran</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    Tidak ada data ditemukan.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((item, i) => (
                  <TableRow key={item.ID_Surat_Keluar}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>{item.Penerima}</TableCell>
                    <TableCell>{item.Perihal}</TableCell>
                    <TableCell>
                      {new Date(item.Tanggal_Kirim).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{item.Lampiran ? "Ada" : "Tidak Ada"}</TableCell>
                    <TableCell className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          window.open(
                            route("surat-keluar.view", {
                              id: item.ID_Surat_Keluar,
                            }),
                            "_blank"
                          )
                        }
                      >
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => console.log("edit")}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(item.ID_Surat_Keluar)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleDownloadSigned(item.ID_Surat_Keluar)}
                      >
                        QR
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AppLayout>
  );
}





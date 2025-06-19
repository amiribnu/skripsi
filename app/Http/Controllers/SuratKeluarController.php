<?php

namespace App\Http\Controllers;
use App\Models\SuratKeluar;
use App\Models\SuratKeluarClient;
use Inertia\Response;
use Illuminate\Http\Request;

class SuratKeluarController extends Controller
{
    public function store(Request $request)
{
    $validated = $request->validate([
        'nomor_surat'    => 'required|string|max:255',
        'tanggal_Kirim'  => 'required|date',
        'keluar_client_id'      => 'required|numeric', // ambil client ID
        'perihal'        => 'required|string',
        'file_Lampiran'  => 'nullable|file|mimes:pdf,doc,docx,jpg,jpeg,png|max:2048',
        'nama_file'      => 'nullable|string',
    ]);

    if ($request->hasFile('file_Lampiran')) {
        $file = $request->file('file_Lampiran');
        $path = $file->store('lampiran_surat_keluar', 'public');

        $validated['file_Lampiran'] = $path;
        $validated['nama_file'] = $file->getClientOriginalName();
    }

    // Ambil nama client berdasarkan ID

    $validated['timestamp'] = now();
    $validated['Nomor_surat'] = 'SK-' . now()->format('YmdHis');
    $validated['hash_code'] = md5($validated['Nomor_surat'] . $validated['timestamp']);


    SuratKeluar::create($validated);

    return redirect()->route('surat.keluar')
        ->with('success', 'Surat keluar berhasil dibuat.');
}


}

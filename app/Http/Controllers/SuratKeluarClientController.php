<?php

namespace App\Http\Controllers;
use App\Models\SuratKeluarClient;
use Illuminate\Http\Request;
use Inertia\Response;
use Inertia\Inertia;

class SuratKeluarClientController extends Controller
{
    public function store(Request $request)
{
    $validated = $request->validate([
        'nama_client'     => 'required|string|max:255',
        'no_telp_client'  => 'required|integer',
        'email_client' => 'required|string|email|max:255|unique:surat_keluar_clients,email_client',
        'alamat_client'   => 'required|string',
    ]);

    SuratKeluarClient::create($validated);

    return redirect()->route('client.surat.Keluar')
        ->with('success', 'Surat keluar berhasil dibuat.');
}

public function index(): Response
{
    $data = SuratKeluarClient::all();

    return Inertia::render('ClientSuratKeluar', [
        'myklien' => $data,
    ]);
}

}

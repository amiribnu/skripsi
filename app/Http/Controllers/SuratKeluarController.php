<?php

namespace App\Http\Controllers;
use Barryvdh\DomPDF\Facade\Pdf;
use SimpleSoftwareIO\QrCode\Generator;
use Endroid\QrCode\QrCode;
use Endroid\QrCode\Writer\PngWriter;
use App\Models\SuratKeluar;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use Inertia\Inertia;
use Inertia\Response;
use setasign\Fpdi\Fpdi;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;


class SuratKeluarController extends Controller
{


public function upload(Request $request)
{
    $request->validate([
        'file_Lampiran' => 'required|file|mimes:pdf,doc,docx,jpg,jpeg,png|max:2048',
    ]);

    if ($request->hasFile('file_Lampiran')) {
        $file = $request->file('file_Lampiran');
        $path = $file->store('lampiran', 'public');

        // Simpan path ke DB jika perlu, atau return ke frontend
        return back()->with('file_path', $path);

    }

    return back()->with (['error' => 'No file uploaded'], 400);
}


public function downloadSignedFile($id)
{
    // Misal ambil path file dari database
        $surat = SuratKeluar::findOrFail($id);
        $filePath = $surat->file_Lampiran; // ex: lampiran/7wF8Vou94ZMYjpKFmSXUvXMOaAPE.pdf

        // Path absolut ke file
        $fullPath = storage_path('app/public/' . $filePath);

         if (!Storage::disk('public')->exists($filePath)) {
            return response()->json([
                'message' => 'File fisik tidak ditemukan.'
            ], 404);
        }

        // 1️⃣ Generate QR Code
        $qrCode = QrCode::create($surat->hash_code);
        $writer = new PngWriter();
        $qrResult = $writer->write($qrCode);
        $qrImageData = $qrResult->getString();

        // Simpan QR sementara di storage lokal
        $qrTempPathRelative = 'temp/temp_qr.png';
        $qrTempPathFull = storage_path('app/public/'.$qrTempPathRelative);
        Storage::disk('public')->put($qrTempPathRelative, $qrImageData);

        // 2️⃣ Inject QR ke file PDF asli
        $pdfPathFull = storage_path('app/public/'.$filePath);
        $uniqueFileName = 'signed_'.Str::random(10).'.pdf';
        $outputPathRelative = 'temp/'.$uniqueFileName;
        $outputPathFull = storage_path('app/public/'.$outputPathRelative);

        $pdf = new Fpdi();
        $pageCount = $pdf->setSourceFile($pdfPathFull);
        
        for ($pageNo = 1; $pageNo <= $pageCount; $pageNo++) {
            $tpl = $pdf->importPage($pageNo);
            $size = $pdf->getTemplateSize($tpl);
            $pdf->AddPage($size['orientation'], [$size['width'], $size['height']]);
            $pdf->useTemplate($tpl);

            if ($pageNo == $pageCount) {
                $pdf->Image($qrTempPathFull, $size['width'] - 40, $size['height'] - 40, 30, 30);
            }
        }

        $pdf->Output($outputPathFull, 'F');

        // Hapus QR temp
        Storage::disk('public')->delete($qrTempPathRelative);

        // 3️⃣ Return URL untuk didownload oleh frontend
        $publicUrl = asset('storage/'.$outputPathRelative);


       return redirect($publicUrl);
    
}

public function index(): Response
{
    $data = SuratKeluar::all();

    return Inertia::render('SuratKeluar', [
        'suratKeluar' => $data,
    ]);
}

public function create(): Response
{
    return Inertia::render('SuratKeluar/Create');
}

public function edit($id): Response
{
    $surat = SuratKeluar::findOrFail($id);

    return Inertia::render('SuratKeluar/Edit', [
        'surat' => $surat
    ]);
}

public function store(Request $request)
{
    $validated = $request->validate([
        'Nomor_surat'     => 'required|string|max:255',
        'Tanggal_Kirim'   => 'required|date',
        'Penerima'        => 'required|string|max:255',
        'Perihal'         => 'required|string',
        'Lampiran'        => 'required|boolean',
        'file_Lampiran'   => 'nullable|file|mimes:pdf,doc,docx,jpg,jpeg,png|max:2048|required_if:Lampiran,true',
        'link'            => 'nullable|string',
    ]);

    if ($request->hasFile('file_Lampiran')) {
        $file = $request->file('file_Lampiran');
        $path = $file->store('lampiran_surat_keluar', 'public');

        $validated['file_Lampiran'] = $path;
        $validated['nama_file'] = $file->getClientOriginalName();
    }

    $validated['timestamp'] = now();
    $validated['hash_code'] = md5($validated['Nomor_surat'] . $validated['timestamp']);

    SuratKeluar::create($validated);

    return redirect()->route('surat-keluar.index')
        ->with('success', 'Surat keluar berhasil dibuat.');
}


public function update(Request $request, $id)
{
    $surat = SuratKeluar::findOrFail($id);

    $validated = $request->validate([
        'Nomor_surat' => 'required|string|max:255',
        'Tanggal_Kirim' => 'required|date',
        'Penerima' => 'required|string|max:255',
        'Perihal' => 'required|string',
        'Lampiran' => 'required|boolean',
        'file_Lampiran' => 'nullable|file|mimes:pdf,doc,docx|max:2048',
        'link' => 'nullable|string',
        'timestamp' => 'nullable|date',
        'hash_code' => 'nullable|string|max:255',
        'nama_file' => 'nullable|string|max:255',
    ]);

    $surat->update($validated);

    return redirect()->route('surat-keluar.index')
        ->with('success', 'Surat keluar berhasil diperbarui.');
}

public function destroy($id)
{
    $surat = SuratKeluar::findOrFail($id);
    $surat->delete();

    return redirect()->route('surat-keluar.index')
        ->with('success', 'Surat keluar berhasil dihapus.');
}


/*public function exportExcel()
{
    return Excel::download(new SuratKeluar, 'surat_keluar.xlsx');
}*/

public function viewFile($id)
{
    $surat = SuratKeluar::findOrFail($id);
    $relativePath = $surat->file_Lampiran; // <-- nama kolom kamu di database

    if (!$relativePath) {
        abort(400, 'Filename kosong di database');
    }

    // Hati-hati: jangan tambahkan lampiran/ lagi, karena sudah termasuk di DB
    $path = storage_path('app/public/' . $relativePath);

    if (!file_exists($path)) {
        abort(404, "File $path tidak ditemukan");
    }

    return response()->file($path, [
        'Content-Type' => 'application/pdf',
        'Content-Disposition' => 'inline; filename="' . basename($relativePath) . '"',
    ]);
}



    
}


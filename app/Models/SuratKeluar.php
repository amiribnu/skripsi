<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SuratKeluar extends Model
{
     // Nama tabel secara eksplisit jika tidak mengikuti konvensi Laravel
    protected $table = 'surat_keluars';

    // Kunci primer kustom
    protected $primaryKey = 'id_surat_keluar';

    // Non-incrementing jika ID bukan auto-increment (opsional)
    public $incrementing = true;

    // Tipe data primary key
    protected $keyType = 'int';

    // Laravel tidak menggunakan kolom created_at dan updated_at
    public $timestamps = false;

    // Kolom yang bisa diisi secara massal
    protected $fillable = [
        'nomor_surat',
        'tanggal_Kirim',
        'keluar_client_id',
        'perihal',
        'file_Lampiran',
        'timestamp',
        'hash_code',
        'nama_file',
    ];

    protected $appends = ['file_path'];

public function getFilePathAttribute()
{
    return $this->attributes['Lampiran']
        ? asset('storage/' . $this->attributes['Lampiran'])
        : null;
}

    public function client()
{
    return $this->belongsTo(SuratKeluarClient::class, 'keluar_client_id', 'keluar_client_id');
}
}

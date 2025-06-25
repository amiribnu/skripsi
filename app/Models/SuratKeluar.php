<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SuratKeluar extends Model
{
    // Nama tabel secara eksplisit jika tidak mengikuti konvensi Laravel
    protected $table = 'surat_keluars';

    // Kunci primer kustom
    protected $primaryKey = 'ID_Surat_Keluar';

    // Non-incrementing jika ID bukan auto-increment (opsional)
    public $incrementing = true;

    // Tipe data primary key
    protected $keyType = 'int';

    // Laravel tidak menggunakan kolom created_at dan updated_at
    public $timestamps = false;

    // Kolom yang bisa diisi secara massal
    protected $fillable = [
        'Nomor_surat',
        'Tanggal_Kirim',
        'Penerima',
        'Perihal',
        'file_Lampiran',
        'link',
        'timestamp',
        'hash_code',
        'nama_file',
    ];

    protected $casts = [
        'Lampiran' => 'boolean',
    ];
 
    protected $appends = ['file_path'];

public function getFilePathAttribute()
{
    return $this->attributes['file_Lampiran']
        ? asset('storage/' . $this->attributes['file_Lampiran'])
        : null;
}


}

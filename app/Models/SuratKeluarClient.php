<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SuratKeluarClient extends Model
{
     // Nama tabel secara eksplisit jika tidak mengikuti konvensi Laravel
    protected $table = 'surat_keluar_clients';

    // Kunci primer kustom
    protected $primaryKey = 'keluar_client_id';

    // Non-incrementing jika ID bukan auto-increment (opsional)
    public $incrementing = true;

    // Tipe data primary key
    protected $keyType = 'int';

    // Laravel tidak menggunakan kolom created_at dan updated_at
    public $timestamps = false;

    // Kolom yang bisa diisi secara massal
    protected $fillable = [
        'nama_client',
        'no_telp_client',
        'email_client',
        'alamat_client',
    ];

    public function suratKeluar()
    {
    return $this->hasMany(SuratKeluar::class, 'keluar_client_id', 'keluar_client_id');
    }


}

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('surat_keluars', function (Blueprint $table) {
        $table->id('id_surat_keluar');
        $table->string('nomor_surat');
        $table->date('tanggal_Kirim');

        // Foreign Key
        $table->unsignedBigInteger('keluar_client_id');
        $table->foreign('keluar_client_id')->references('keluar_client_id')->on('surat_keluar_clients')->onDelete('cascade');

        $table->string('penerima');
        $table->text('perihal');
        $table->string('file_Lampiran')->nullable();
        $table->timestamp('timestamp')->useCurrent();
        $table->string('hash_code')->nullable();
        $table->string('nama_file')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('surat_keluars');
    }
};

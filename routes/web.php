<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\SuratKeluarClientController;
use App\Http\Controllers\SuratKeluarController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});


Route::get('/persuratan/surat-masuk/', function () {
    return Inertia::render('SuratMasuk',);
})->name('surat.masuk');
Route::get('/persuratan/client-surat-masuk', function () {
    return Inertia::render('ClientSuratMasuk');
})->name('client.surat.masuk');


Route::get('/persuratan/surat-keluar', function () {
    return Inertia::render('SuratKeluar');
})->name('surat.keluar');
Route::get('/persuratan/client-surat-keluar', function () {
    return Inertia::render('ClientSuratKeluar');
})->name('client.surat.Keluar');



Route::get('/kwitansi', function () {
    return Inertia::render('Kwitansi');
})->name('kwitansi');
Route::get('/client-kwitansi', function () {
    return Inertia::render('ClientKwitansi');
})->name('client.kwitansi');


Route::get('/invoice', function () {
    return Inertia::render('Invoice');
})->name('invoice');
Route::get('/client-invoice', function () {
    return Inertia::render('ClientInvoice');
})->name('client.invoice');


Route::get('/data-master/user', function () {
    return Inertia::render('User');
})->name('User');
Route::get('/data-master/roles', function () {
    return Inertia::render('Roles');
})->name('Roles');
Route::get('/data-master/kategori-surat', function () {
    return Inertia::render('Kategori Surat');
})->name('Kategori Surat');

Route::post('/persuratan/client-surat-keluar', [SuratKeluarClientController::class, 'store'])->name('surat-keluar-client.store');

Route::post('/persuratan/surat-keluar', [SuratKeluarController::class, 'store'])->name('surat-keluar.store');
require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

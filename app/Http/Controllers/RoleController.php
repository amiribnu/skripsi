<?php

namespace App\Http\Controllers;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;


class RoleController extends Controller
{
    public function index()
    {
        $roles = Role::with('user')->get(); // agar bisa akses $role->user->name
        $users = User::select('id', 'name')->get(); // dropdown nama karyawan

        return Inertia::render('Roles', [
            'roles' => $roles,
            'users' => $users,
        ]);
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'jabatan' => 'required|string|max:255',
            'permissions' => 'required|array',
        ]);

        Role::create($validated); // pastikan model Role punya $fillable 'user_id'
        return redirect()->back()->with('success', 'Role berhasil disimpan.');
    }

    public function update(Request $request, $id)
    {
        $role = Role::findOrFail($id);

        $validated = $request->validate([
            'jabatan' => 'required|string|max:255',
            'user_id' => 'required|exists:users,id',
            'permissions' => 'required|array',
        ]);

        $role->update($validated);

        return redirect()->back()->with('success', 'Role berhasil diperbarui.');
    }

   public function destroy($id)
    {
        Role::findOrFail($id)->delete();
        return redirect()->back()->with('success', 'Role berhasil dihapus.');
    }
}    
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckPermission
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    /*public function handle(Request $request, Closure $next): Response
    {
        return $next($request);
    }*/

    public function handle(Request $request, Closure $next, string $module, string $action)
    {
        $user = Auth::user();
        //$user = User::class();

        if (!$user || !$user->hasPermission($module, $action)) {
            abort(403, 'Unauthorized');
        }

        return $next($request);
    }
}

<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthService
{
    /**
     * Register a new user.
     * Assigns 'admin' role if no users exist, otherwise assigns 'user'.
     *
     * @param  array  $data
     * @return User
     */
    public function register(array $data): User
    {
        $role = User::count() === 0 ? 'admin' : 'user';

        return User::create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'password' => $data['password'],
            'role'     => $role,
        ]);
    }

    /**
     * Attempt to log in a user with the given credentials.
     *
     * @param  array  $credentials
     * @return User|null
     */
    public function login(array $credentials): ?User
    {
        if (!Auth::attempt($credentials)) {
            return null;
        }

        return Auth::user();
    }

    /**
     * Log out the currently authenticated user.
     *
     * @return void
     */
    public function logout(): void
    {
        Auth::guard('web')->logout();
    }
}

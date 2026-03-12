<?php

namespace App\Services;

use App\Models\User;

class UserService
{
    /**
     * Get all users.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAll()
    {
        return User::all();
    }

    /**
     * Find a user by ID.
     *
     * @param  int  $id
     * @return User
     */
    public function findById(int $id): User
    {
        return User::findOrFail($id);
    }

    /**
     * Create a new user.
     *
     * @param  array  $data
     * @return User
     */
    public function create(array $data): User
    {
        return User::create($data);
    }

    /**
     * Update an existing user.
     *
     * @param  int    $id
     * @param  array  $data
     * @return User
     */
    public function update(int $id, array $data): User
    {
        $user = User::findOrFail($id);
        $user->update($data);

        return $user->fresh();
    }

    /**
     * Delete a user by ID.
     *
     * @param  int  $id
     * @return void
     */
    public function delete(int $id): void
    {
        User::findOrFail($id)->delete();
    }
}

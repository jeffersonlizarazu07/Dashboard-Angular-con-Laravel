<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\StoreUserRequest;
use App\Http\Requests\User\UpdateUserRequest;
use App\Services\UserService;
use Illuminate\Http\JsonResponse;

class UserController extends Controller
{
    public function __construct(private UserService $userService) {}

    /**
     * Get all users.
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        return response()->json([
            'users' => $this->userService->getAll(),
        ]);
    }

    /**
     * Get a single user by ID.
     *
     * @param  int  $id
     * @return JsonResponse
     */
    public function show(int $id): JsonResponse
    {
        return response()->json([
            'user' => $this->userService->findById($id),
        ]);
    }

    /**
     * Create a new user.
     *
     * @param  StoreUserRequest  $request
     * @return JsonResponse
     */
    public function store(StoreUserRequest $request): JsonResponse
    {
        $user = $this->userService->create($request->validated());

        return response()->json([
            'message' => 'Usuario creado exitosamente.',
            'user'    => $user,
        ], 201);
    }

    /**
     * Update an existing user.
     *
     * @param  UpdateUserRequest  $request
     * @param  int                $id
     * @return JsonResponse
     */
    public function update(UpdateUserRequest $request, int $id): JsonResponse
    {
        $user = $this->userService->update($id, $request->validated());

        return response()->json([
            'message' => 'Usuario actualizado exitosamente.',
            'user'    => $user,
        ]);
    }

    /**
     * Delete a user by ID.
     *
     * @param  int  $id
     * @return JsonResponse
     */
    public function destroy(int $id): JsonResponse
    {
        $this->userService->delete($id);

        return response()->json([
            'message' => 'Usuario eliminado exitosamente.',
        ]);
    }
}

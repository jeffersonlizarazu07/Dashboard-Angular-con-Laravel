<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\Cart\AddToCartRequest;
use App\Services\CartService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function __construct(private CartService $cartService) {}

    /**
     * Get the authenticated user's cart with all items.
     *
     * @param  Request  $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $cart = $this->cartService->getCart($request->user());

        return response()->json([
            'cart' => $cart,
        ]);
    }

    /**
     * Add a product to the authenticated user's cart.
     *
     * @param  AddToCartRequest  $request
     * @return JsonResponse
     */
    public function addItem(AddToCartRequest $request): JsonResponse
    {
        $cart = $this->cartService->addItem(
            $request->user(),
            $request->product_id,
            $request->quantity
        );

        return response()->json([
            'message' => 'Producto agregado al carrito.',
            'cart'    => $cart,
        ]);
    }

    /**
     * Remove a specific item from the authenticated user's cart.
     *
     * @param  Request  $request
     * @param  int      $cartItemId
     * @return JsonResponse
     */
    public function removeItem(Request $request, int $cartItemId): JsonResponse
    {
        $cart = $this->cartService->removeItem($request->user(), $cartItemId);

        return response()->json([
            'message' => 'Producto eliminado del carrito.',
            'cart'    => $cart,
        ]);
    }

    /**
     * Process checkout for the authenticated user's cart.
     *
     * @param  Request  $request
     * @return JsonResponse
     */
    public function checkout(Request $request): JsonResponse
    {
        try {
            $result = $this->cartService->checkout($request->user());

            return response()->json($result);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 422);
        }
    }
}

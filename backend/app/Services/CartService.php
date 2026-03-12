<?php

namespace App\Services;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class CartService
{
    /**
     * Get or create a cart for the given user.
     *
     * @param  User  $user
     * @return Cart
     */
    public function getOrCreateCart(User $user): Cart
    {
        return Cart::firstOrCreate(['user_id' => $user->id]);
    }

    /**
     * Get cart with items and products for the given user.
     *
     * @param  User  $user
     * @return Cart
     */
    public function getCart(User $user): Cart
    {
        return Cart::with('items.product')
            ->firstOrCreate(['user_id' => $user->id]);
    }

    /**
     * Add a product to the user's cart.
     * If the product already exists in cart, increments quantity.
     *
     * @param  User  $user
     * @param  int   $productId
     * @param  int   $quantity
     * @return Cart
     */
    public function addItem(User $user, int $productId, int $quantity): Cart
    {
        $product = Product::findOrFail($productId);
        $cart    = $this->getOrCreateCart($user);

        $item = $cart->items()->where('product_id', $productId)->first();

        if ($item) {
            $item->increment('quantity', $quantity);
        } else {
            $cart->items()->create([
                'product_id' => $product->id,
                'quantity'   => $quantity,
            ]);
        }

        return $this->getCart($user);
    }

    /**
     * Remove a specific item from the user's cart.
     *
     * @param  User  $user
     * @param  int   $cartItemId
     * @return Cart
     */
    public function removeItem(User $user, int $cartItemId): Cart
    {
        $cart = $this->getOrCreateCart($user);
        $cart->items()->where('id', $cartItemId)->delete();

        return $this->getCart($user);
    }

    /**
     * Purchase all items in the cart.
     * Validates stock and decrements inventory inside a transaction.
     *
     * @param  User  $user
     * @return array
     */
    public function checkout(User $user): array
    {
        $cart = $this->getCart($user);

        if ($cart->items->isEmpty()) {
            throw new \Exception('El carrito está vacío.');
        }

        return DB::transaction(function () use ($cart) {
            $total = 0;

            foreach ($cart->items as $item) {
                $product = $item->product;

                if ($product->stock < $item->quantity) {
                    throw new \Exception(
                        "Stock insuficiente para el producto: {$product->name}.
                        Disponible: {$product->stock}, solicitado: {$item->quantity}."
                    );
                }

                $product->decrement('stock', $item->quantity);
                $total += $product->price * $item->quantity;
            }

            $cart->items()->delete();

            return [
                'message' => 'Compra realizada con éxito.',
                'total'   => round($total, 2),
            ];
        });
    }
}

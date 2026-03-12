<?php

namespace App\Services;

use App\Models\Product;

class ProductService
{
    /**
     * Get all products.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAll()
    {
        return Product::all();
    }

    /**
     * Find a product by ID.
     *
     * @param  int  $id
     * @return Product
     */
    public function findById(int $id): Product
    {
        return Product::findOrFail($id);
    }

    /**
     * Create a new product.
     *
     * @param  array  $data
     * @return Product
     */
    public function create(array $data): Product
    {
        return Product::create($data);
    }

    /**
     * Update an existing product.
     *
     * @param  int    $id
     * @param  array  $data
     * @return Product
     */
    public function update(int $id, array $data): Product
    {
        $product = Product::findOrFail($id);
        $product->update($data);

        return $product->fresh();
    }

    /**
     * Delete a product by ID.
     *
     * @param  int  $id
     * @return void
     */
    public function delete(int $id): void
    {
        Product::findOrFail($id)->delete();
    }
}

import { Request, Response } from "express";
import pool from "../db"; // PostgreSQL connection

class CartController {

    // Add a product to the cart & return new cart item with updated cart items
    static async addToCart(req: Request, res: Response): Promise<Response> {
        try {
            const { products, total_price } = req.body; // Expecting an array of products + total cart price
            const userId = (req as any).user.id; // Extract user ID from token
    
            if (!userId || !Array.isArray(products) || products.length === 0 || !total_price) {
                return res.status(400).json({ error: "Invalid request format or missing required fields" });
            }
    
            const client = await pool.connect();
            let cartItems = [];
            let cartId = null; // Store cart ID
    
            for (const { productId, quantity } of products) {
                if (!productId || quantity <= 0) {
                    continue; // Skip invalid products
                }
    
                // Check if the product exists and fetch full product details
                const productQuery = "SELECT * FROM products WHERE id = $1";
                const productResult = await client.query(productQuery, [productId]);
    
                if (productResult.rows.length === 0) {
                    continue; // Skip non-existent products
                }
    
                const product = productResult.rows[0];
                let newCartItem;
    
                // Check if the product already exists in the cart for the user
                const cartQuery = "SELECT id, quantity, total_price FROM cart WHERE user_id = $1 AND product_id = $2";
                const cartResult = await client.query(cartQuery, [userId, productId]);
    
                const productPrice = parseFloat(product.price);
                const itemTotalPrice = productPrice * quantity;
    
                if (cartResult.rows.length > 0) {
                    // If item exists, update quantity & accumulate total price
                    const existingItem = cartResult.rows[0];
                    const updatedQuantity = existingItem.quantity + quantity;
                    const updatedTotalPrice = parseFloat(existingItem.total_price) + itemTotalPrice;
    
                    const updateQuery = `
                        UPDATE cart 
                        SET quantity = $1, total_price = $2, updated_at = NOW()
                        WHERE id = $3
                        RETURNING *;
                    `;
                    const updateResult = await client.query(updateQuery, [updatedQuantity, updatedTotalPrice, existingItem.id]);
                    newCartItem = updateResult.rows[0];
                } else {
                    // If item is new, insert it
                    const insertQuery = `
                        INSERT INTO cart (user_id, product_id, quantity, total_price, created_at, updated_at) 
                        VALUES ($1, $2, $3, $4, NOW(), NOW())
                        RETURNING *;
                    `;
                    const insertResult = await client.query(insertQuery, [userId, productId, quantity, itemTotalPrice]);
                    newCartItem = insertResult.rows[0];
                }
    
                // Capture cart ID (they should all have the same cart ID per user)
                if (!cartId) {
                    cartId = newCartItem.id;
                }
    
                // Combine cart item data with full product details
                cartItems.push({
                    cart_id: newCartItem.id,
                    quantity: newCartItem.quantity,
                    total_price: newCartItem.total_price,
                    product: {
                        id: product.id,
                        name: product.name,
                        description: product.description,
                        price: product.price,
                        created_at: product.created_at,
                        updated_at: product.updated_at,
                    },
                });
            }
    
            // Calculate total cart price from the request
            const totalCartPrice = parseFloat(total_price);
    
            client.release();
    
            return res.status(201).json({
                message: "Products added to cart",
                cartId, // Return the cart ID
                cartItems, // List of all items in the cart with full product details
                totalCartPrice // The total price of all items in the cart (from request body)
            });
    
        } catch (error) {
            console.error("Error adding products to cart:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
    
    
    
    // Delete all cart items for a user
static async deleteCart(req: Request, res: Response): Promise<Response> {
    try {
        const userId = (req as any).user.id; // Extract user ID from token

        const client = await pool.connect();

        // Delete all cart items for the user
        const deleteQuery = `DELETE FROM cart WHERE user_id = $1`;
        await client.query(deleteQuery, [userId]);

        client.release();

        return res.status(200).json({ message: "Cart cleared successfully" });
    } catch (error) {
        console.error("Error deleting cart:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}


    // Get cart items for a user with total price
    static async getCartItems(req: Request, res: Response): Promise<Response> {
        try {
            const userId = (req as any).user.id; // Extract user ID from token

            const client = await pool.connect();

            // Fetch all cart items for the user
            const query = `
            SELECT cart.id, products.name, cart.total_price, cart.quantity
            FROM cart 
            JOIN products ON cart.product_id = products.id 
            WHERE cart.user_id = $1
        `;
            const { rows: cartItems } = await client.query(query, [userId]);

            // Calculate total cart price
            const totalPriceQuery = `
            SELECT COALESCE(SUM(total_price), 0) AS total_cart_price 
            FROM cart 
            WHERE user_id = $1
        `;
            const { rows } = await client.query(totalPriceQuery, [userId]);
            const totalCartPrice = rows[0].total_cart_price;

            client.release();

            return res.status(200).json({
                cartItems,
                totalCartPrice
            });
        } catch (error) {
            console.error("Error fetching cart items:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }


    // Remove a product from the cart
    static async removeFromCart(req: Request, res: Response): Promise<Response> {
        try {
            const { productId } = req.params;
            const userId = (req as any).user.id; // Extract user ID from token

            if (!productId) {
                return res.status(400).json({ error: "Product ID is required" });
            }

            const client = await pool.connect();
            const deleteQuery = "DELETE FROM cart WHERE user_id = $1 AND product_id = $2 RETURNING *";
            const result = await client.query(deleteQuery, [userId, productId]);
            client.release();

            if (result.rowCount === 0) {
                return res.status(404).json({ error: "Cart item not found" });
            }

            return res.status(200).json({ message: "Product removed from cart" });
        } catch (error) {
            console.error("Error removing product from cart:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    // Clear entire cart for a user
    static async clearCart(req: Request, res: Response): Promise<Response> {
        try {
            const userId = (req as any).user.id; // Extract user ID from token

            const client = await pool.connect();
            await client.query("DELETE FROM cart WHERE user_id = $1", [userId]);
            client.release();

            return res.status(200).json({ message: "Cart cleared successfully" });
        } catch (error) {
            console.error("Error clearing cart:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
}

export default CartController;

import { Request, Response } from "express";
import pool from "../db";

export default class ProductController {
  // Add Product
  static async addProduct(req: Request, res: Response): Promise<Response> {
    try {
      const { name, price, description } = req.body;

      if (!name || !price) {
        return res.status(400).json({ error: "Name and price are required" });
      }

      const query = "INSERT INTO products (name, price, description) VALUES ($1, $2, $3) RETURNING *";
      const values: [string, number, string] = [name, price,description];
      const result = await pool.query(query, values);

      return res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error("Error adding product:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // Get All Products
  static async getAllProducts(req: Request, res: Response): Promise<Response> {
    try {
      const query = "SELECT * FROM products ORDER BY id DESC";
      const result = await pool.query(query);

      return res.status(200).json(result.rows);
    } catch (error) {
      console.error("Error fetching products:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  //  Get Product by ID
  static async getProductById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const query = "SELECT * FROM products WHERE id = $1";
      const result = await pool.query(query, [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Product not found" });
      }

      return res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error("Error fetching product:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // Delete Product
  static async deleteProduct(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const query = "DELETE FROM products WHERE id = $1 RETURNING *";
      const result = await pool.query(query, [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Product not found" });
      }

      return res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error("Error deleting product:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}

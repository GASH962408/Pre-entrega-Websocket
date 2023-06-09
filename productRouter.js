import express from 'express';
import ProductManager from '../managers/productManager';
import { promises as fs } from 'fs';

const productManager = new ProductManager('./products.json');
const productRouter = express.Router();

productRouter.get('/', async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
  const products = await productManager.getProducts(limit);
  res.json(products);
});

productRouter.get('/:pid', async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const product = await productManager.getProductById(productId);
    res.json(product);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

productRouter.post('/', async (req, res) => {
  try {
    const newProduct = req.body;
    newProduct.id = productManager.idCounter++;
    productManager.products.push(newProduct);
    await fs.writeFile(productManager.path, JSON.stringify(productManager.products));
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

productRouter.put('/:pid', async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const updatedProduct = req.body;
    const index = productManager.products.findIndex(product => product.id === productId);
    if (index === -1) {
      throw new Error('Product not found');
    }
    productManager.products[index] = updatedProduct;
    await fs.writeFile(productManager.path, JSON.stringify(productManager.products));
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

productRouter.delete('/:pid', async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const index = productManager.products.findIndex(product => product.id === productId);
    if (index === -1) {
      throw new Error('Product not found');
    }
    const deletedProduct = productManager.products.splice(index, 1);
    await fs.writeFile(productManager.path, JSON.stringify(productManager.products));
    res.json(deletedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default productRouter;

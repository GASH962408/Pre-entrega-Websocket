import express from 'express';
import CartManager from '../managers/cartManager';
import ProductManager from '../managers/productManager';
import { promises as fs } from 'fs';


const express = require('express');
const CartManager = require('./cartManager');
const ProductManager = require('./productManager');
const fs = require('fs').promises;

const cartManager = new CartManager('./carts.json');
const productManager = new ProductManager('./products.json');
const cartRouter = express.Router();

cartRouter.post('/', async (req, res) => {
  try {
    const newCart = { id: Date.now(), products: [] };
    cartManager.carts.push(newCart);
    await fs.writeFile(cartManager.path, JSON.stringify(cartManager.carts));
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

cartRouter.get('/:cid', async (req, res) => {
  try {
    const cartId = parseInt(req.params.cid);
    const cart = await cartManager.getCartById(cartId);
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

cartRouter.post('/:cid/product/:pid', async (req, res) => {
  try {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);
    const product = await productManager.getProductById(productId);

    await cartManager.addProductToCart(cartId, productId, 1);
    
    res.status(201).end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

cartRouter.delete('/:cid/product/:pid', async (req, res) => {
  try {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);

    await cartManager.removeProductFromCart(cartId, productId);
    
    res.status(200).end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default cartRouter;

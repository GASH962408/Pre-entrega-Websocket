import { promises as fs } from 'fs';
class CartManager {
    constructor(path) {
      this.path = path;
      this.carts = [];
    }
  
    async loadCarts() {
      try {
        const data = await fs.readFile(this.path, 'utf-8');
        this.carts = JSON.parse(data);
      } catch (error) {
        console.error('Error al cargar los carritos:', error);
      }
    }
  
    async getCarts() {
      await this.loadCarts();
      return this.carts;
    }
  
    async getCartById(id) {
      await this.loadCarts();
  
      const cart = this.carts.find((cart) => cart.id === id);
  
      if (!cart) {
        throw new Error('Carrito no encontrado');
      }
  
      return cart;
    }
  
    async addProductToCart(cartId, productId, quantity) {
      await this.loadCarts();
  
      const cart = this.carts.find((cart) => cart.id === cartId);
  
      if (!cart) {
        throw new Error('Carrito no encontrado');
      }
  
      const product = cart.products.find((product) => product.id === productId);
  
      if (product) {
        product.quantity += quantity;
      } else {
        cart.products.push({ id: productId, quantity });
      }
  
      await this.saveCarts();
    }
  
    async saveCarts() {
      try {
        await fs.writeFile(this.path, JSON.stringify(this.carts));
      } catch (error) {
        console.error('Error al guardar los carritos:', error);
      }
    }
  }

export default CartManager;
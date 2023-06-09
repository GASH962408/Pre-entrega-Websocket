import { promises as fs } from 'fs';

class ProductManager {
    constructor(path) {
      this.idCounter = 1;
      this.path = path;
      this.products = [];
    }
  
    async loadProducts() {
      try {
        const data = await fs.readFile(this.path, 'utf-8');
        this.products = JSON.parse(data);
      } catch (error) {
        console.error('Error al cargar los productos:', error);
      }
    }
  
    async getProducts(limit) {
      await this.loadProducts();
  
      let products = this.products;
  
      if (limit) {
        products = products.slice(0, limit);
      }
  
      return products;
    }
  
    async getProductById(id) {
      await this.loadProducts();
  
      const product = this.products.find((product) => product.id === id);
  
      if (!product) {
        throw new Error('Producto no encontrado');
      }
  
      return product;
    }
  }
export default ProductManager;
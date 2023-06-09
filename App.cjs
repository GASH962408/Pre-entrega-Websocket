const express = require('express');
const handlebars = require('handlebars');
const http = require('http');
const socketIO = require('socket.io');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Configuracion de Handlebars
app.engine('handlebars', (filePath, options, callback) => {
  fs.readFile(filePath, 'utf-8', (error, content) => {
    if (error) {
      return callback(error);
    }

    const template = handlebars.compile(content);
    const rendered = template(options);

    return callback(null, rendered);
  });
});
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Directorio de imagenes
app.use(express.static(path.join(__dirname, 'public')));

class ProductManager {
  constructor() {
    this.idCounter = 1;
    this.products = [];
  }

  getProducts(limit) {
    let products = this.products;

    if (limit) {
      products = products.slice(0, limit);
    }

    return products;
  }

  getProductById(id) {
    const product = this.products.find((product) => product.id === id);

    if (!product) {
      throw new Error('Product no encontrado');
    }

    return product;
  }

  createProduct(data) {
    const newProduct = {
      id: this.idCounter++,
      ...data,
    };

    this.products.push(newProduct);

    return newProduct;
  }

  deleteProduct(id) {
    const index = this.products.findIndex((product) => product.id === id);

    if (index === -1) {
      throw new Error('Producto no encontrado');
    }

    const deletedProduct = this.products.splice(index, 1)[0];

    return deletedProduct;
  }

  initializeExampleProducts() {
    this.createProduct({
      title: 'Producto 1',
      description: 'Descripcion del producto 1',
      price: 10.99,
      image: 'imagen1.jpg',
    });
    
    this.createProduct({
      title: 'Producto 2',
      description: 'Descripcion del producto 2',
      price: 19.99,
      image: 'imagen2.jpg',
    });
    
    this.createProduct({
      title: 'Producto 3',
      description: 'Descripcion del producto 3',
      price: 15.99,
      image: 'imagen3.jpg',
    });
    
    this.createProduct({
      title: 'Producto 4',
      description: 'Descripcion del producto 4',
      price: 7.99,
      image: 'imagen4.jpg',
    });
    
    this.createProduct({
      title: 'Producto 5',
      description: 'Descripcion del producto 5',
      price: 12.99,
      image: 'imagen5.jpg',
    });
    
    this.createProduct({
      title: 'Producto 6',
      description: 'Descripcion del producto 6',
      price: 9.99,
      image: 'imagen6.jpg',
    });
    
    this.createProduct({
      title: 'Producto 7',
      description: 'Descripcion del producto 7',
      price: 14.99,
      image: 'imagen7.jpg',
    });
    
    this.createProduct({
      title: 'Producto 8',
      description: 'Descripcion del producto 8',
      price: 6.99,
      image: 'imagen8.jpg',
    });
    
    this.createProduct({
      title: 'Producto 9',
      description: 'Descripcion del producto 9',
      price: 11.99,
      image: 'imagen9.jpg',
    });
    
    this.createProduct({
      title: 'Producto 10',
      description: 'Descripcion del producto 10',
      price: 8.99,
      image: 'imagen10.jpg',
    });
    

  
  }
}

const productManager = new ProductManager();
productManager.initializeExampleProducts();

// Ruta de inicio
app.get('/', (req, res) => {
  const products = productManager.getProducts();
  res.render('home', { products });
});

// Ruta para la vista de productos en tiempo real
app.get('/realtimeproducts', (req, res) => {
  const products = productManager.getProducts();
  res.render('realTimeProducts', { products });
});

// Configuracion de WebSockets
io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');

  // Escucha el evento de creacion de un nuevo producto
  socket.on('createProduct', (product) => {
    const newProduct = productManager.createProduct(product);
    io.emit('newProduct', newProduct);
  });

  // Escucha el evento de eliminacion de un producto
  socket.on('deleteProduct', (productId) => {
    const deletedProduct = productManager.deleteProduct(productId);
    io.emit('productDeleted', deletedProduct.id);
  });
});

const PORT = 3030;

server.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

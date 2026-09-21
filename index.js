import express from 'express';

const app = express();
const PORT = 3000;
const BASE_URL = 'https://fakestoreapi.com';

// Middlewares
app.use(express.json());
app.use(express.static('public'));

// Array en memoria para simular persistencia
let localProducts = [];

// Cargar datos iniciales de FakeStoreAPI al arrancar el servidor
async function initData() {
    try {
        const response = await fetch(`${BASE_URL}/products`);
        localProducts = await response.json();
        console.log('📦 Productos iniciales cargados desde FakeStoreAPI');
    } catch (error) {
        console.error('Error al obtener datos iniciales:', error.message);
    }
}
initData();

// 1. Ruta GET para obtener todos los productos
app.get('/api/products', (req, res) => {
    res.json(localProducts);
});

// 2. Ruta POST para crear un nuevo producto
app.post('/api/products', (req, res) => {
    const { title, price, category } = req.body;

    if (!title || !price || !category) {
        return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    // Generar nuevo ID autoincremental
    const nextId = localProducts.length > 0
        ? Math.max(...localProducts.map(p => p.id)) + 1
        : 1;

    const newProduct = {
        id: nextId,
        title,
        price: parseFloat(price),
        category,
        description: 'Producto agregado desde localhost',
        image: 'https://i.pravatar.cc'
    };

    localProducts.push(newProduct);
    res.json(newProduct);
});

// 3. Ruta DELETE para eliminar un producto por su ID
app.delete('/api/products/:id', (req, res) => {
    const idParam = parseInt(req.params.id);
    const productIndex = localProducts.findIndex(p => p.id === idParam);

    if (productIndex === -1) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const deletedProduct = localProducts.splice(productIndex, 1)[0];
    res.json({ message: 'Producto eliminado exitosamente', data: deletedProduct });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
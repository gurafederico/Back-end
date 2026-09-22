const BASE_URL = 'https://fakestoreapi.com';

// capturo los argumentos que vienen despues de npm run start
const args = process.argv.slice(2);
const [metodo, recurso, ...resto] = args;

async function programaPrincipal() {
    if (!metodo || !recurso) {
        console.log('❌ Error: Faltan argumentos.');
        return;
    }

    try {
        switch (metodo.toUpperCase()) {
            case 'GET': {
                // get products (consulta por id)
                if (recurso.includes('/')) {
                    const [entidad, id] = recurso.split('/');
                    if (entidad === 'products' && id) {
                        const res = await fetch(`${BASE_URL}/products/${id}`);
                        if (!res.ok) throw new Error(`Producto ${id} no encontrado`);
                        const data = await res.json();

                        console.log('📦 Producto encontrado:');

                        // mapeo para que console.table los muestre bien con mis columnas
                        const productoFormateado = {
                            id: data.id,
                            Nombre: data.title,
                            'Precio $': data.price,
                            Categoria: data.category
                        };

                        console.table([productoFormateado]);
                    } else {
                        console.log('❌ Comando invalido. Uso: products/<productId>');
                    }
                }
                // get products (consulta todos)
                else if (recurso === 'products') {
                    const res = await fetch(`${BASE_URL}/products`);
                    const data = await res.json();
                    console.log('📦 Lista completa de productos:');
                    console.table(data, ['id', 'title', 'price', 'category']);
                }
                break;
            }

            case 'POST': {
                // post products con argumentos <title> <price> <category>
                if (recurso === 'products') {
                    const [title, price, category] = resto;

                    // validacion de los argumentos
                    if (!title || !price || !category) {
                        console.log('❌ Error: Faltan argumentos "nombre" "precio" "categoria"');
                        return;
                    }

                    const res = await fetch(`${BASE_URL}/products`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            title,
                            price: parseFloat(price),
                            category,
                            description: 'Producto agregado desde CLI',
                            image: 'https://i.pravatar.cc'
                        })
                    });

                    const data = await res.json();
                    console.log('✅ Producto creado exitosamente:');
                    console.table([data], ['id', 'title', 'price', 'category']);
                }
                break;
            }

            case 'DELETE': {
                // delete productos
                if (recurso.includes('/')) {
                    const [entidad, id] = recurso.split('/');
                    if (entidad === 'products' && id) {
                        const res = await fetch(`${BASE_URL}/products/${id}`, {
                            method: 'DELETE'
                        });
                        const data = await res.json();
                        console.log(`🗑️ Producto ${id} eliminado:`);
                        console.table([data], ['id', 'title', 'price', 'category']);
                    } else {
                        console.log('❌ Comando invalido.');
                    }
                }
                break;
            }

            default:
                console.log('❌ Metodo no soportado. Usa GET, POST o DELETE.');
        }
    } catch (error) {
        console.error('⚠️ Error al procesar la solicitud:', error.message);
    }
}

programaPrincipal();
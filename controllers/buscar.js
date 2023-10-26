const { response } = require('express');
const { ObjectId } = require('mongoose').Types;

const { Usuario, Categoria, Producto, Role } = require('../models');

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'productosXCategoria',
    'roles'
];

const buscarUsuarios = async( termino = '', res = response ) => {

    const esMongoID = ObjectId.isValid( termino ); // TRUE 

    if ( esMongoID ) {
        const usuario = await Usuario.findById(termino);
        return res.json({
            results: ( usuario ) ? [ usuario ] : []
        });
    }

    const regex = new RegExp( termino, 'i' );
    const usuarios = await Usuario.find({
        $or: [{ nombre: regex }, { correo: regex }],
        $and: [{ estado: true }]
    });

    res.json({
        results: usuarios
    });

}

const buscarCategorias = async( termino = '', res = response ) => {

    const esMongoID = ObjectId.isValid( termino ); // TRUE 

    if ( esMongoID ) {
        const categoria = await Categoria.findById(termino);
        return res.json({
            results: ( categoria ) ? [ categoria ] : []
        });
    }

    const regex = new RegExp( termino, 'i' );
    const categorias = await Categoria.find({ nombre: regex, estado: true });

    res.json({
        results: categorias
    });

}

const buscarProductos = async( termino = '', res = response ) => {

    const esMongoID = ObjectId.isValid( termino ); // TRUE 

    if ( esMongoID ) {
        const producto = await Producto.findById(termino)
                            .populate('categoria','nombre');
        return res.json({
            results: ( producto ) ? [ producto ] : []
        });
    }

    const regex = new RegExp(termino, 'i');
    const productos = await Producto.find({ nombre: regex, estado: true })
                          .populate('categoria', 'nombre');



    res.json({
        results: productos
    });

}

const buscarProductosByCategoriaAndGenero = async (genero = '', termino = '', categoria = '', res = response) => {
    const esCategoriaNombre = isNaN(categoria);

    try {
        if (esCategoriaNombre) {
            // Buscar el ID de la categoría por su nombre
            const categoriaEncontrada = await Categoria.findOne({ nombre: categoria });

            if (!categoriaEncontrada) {
                return res.status(404).json({
                    msg: 'Categoría no encontrada'
                });
            }

            const regex = new RegExp(termino, 'i');
            const productos = await Producto.find({
                categoria: categoriaEncontrada._id,
                nombre: regex,
                genero: genero,
                estado: true
            }).populate('categoria', 'nombre');

            return res.json({
                results: productos
            });
        }

        // Si se proporciona un ID de categoría válido
        const regex = new RegExp(termino, 'i');
        const productos = await Producto.find({
            categoria: categoria,
            nombre: regex,
            estado: true
        }).populate('categoria', 'nombre');

        return res.json({
            results: productos
        });
    } catch (error) {
        res.status(500).json({
            msg: 'Error en el servidor'
        });
    }
};

const buscarProductosAndGenero = async( genero = '', termino = '', res = response ) => {

    const esMongoID = ObjectId.isValid( termino ); // TRUE 

    if ( esMongoID ) {
        const producto = await Producto.findById(termino)
                            .populate('categoria','nombre');
        return res.json({
            results: ( producto ) ? [ producto ] : []
        });
    }

    const regex = new RegExp(termino, 'i');
    const productos = await Producto.find({ nombre: regex, estado: true, genero: genero })
                          .populate('categoria', 'nombre');



    res.json({
        results: productos
    });

}



const buscarProductosByCategoria = async (termino = '', categoria = '', res = response) => {
    const esCategoriaNombre = isNaN(categoria);

    try {
        if (esCategoriaNombre) {
            // Buscar el ID de la categoría por su nombre
            const categoriaEncontrada = await Categoria.findOne({ nombre: categoria });

            if (!categoriaEncontrada) {
                return res.status(404).json({
                    msg: 'Categoría no encontrada'
                });
            }

            const regex = new RegExp(termino, 'i');
            const productos = await Producto.find({
                categoria: categoriaEncontrada._id,
                nombre: regex,
                estado: true
            }).populate('categoria', 'nombre');

            return res.json({
                results: productos
            });
        }

        // Si se proporciona un ID de categoría válido
        const regex = new RegExp(termino, 'i');
        const productos = await Producto.find({
            categoria: categoria,
            nombre: regex,
            estado: true
        }).populate('categoria', 'nombre');

        return res.json({
            results: productos
        });
    } catch (error) {
        res.status(500).json({
            msg: 'Error en el servidor'
        });
    }
};



const buscarRoles = async( termino = '', res = response ) => {

    const esMongoID = ObjectId.isValid( termino ); // TRUE 

    if ( esMongoID ) {
        const rol = await Role.findById(termino);
        return res.json({
            results: ( rol ) ? [rol ] : []
        });
    }

    const regex = new RegExp( termino, 'i' );
    const roles = await Role.find({ rol: regex })

    res.json({
        results: roles
    });

}



const buscar = ( req, res = response ) => {
    
    const { coleccion, termino, categoria  } = req.params;

    if ( !coleccionesPermitidas.includes( coleccion ) ) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${ coleccionesPermitidas }`
        })
    }

    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res);
        break;

        case 'categorias':
            buscarCategorias(termino, res);
        break;

        case 'productos':
            buscarProductos(termino, res);
        break;

        case 'productosXCategoria':
            buscarProductosByCategoria(termino, categoria, res);
        break;

        case 'roles':
            buscarRoles(termino, res);
        break;


        default:
            res.status(500).json({
                msg: 'Se le olvido hacer esta búsquda'
            })
    }

}

const buscarConGenero = ( req, res = response ) => {
    
    const { genero, coleccion, termino, categoria  } = req.params;

    if ( !coleccionesPermitidas.includes( coleccion ) ) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${ coleccionesPermitidas }`
        })
    }

    switch (coleccion) {
        case 'productos':
            buscarProductosAndGenero(genero, termino, res);
        break;

        case 'productosXCategoria':
            buscarProductosByCategoriaAndGenero(genero, termino, categoria, res);
        break;

        default:
            res.status(500).json({
                msg: 'Se le olvido hacer esta búsquda'
            })
    }

}



module.exports = {
    buscar,
    buscarConGenero
}
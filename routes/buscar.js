const { Router } = require('express');
const { buscar, buscarConGenero } = require('../controllers/buscar');

const router = Router();


router.get('/:coleccion/:termino', buscar )

router.get('/:coleccion/:termino/:categoria', buscar )

router.get('/genero/:genero/:coleccion/:termino', buscarConGenero )

router.get('/genero/:genero/:coleccion/:termino/:categoria', buscarConGenero )


module.exports = router;
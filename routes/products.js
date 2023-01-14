const express = require('express')
const router = express.Router()
const pQuery = require('../postgresUtil');

// middleware that is specific to this router
router.use((req, res, next) => {
    console.log('Time: ', Date.now())
    next()
})

// get product information
router.get('/:id', async (req, res) => {
    const product = await pQuery.getProductById(req.params.id);
    res.json(product);
});

// get products by category and/or search paramater
router.get('/', async (req, res) => {
    let category = req.query.category;
    let searchTerm = req.query.search;
    let products = [];

    if(category){
        products = await pQuery.getProductsByCategory(category);
    } else {
        products = await pQuery.getProducts();
    }

    if(searchTerm){
        products = products.filter(product => product.description.includes(searchTerm));
    }

    res.json(products);
})

module.exports = router;
const express = require('express')
const router = express.Router()
const pQuery = require('../postgresUtil');

// get product information
router.get('/:id', async (req, res) => {
    console.log('id: ' + req.params.id)
    res.json(await pQuery.getProductById(req.params.id))
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
        console.log('all retrieved')
    }

    if(searchTerm){
        products = products.filter(product => product.description.includes(searchTerm));
    }

    res.json(products);
})

module.exports = router;
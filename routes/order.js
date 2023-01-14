const express = require('express')
const router = express.Router()
const pQuery = require('../postgresUtil');

// middleware that is specific to this router
router.use((req, res, next) => {
    console.log('Time: ', Date.now())
    next()
})

router.get('/', (req, res) => {
    let userId = req.user.id
    let status = req.body.status
    let orders = pQuery.getOrders(userId, status);
    res.json(orders);
})
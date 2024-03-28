const express = require('express')
const router = express.Router()
const pQuery = require('../postgresUtil');

router.get('/', (req, res) => {
    let userId = req.user.id
    let status = req.query.status
    console.log(' User ID: ' + userId + '. Status: ' + status);
    pQuery.getOrders(userId, status)
        .then(result => {
            console.log('Output to front end')
            console.log(result)
            res.json(result)
        });
})

module.exports = router;
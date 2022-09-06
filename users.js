const express = require('express')
const { Client } = require('pg')
const router = express.Router()
const client = require('./portgresClient');

// middleware that is specific to this router
router.use((req, res, next) => {
  console.log('Time: ', Date.now())
  next()
})

// get user information
router.get('/:id', (req, res) => {
    let id = req.params.id;
    res.send(`Displaying user ${id}`)
});

// create a new user
router.post('/', (req, res) => {
    let array = req.body;
    console.log(array.first);
    res.send('Creating a new user');
    client.query('SELECT * FROM products;', [], (err, res) => {
      if(err){
        console.log(err);
      } else {
        console.log(res.rows);
      }
    });
})

module.exports = router
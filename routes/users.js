const express = require('express')
const router = express.Router()
const client = require('../portgresClient');
const bcrypt = require('bcrypt');

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

router.put('/', (req, res) => {
    let id = req.user.id;
    if(!id){
        console.log('No user logged in');
        res.json({message: 'No user serialised'});
    } else {
        console.log('Insert logic to update user info');
        res.json({message: 'success'});
    }
})

// create a new user
router.post('/register', async (req, res) => {
    try {
        let firstName = req.body.first_name;
        let lastName = req.body.last_name;
        let email = req.body.email;
        const password = await bcrypt.hash(req.body.password, 10);
        let address1 = req.body.address_1;
        let address2 = req.body.address_2;
        let address3 = req.body.address_3;
        let postcode = req.body.postcode;
        let phoneNumber = req.body.phone_number;

        console.log(req.body);
        console.log('Hashed password: ' + password);
        client.query(
            'INSERT INTO users(first_name, last_name, email, password, address_1, address_2, address_3, postcode, phone_number) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);',
            [firstName, lastName, email, password, address1, address2, address3, postcode, phoneNumber],
            (err, response) => {
                if(err){
                    console.log("SQL error:" + err);
                    res.status(400).send("SQL " + err);
                } else {
                    console.log("SQL response:");
                    console.log(response.rows);
                    //res.status(200).send("User created successfully!")
                    res.redirect('http://localhost:3000/login');
                }
            }
        );
    } catch(e) {
        res.send(e);
    }
})

module.exports = router
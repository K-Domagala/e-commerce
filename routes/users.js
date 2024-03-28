const express = require('express')
const router = express.Router()
const client = require('../portgresClient');
const bcrypt = require('bcrypt');
const pQuery  = require('../postgresUtil');

// get user information
router.get('/', async (req, res) => {
    let id = req.user?.id;
    console.log(id);
    if(!id){
        console.log('user not logged in')
        res.json({redirect: true})
    } else {
        let user = await pQuery.getUserById(id)
        console.log(user);
        res.json(user);
    }
});

router.post('/', (req, res) => {
    let id = req.user.id
    if(!id){
        console.log('No user logged in');
        res.json({message: 'No user serialised'});
    } else {
        client.query('UPDATE users SET first_name = $2, last_name = $3, email = $4, address_1 = $5, address_2 = $6, address_3 = $7, postcode = $8, phone_number = $9 WHERE id = $1',
            [id, req.body.firstName, req.body.lastName, req.body.email, req.body.address1, req.body.address2, req.body.address3, req.body.postcode, req.body.phoneNumber])
            .then((result) => res.json({message: 'User info updated'}))
            .catch(e => console.error(e.stack))
    }
})

router.post('/password', async (req, res) => {
    let password = req.body.input
    let id = req.user?.id;
    if(!id){
        res.json({message: 'You are not logged in'})
    } else {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            client.query('UPDATE users SET password = $2 WHERE id = $1', [id, hashedPassword])
                .then((result) => {
                    res.json({message: 'Password updated'})
                })
        } catch(e) {
            res.send(e);
        }
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
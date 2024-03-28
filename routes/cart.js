const express = require('express')
const router = express.Router()
const pQuery = require('../postgresUtil');
const stripe = require('stripe')('sk_test_51MWN7GGSKy61RQS6ekM61QVRYPNGsIqUy9G1KEEyewxUFEOY5QImql1l1QsHtHngdn40Qj9KwEiTkxwAs4CfVYsR00zc7v6oXz');

// add items to cart, input (user_id, product_id, qty)
router.post('/', (req, res) => {
    if(req.user){
        console.log(req.body);
        pQuery.updateCart(req.user.id, req.body.productId, req.body.qty)
        res.json({message: 'Cart updated'})
    } else {
        res.json({message: 'User not logged in'})
    }
})

router.get('/paymentIntent', async (req, res) => {
    const paymentIntent = await stripe.paymentIntents.create({
        amount: 1099,
        currency: 'gbp',
    });
    res.json({paymentIntent});
})

// get cart information
router.get('/cart', (req, res) => {
    if(req.user){
        let userId = req.user.id
        pQuery.getOrders(userId, 'cart')
            .then(result => {
                console.log('Output to front end')
                console.log(result)
                res.json(result)
            });
    } else {
        res.json({message: 'User not logged in'})
    }
    
})

// checkout using stripe
router.post('/checkout', async (req, res) => {
    const token = req.body.stripeToken;
    const charge = await stripe.charges.create({
        amount: 999,
        currency: 'usd',
        description: 'Example charge',
        source: token,
      });
    let userId = req.user?.id;
    console.log('Checking out');
})

module.exports = router;
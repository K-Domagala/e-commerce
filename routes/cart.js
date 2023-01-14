const express = require('express')
const router = express.Router()
const pQuery = require('../postgresUtil');

// middleware that is specific to this router
router.use((req, res, next) => {
    console.log('Time: ', Date.now())
    next()
})

// add items to cart, input (user_id, product_id, qty)
router.post('/', (req, res) => {
    pQuery.updateCart(req.user.id, req.body.productId, req.body.qty)
    console.log('Cart updated');
})

// get cart information
router.get('/', (req, res) => {
    let userId = req.user.id
    let cart = pQuery.getOrders(userId, 'cart')[0];
    res.json(cart)
})

// checkout
router.post('/checkout', (req, res) => {
    let userId = req.user.id;
    let balance = req.body.balance;
    let cart = pQuery.getOrders(userId, 'cart')[0];
    if(!cart){
        res.post('Your cart is empty')
    } else {
        let total = 0;
        cart.products.forEach(product => {
            total += product.price * product.quantity;
        });
        console.log('Cart total is: ' + total);
        if(total <= balance){
            balance -= total;
            console.log('Checkout successful, new balance is ' + balance);
            let message = pQuery.changeOrderStatus(cart.orderId, 'placed');
            res.json({message});
        } else {
            console.log('Checkout failed: insufficient funds')
            res.json({message: 'Balance too low'})
        }
    }
})
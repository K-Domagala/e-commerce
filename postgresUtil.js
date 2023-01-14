const client = require('./portgresClient');

// user queries
const getIdByEmail = async (email) => {
    let user = {};
    await client
        .query('SELECT * FROM users WHERE email=$1', [email])
        .then((result) => user = result.rows[0])
        .catch((e) => console.error(e.stack))
    return user;
}

const getUserById = async (id) => {
    let user = {}
    await client
        .query('SELECT * FROM users WHERE id=$1', [id])
        .then((result) => user = result.rows[0])
        .catch((e) => console.error(e.stack))
    return user;
}

// product queries
const getProductById = async (id) => {
    let product = {}
    await client
        .query('SELECT * FROM products WHERE id=$1', [id])
        .then((result) => product = result.rows[0])
        .catch((e) => console.error(e.stack))
    return product;
}

const getProductsByCategory = async (category) => {
    let products = []
    await client
        .query('SELECT * FROM products WHERE category=$1', [category])
        .then(result => products = result.rows)
        .catch((e) => console.error(e.stack))
    return products;
}

const getProducts = async () => {
    let products = []
    await client
        .query('SELECT * FROM products')
        .then(result => products = result.rows)
        .catch((e) => console.error(e.stack))
    return products;
}

// order queries
const updateCart = async (userId, productId, qty) => {
    // get cart data from orders table
    let order = {}
    await client
        .query('SELECT * FROM orders WHERE status = cart AND user_id = $1', [userId])
        .then(result => order = result.rows[0])
        .catch(e => console.error(e.stack))
    // if no cart (active order), then create one
    if(!order.id){
        await client
            .query('INSERT INTO orders(user_id, status) VALUES ($1, "cart") RETURNING *', [userId])
            .then(result => order = result.rows[0])
            .catch(e => console.error(e.stack))
    }

    // check if product is already in the cart
    let productOrder = {}
    await client
        .query('SELECT * FROM product_order WHERE order_id = $1 AND product_id = $2', [order.id, productId])
        .then(result => productOrder = result.rows[0])
        .catch(e => console.error(e.stack))
    // if the product is not in the cart, add it to cart. Else, update the quantity
    if(!productOrder.id){
        await client
            .query('INSERT INTO product_order(order_id, product_id, quantity) VALUES ($1, $2, $3)', [order.id, productId, qty])
            .then((result) => console.log('Product added to cart'))
            .catch(e => console.error(e.stack))
    } else {
        await client
            .query('UPDATE product_order SET quantity = quantity + $1 WHERE order_id = $2 AND product_id = $3', [qty, order.id, productId])
            .then((result) => console.log('Product quantity modified in cart'))
            .catch(e => console.error(e.stack))
    }
}

const getOrders = async (userId, status) => {
    let order = []
    // select orders that match the user id and status
    await client
        .query('SELECT order_id FROM orders WHERE status = $1 AND user_id = $2', [status, userId])
        .then(result => {
            // for each order, lookup product id's and qty's
            result.rows.forEach(async order => {
                let products = []
                await client
                    .query('SELECT * FROM product_order WHERE order_id = $1')
                    .then(result => {
                        // for each product, lookup product name and price
                        result.rows.forEach(async product => {
                            let productName, productPrice;
                            await client
                                .query('SELECT * FROM products WHERE id = $1', [product.product_id])
                                .then(results => {
                                    productName = results.rows[0].name;
                                    productPrice = results.rows[0].price;
                                })
                                .catch(e => console.error(e.stack))
                            // store all data in an object
                            let productInfo = {id: product.product_id, name: productName, price: productPrice, qty: product.qty}
                            // add it to the products array
                            products.push(productInfo);
                        })
                    })
                    .catch(e => console.error(e.stack))
                // add products array to the order
                order.push({orderId: order.id, products: products})
            })
        })
        .catch(e => console.error(e.stack))
    return order //  structure: [ { orderid, products [ { id, name, price, qty } ] } ]
}

const changeOrderStatus = async (orderId, status) => {
    let message = 'failed';
    await client
        .query('UPDATE orders SET status = $1 WHERE id = $2', [status, orderId])
        .then(result => {message = 'Successful'})
        .catch(e => console.error(e.stack))
    
    return message
}

module.exports = {getIdByEmail, getUserById, getProductById, getProductsByCategory, getProducts, updateCart, getOrders, changeOrderStatus}
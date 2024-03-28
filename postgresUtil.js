const client = require('./portgresClient');

// user queries
const getIdByEmail = async (email) => {
    return (await client.query('SELECT * FROM users WHERE email=$1', [email])).rows[0]
}

const getUserById = async (id) => {
    return (await client.query('SELECT * FROM users WHERE id=$1', [id])).rows[0]
}

// product queries
const getProductById = async (id) => {
    return (await client.query('SELECT * FROM products WHERE id=$1', [id])).rows[0]
}

const getProductsByCategory = async (category) => {
    return (await client.query('SELECT * FROM products WHERE category=$1', [category])).rows;
}

const getProducts = async () => {
    return (await client.query('SELECT * FROM products')).rows
}

// order queries
const updateCart = async (userId, productId, qty) => {
    // get cart data from orders table
    let order = (await client.query("SELECT * FROM orders WHERE status = 'cart' AND user_id = $1", [userId])).rows[0]
    
    // if no cart, then create one
    if(!order){
        order = (await client.query("INSERT INTO orders(user_id, status) VALUES ($1, 'cart') RETURNING *", [userId])).rows[0]
    }

    // check if product is already in the cart
    let productOrder = (await client.query('SELECT * FROM product_order WHERE order_id = $1 AND product_id = $2', [order.id, productId])).rows[0]
    // if not, add it to the cart
    if(!productOrder){
        await client.query('INSERT INTO product_order(order_id, product_id, quantity) VALUES ($1, $2, $3)', [order.id, productId, qty])
        console.log('Product added to cart')
    } else {
    // if product is in the cart, check wether the user wants to delete it, or change quantity
        if(qty <= 0){
            await client.query('DELETE FROM product_order WHERE order_id = $1 AND product_id = $2', [order.id, productId])
            console.log('Product deleted from cart')
        } else {
            await client.query('UPDATE product_order SET quantity = $1 WHERE order_id = $2 AND product_id = $3', [qty, order.id, productId])
            console.log('Product quantity modified in cart')
        }
    }
}

const getOrders = async (userId, status) => {
    // select orders that match the user id and status
    let allOrders = (await client.query(`
        SELECT orders.id,
            product_order.product_id,
            products.name,
            products.description,
            products.image,
            product_order.quantity,
            products.price
        FROM orders
          JOIN product_order on orders.id = product_order.order_id
          JOIN products ON product_order.product_id = products.id
        WHERE status = $1 
          AND user_id = $2
        ORDER BY orders.id DESC,
            product_order.product_id`, [status, userId])).rows

    console.log('All orders:')
    console.log(allOrders)

    return allOrders;
}

const changeOrderStatus = async (orderId, status) => {
    let message = 'failed';
    await client.query('UPDATE orders SET status = $1 WHERE id = $2', [status, orderId])
        .then(result => {message = 'Successful'})
        .catch(e => console.error(e.stack))
    
    return message
}

module.exports = {getIdByEmail, getUserById, getProductById, getProductsByCategory, getProducts, updateCart, getOrders, changeOrderStatus}
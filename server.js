const express = require('express');
const app = express();
const fs = require('fs');
const { Client } = require('pg')
const client = new Client({
  host: 'localhost',
  user: 'postgres',
  port: 5432,
  password: 'postgres',
  database: 'e-commerce'
});

app.set('port', process.env.PORT || 3000);

app.get('/',(request,response)=>{
 response.send('Welcome to our simple online order managing web app!');
});

//Example client query
/*
const text = 'DELETE FROM products WHERE id=$1;';
const values = [2];
// callback
client.query(text, values, (err, res) => {
  if (err) {
    console.log(err.stack);
  } else {
    console.log(res.rows[0]);
    // { name: 'brianc', email: 'brian.m.carlson@gmail.com' }
  }
});
*/

//Add CURL here



// client.query('SELECT * FROM products;', [], (err, res) => {
//   if(err){
//     console.log(err);
//   } else {
//     console.log(res.rows);
//   }
// });

app.listen(3000,()=>{
 console.log('Express server started at port 3000');
});
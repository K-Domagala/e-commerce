const express = require('express');
const app = express();
const fs = require('fs');
	  
app.set('port', process.env.PORT || 3000);

app.get('/',(request,response)=>{
 response.send('Welcome to our simple online order managing web app!');
});

//Add CURL here


app.listen(3000,()=>{
 console.log('Express server started at port 3000');
});
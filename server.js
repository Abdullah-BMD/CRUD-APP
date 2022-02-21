const express = require('express');
const expressGraphQL = require('express-graphql').graphqlHTTP;
const schema = require('./schema.js');
const mongoose = require('mongoose');
const cors = require('cors');

// Data base credentials
const {
    usrname , 
    password , 
    cluster_name , 
    database_name
} = require('./enviroment.js');


// Command :- npm run dev:server;
const app = express();
// Defining settings
app.use('*', cors());

//Mongodb connection
const url = `mongodb+srv://${usrname}:${password}@${cluster_name}.fquus.mongodb.net/${database_name}?retryWrites=true&w=majority`

const connect = mongoose.connect(url, { useNewUrlParser: true });
connect.then((db) => {
      console.log('Database Connected!');
}, (err) => {
      console.log(err);
});



// Grapgql-Endpoint
app.use('/graphql', expressGraphQL({
    schema:schema,
    graphiql:true
}));


app.listen(4000, () => {
    console.log('Server is running at url : http://localhost:4000/ ' );
});
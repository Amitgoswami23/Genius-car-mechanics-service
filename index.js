const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors')
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId 



const app = express()
const port = 5000

//midleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1g7zj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){

    try{

        await client.connect();
       const database = client.db('carMachanics')
       const servicesCollection = database.collection('services');

       //get all service
       app.get('/services', async(req, res)=>{
           const cursor = servicesCollection.find({});
           const services = await cursor.toArray();
           res.send(services)
       })

       //get single service
       app.get('/services/:id', async(req, res)=>{
            const id = req.params.id
            const query = {_id: ObjectId(id)}
            const service = await servicesCollection.findOne(query)
            res.json(service)
       })

       //POST API
       app.post('/services', async(req, res) => {

            const service = req.body;
            console.log('Hit the post api', service)

            const result = await servicesCollection.insertOne(service);
            console.log(result);

            res.json(result)

       })

       //delete API
       app.delete('/services/:id', async(req, res) => {
           const id = req.params.id
           const query = {_id: ObjectId(id)};
           const result = await servicesCollection.deleteOne(query);
           res.json(result);
       })

    }finally{
        // await client.close();
    }

}

run().catch(console.dir);

app.get('/', (req, res)=>{
    res.send('Runnig the server ')
})

app.listen(port, ()=>{
    console.log('Running genius server on port', port);
})

//DATABASE username and password
//username: AmitGoswamiDB
//password: abWLmt9f84TixssA
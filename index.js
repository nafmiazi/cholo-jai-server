const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hhd82.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("choloJai");
        const destinationCollection = database.collection("destinations");
        const orderCollection = database.collection("orders");
      
        // GET API
        app.get('/destinations', async(req, res) => {
            const cursor = destinationCollection.find({});
            const destinations = await cursor.toArray();
            res.send(destinations);
        });
    
        app.get('/destinations/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const destination = await destinationCollection.findOne(query);
            res.json(destination);
        });

        app.get('/orders', async(req, res) => {
            const cursor = orderCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders);
        });

        // POST API
        app.post('/destinations', async(req, res) => {
            const destination = req.body;
            const result = await destinationCollection.insertOne(destination);
            res.json(result);
        })

        app.post('/orders', async(req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.json(result);
        })

        // UPDATE API
        app.put('/orders/:id', async(req, res) => {
            const id = req.params.id;
            const updatedStatus = req.body;
            const filter = {_id: ObjectId(id)};
            const options = {upsert: true};
            const updateDoc = {
                $set: {
                    status: "Approved"
                },
            };
            const result = await orderCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        })

        // DELETE API
        app.delete('/orders/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await orderCollection.deleteOne(query);
            res.json(result);
        });

    } finally {
        //   await client.close();
    }
  }
  run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running Cholo Jai Server');
})

app.listen(port, () => {
    console.log(`Running Cholo Jai Server on Port:${port}`)
})
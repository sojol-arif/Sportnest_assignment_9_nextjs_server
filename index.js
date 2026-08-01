const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
dotenv.config();

const uri = process.env.MONGODB_URI;

const app = express();

app.use(cors());
app.use(express.json());

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const db = client.db('sportnest');

    const facilityCollection = db.collection('facilities');
    const bookingCollection = db.collection('bookings');

    app.get('/facility', async (req, res) => {
      const result = await facilityCollection.find().toArray();
      res.send(result);
    });

    app.post('/facility', async (req, res) => {
      const facility = req.body;
      const result = await facilityCollection.insertOne(facility);
      res.send(result);
    });

    app.get('/facility/:id', async (req, res) => {
      const { id } = req.params;
      const result = await facilityCollection.findOne({ _id: new ObjectId(id) });
      res.json(result);
    });

    app.post('/booking', async (req, res) => {
      const booking = req.body;
      const result = await bookingCollection.insertOne(booking);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
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

    app.get('/facilities/:email', async (req, res) => {
      const { email } = req.params;
      const result = await facilityCollection.find({ email: email }).toArray();

      res.send(result);
    });

    app.delete('/facilities/:facilityId', async (req, res) => {
      const { facilityId } = req.params;
      const result = await facilityCollection.deleteOne({ _id: new ObjectId(facilityId) });

      res.send(result);
    });

    // app.put('/facilities/:facilityId', async (req, res) => {
    //   const { facilityId } = req.params;
    //   const updatedFacility = req.body;
    //   const result = await facilityCollection.updateOne({ _id: new ObjectId(facilityId) }, { $set: updatedFacility });

    //   res.send(result);
    // });

    app.patch('/facilities/:facilityId', async (req, res) => {
      try {
        const { facilityId } = req.params;
        const updatedFacility = req.body;

        const result = await facilityCollection.updateOne(
          { _id: new ObjectId(facilityId) },
          { $set: updatedFacility }
        );

        res.json(result);
      } catch (err) {
        console.error(err);
        res.status(400).send({ message: 'Invalid facility ID or update failed' });
      }
    });

    app.post('/booking', async (req, res) => {
      const booking = req.body;
      const result = await bookingCollection.insertOne(booking);
      res.send(result);
    });

    app.get('/booking/:userId', async (req, res) => {
      const { userId } = req.params;
      const result = await bookingCollection.find({ userId: userId }).toArray();

      res.send(result);
    });

    app.delete('/booking/:bookingId', async (req, res) => {
      const { bookingId } = req.params;
      const result = await bookingCollection.deleteOne({ _id: new ObjectId(bookingId) });
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
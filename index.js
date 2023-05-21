const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 4300;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.aoalbnp.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },

});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const toysCollaction = client.db("toysDB").collection("toysStore");

    app.get("/toys", async (req, res) => {
      let query = {};
      if (req.query?.sub_category) {
        query = { sub_category: req.query.sub_category };
      }
      const result = await toysCollaction.find(query).toArray();
      res.send(result);
    });

    app.get('/searchToys', async(req, res)=>{
      // console.log(req.query.search)
      const search = req.query.search
      const query = { name : { $regex : search}}
      const result = await toysCollaction.find(query).toArray();
      res.send(result);
    })

    app.get("/toys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await toysCollaction.findOne(query);
      res.send(result);
    });

    app.put("/toys/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateToys = req.body;
      console.log(updateToys);
      const toys = {
        $set: {
          name: updateToys.name,
          seller: updateToys.seller,
          email: updateToys.email,
          available_quantity: updateToys.available_quantity,
          picture: updateToys.picture,
          sub_category: updateToys.sub_category,
          price: updateToys.price,
          rating: updateToys.rating,
          details: updateToys.details,
        },
      };

      const result = await toysCollaction.updateOne(filter, toys, options);
      res.send(result);
    });

    app.delete('/toys/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await toysCollaction.deleteOne(query);
      res.send(result);
  })

    // add toys

    app.get("/addToy", async (req, res) => {
      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email };
      }
      const result = await toysCollaction.find(query).toArray();
      res.send(result);
    });

    app.post("/addToy", async (req, res) => {
      const toy = req.body;
      console.log(toy);
      const result = await toysCollaction.insertOne(toy);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("toys server is running");
});

app.listen(port, () => {
  console.log(`toys port is running : ${port}`);
});

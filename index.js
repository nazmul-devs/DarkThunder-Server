const express = require("express");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// mongoDb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.f4mgp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

async function run() {
	try {
		await client.connect();
		const database = client.db("dark-thunder");
		const ridesCollection = database.collection("rides");
		const orderRides = database.collection("orders");

		// GET DATA
		app.get("/rides", async (req, res) => {
			const result = await ridesCollection.find({}).toArray();
			res.send(result);
		});

		// POST RIDE
		app.post("/rides", async (req, res) => {
			const ride = req.body;
			const result = await ridesCollection.insertOne(ride);
			console.log(result);
		});

		// POST order
		app.post("/orders", async (req, res) => {
			const orderInfo = req.body;
			const result = await orderRides.insertOne(orderInfo);
			res.json(result);
			console.log("ordered added", result);
		});
		// order info get
		app.get("/orders", async (req, res) => {
			const result = await orderRides.find({}).toArray();
			res.send(result);
			console.log("Get order info");
		});

		// get order info by email
		app.get("/orders/:email", async (req, res) => {
			const email = req.params.email;
			const result = await orderRides.find({ email: email }).toArray();
			res.send(result);
		});
		// DELETE from myOrders
		app.delete("/myorders/:id", async (req, res) => {
			const id = req.params.id;
			const query = { _id: ObjectId(id) };
			const result = await orderRides.deleteOne(query);

			res.json(result);
		});

		// GET all order ride
		app.get("/orders", async (req, res) => {
			const result = await orderRides.find({}).toArray();
			res.send(result);
		});
	} finally {
		// await client.close();
	}
}
run().catch(console.dir);

// Get
app.get("/", (req, res) => {
	res.send("dark thunder server is running");
});

// Listening port
app.listen(port, () => {
	console.log("Running Dark Thunder Server on port", port);
});

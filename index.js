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
		const ridesCollection = database.collection("ride");

		// POST RIDE
		app.post("/rides", async (req, res) => {
			const ride = req.body;
			console.log(ride);
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
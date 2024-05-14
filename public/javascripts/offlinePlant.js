
const mongoose = require('mongoose');


const uri = 'mongodb://localhost:27017/plantSightings';
let connection;

mongoose.Promise = global.Promise;

mongoose.connect(uri).then(result => {
    connection = result.connection;
    console.log("connection successful");
}).catch(err => {
    console.log(err)
})


const client = new MongoClient(uri);
async function run(sighting) {
    try{
        const database = client.db("plantSightings");
        const collection = database.collection("plantsightings");
        const result = await collection.insertOne(sighting);

        console.log(`Document inserted with id: ${result.insertedId}`);
    } finally {
        await client.close();
    }
}
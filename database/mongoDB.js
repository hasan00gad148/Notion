
const dotenv = require('dotenv');
dotenv.config();

const mongodb = require('mongodb');

db=null;

async function connectdb(){
    const client = await new mongodb.MongoClient(process.env.mongodbURL);
    db = await client.db(process.env.dbname);
}

function getdb(){

    if (!db) throw new Error("getdb func, Couldn't connect to database")
    return db

}




module.exports={connectdb:connectdb, getdb:getdb, objectId:mongodb.ObjectId}
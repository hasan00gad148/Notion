
const dotenv = require('dotenv');
dotenv.config();

const mongodb = require('mongodb');


async function getdb(){
    try {
        const client = await new mongodb.MongoClient(process.env.mongodbURL);
        const db = await client.db(process.env.dbname);
        if (!db) throw new Error("Couldn't connect to database")
        
        return db
    } catch (error) {
        console.error("error getting db", error)
        return false;
    }


}




module.exports={getdb:getdb, objectId:mongodb.ObjectId,}
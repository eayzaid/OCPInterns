const mongoClient = require("mongoose");

async function establishConnection (){
    try{
        const dbUri = process.env.MONGODB_URI;
        if( !dbUri ) throw new Error("no MongoDB Connection String have been provided");

        await mongoClient.connect(dbUri);
    }
    catch(err){
        throw err;
    }
}

async function closeConnection (){
    try{
        await mongoClient.connection.close();
    }
    catch(err){
        throw err; 
    }
}
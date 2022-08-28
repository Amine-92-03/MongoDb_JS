const {MongoClient} = require('mongodb')
require('dotenv').config();

let dbConnection
let urlAtlas = `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@cluster0.fdvrxuk.mongodb.net/?retryWrites=true&w=majority`
let urlLocal = 'mongodb://localhost:27017/bookStore'
module.exports = {
    connectToDb : (cb) => {
        // MongoClient.connect('mongodb://localhost:27017/bookStore') // local mongoDb
        MongoClient.connect(urlAtlas) // atlas mongoDb
        .then((client)=>{
            dbConnection = client.db()
            return cb()
        })
        .catch(err =>{
            console.log(err);
            return cb(err)
        })
    },
    getDB : () => dbConnection
  }
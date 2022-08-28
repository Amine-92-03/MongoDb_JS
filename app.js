const express = require('express')
const {ObjectId} = require('mongodb')
const {connectToDb, getDB} = require('./db')

const app = express()

// formatter les données en format json
app.use(express.json())  

// db connection
let db
connectToDb((err)=>{
    if(!err){
        console.log('connect to db sucess');
        db = getDB()
    }else{
        console.log('cannot connect to DB');
    }
})

// routes
app.get('/books',(req,res)=>{
    // current page
    const page = req.query.p || 0
    const booksPerPage = 3

    let books = []

    db.collection('books')   //cursor toArray forEach   
        .find()
        .sort({ author : 1})
        .skip(page * booksPerPage)
        .limit(booksPerPage)
        .forEach(book => books.push(book))
        .then(()=>{
            res.status(201).json(books)
        })
        .catch(()=>{
            res.status(500).json({error : 'could Not fetch the documents'})
        })             
})

app.get('/books/:id',(req, res)=>{
    if(ObjectId.isValid(req.params.id)){
        db.collection('books')
        .findOne({_id : ObjectId(req.params.id)})
        .then( doc =>{
            res.status(201).json(doc)
        })
        .catch(err => {
            res.status(500).json({error : 'No fetch of documents'})
        })
    }else {
             res.status(500).json({error : 'Not valid document ID'})
    }
})

app.post('/books',(req, res) => {
    const book = req.body
    db.collection('books')
    .insertOne(book)
    .then(result => {
        res.status(201).json(result)
    })
    .catch(err => {
        res.status(500).json({error : 'could not create a new documents'})
    })
})

app.delete('/books/:id',(req, res) =>{
    if(ObjectId.isValid(req.params.id)){
        db.collection('books')
        .deleteOne({_id : ObjectId(req.params.id)})
        .then(result => {
            res.status(201).json(result)
        }).catch(err => {
            res.status(500).json({error : 'could not delete document !'})
        })
    }else {
        res.status(500).json({error : 'id not valid'})
    }
})

app.patch('/books/:id', (req, res) => {
    let updates = req.body
    if(ObjectId.isValid(req.params.id)){
        db.collection('books')
        .updateOne({_id : ObjectId(req.params.id)}, {$set : updates})
        .then(result => {
            res.status(201).json(result)
        })
    }else {
        res.status(500).json({error : 'id not valid'})
    }
})

module.exports = app

// const bodyParser = require("body-parser")
// app.use(bodyParser.json())
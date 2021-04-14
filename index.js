const express = require('express')
const app = express()
const port = 5000
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;

const uri = "mongodb+srv://ababilit:bYpBAUmDZ4sGf8Y@cluster0.dmtd1.mongodb.net/ababilIt?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


app.use(bodyParser.json());
app.use(cors());



client.connect(err => {
  const studentsCollection = client.db("ababilIt").collection("students");
  const adminCollection = client.db("ababilIt").collection("admin");



  app.get('/', (req, res) => {
    res.send('Database Conncected')
  })
  

  app.get('/students', (req, res) => {
    studentsCollection.find({confirmAddmission: true})
    .toArray((err, documents) =>{
      res.send(documents);
    })
  })

 
  app.get('/studentsapply', (req, res) => {
    studentsCollection.find({confirmAddmission: false})
    .toArray((err, documents) =>{
      res.send(documents);
    })
  })

  
  app.get('/admindata', (req, res) => {
    const email=req.query.email;
    
    adminCollection.find({email: email})
    .toArray((err, documents) =>{
      res.send(documents);
      console.log(documents)
    })
  })

  
  app.patch('/confirm/:id', (req, res) => {
    const id=req.params.id;
    const data= req.body;
    
    studentsCollection.updateOne({_id: ObjectId(id)},
    {$set:{confirmAddmission: true, paymentAmmount: data.ammount,addmissionDate: data.date }}
    )
    .then(result=>{
      res.send(result)
      console.log(data)
    })
   
   
  })

  
app.post('/addstudent', (req, res)=>{
  const student = req.body;
  studentsCollection.insertOne(student)
  .then(resutl=> {
    res.send(resutl)
    console.log(resutl)
  })

})


app.post('/admin', (req, res)=>{
  
  adminCollection.insertOne(req.body)
  .then(resutl=> {
    res.send(resutl)
    console.log(resutl)
  })

})


app.post('/admin/login', (req, res)=>{
  const admin = req.body;
  console.log(admin)
  adminCollection.find({email: admin.email, password: admin.password})
  .toArray((err, document)=>{
    res.send(document[0]);
    console.log(document)
  })

})


console.log('connected')

  // client.close();
});



app.listen(process.env.port || port)
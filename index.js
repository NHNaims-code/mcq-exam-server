const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uduqa.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();
app.use(bodyParser.json());
app.use(cors())



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const questions = client.db("mcqdb").collection("questions");
  const exams = client.db("mcqdb").collection("exams");
  console.log("Database connected");
  
  app.get("/allquestions", (req, res) => {
    questions.find({})
    .toArray((err, documents) => {
      res.send(documents);
    })
  })

  app.get("/allexam", (req, res) => {
    exams.find({})
    .toArray((err, documents) => {
      res.send(documents);
    })
  })

  app.patch('/update/:id', ((req, res) => {
    questions.updateOne(
      {_id: ObjectId(req.params.id)},
      {
        $set: {question : req.body.question, a: req.body.a, b: req.body.b, c: req.body.c}
      })
      .then (result => {
        console.log(result);
        if(result.modifiedCount > 0){
          res.send(true);
        }
      })
  }))

  app.get("/singlequestion/:id", (req, res) => {
    questions.find({ _id: ObjectId(req.params.id) })
    .toArray((err, documents) => {
      res.send(documents[0]);
    })
  })

  app.get("/findexam/:name", (req, res) => {
    questions.find({exam: req.params.name})
    .toArray((err, documents) => {
      res.send(documents);

    })
  })

  app.post("/addquestion", (req, res) => {
        const newQuestion = req.body;
        questions.insertOne(newQuestion)
        .then(result => {
          console.log(result);
          if(result.insertedCount > 0){
            res.send(true)
          }
        })
  })

  app.post("/addexam/:name", (req, res) => {
    exams.insertOne(req.params)
    .then(result => {
      if(result.insertedCount > 0){
        res.send(true);
      }
    })
  })

  app.delete("/deletequestion/:id", (req, res) => {
    const id = req.params.id;
      questions.deleteOne({_id: ObjectId(req.params.id)})
      .then(result => {
        console.log(result);
        if(result.deletedCount > 0){
          res.send(true);
        }
      })
      console.log(id);
  });

  app.delete("/deleteexam/:id", (req, res) => {
    exams.deleteOne({_id: ObjectId(req.params.id)})
    .then(result => {
      if(result.deletedCount > 0){
        res.send(true);
      }
      console.log(result);
    })
  })

});


app.get('/', (req, res) => {
        res.send("I am ready to respond.")
})

app.listen(process.env.PORT || 4000, () => {
})
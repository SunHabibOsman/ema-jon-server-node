const express = require('express');
const cors = require('cors');

const { MongoClient, ServerApiVersion } = require('mongodb');
// require('dotenv').config()
const port = process.env.PORT || 5000;
const app = express()


// middlewere 
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://sun:IRKdwLhyoaTRD92T@cluster0.hvhip.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try {
    await client.connect()
    const emajohncollection = client.db('emajohn').collection('product')

    app.get('/product', async (req, res) => {
      console.log(req.query);
      console.log(req.query.page);
      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);

      const query = {}
      const cursor = emajohncollection.find(query)
      //  skip:0 ,get 10
      //  skip: 1,get 20
      //  skip:2 ,get 30


      let products;
      if (page || size) {
        products = await cursor.skip(page * size).limit(size).toArray()
      }
      else {
        products = await cursor.toArray()
      }

      // const products = await cursor.limit(10).toArray()
      res.send(products)
    })
    app.get('/productcount', async (req, res) => {

      const count = await emajohncollection.estimatedDocumentCount()
      res.send({ count })
      //  res.json(count)
    })
  }
  finally {

  }

}
run().catch(console.dir)


app.get('/', (req, res) => {
  res.send('ema is running')
})
app.listen(port, () => {
  console.log('john is running');

})
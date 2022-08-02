const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

// const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@mycluster.j7lpubg.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const userCollection = client.db("linkedin_clone").collection("user");
        const postCollection = client.db("linkedin_clone").collection("post");
        const commentCollection = client.db("linkedin_clone").collection("comment");

        /**
         * /////////////////////////////// user \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
         * User Collection Crud operation
         */
        app.get('/user', async (_req, res) => {
            const query = {};
            const cursor = userCollection.find(query)
            const users = await cursor.toArray();
            res.send(users)
        })
        //Get one user
        app.get('/user/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const cursor = userCollection.find(query);
            const result = await cursor.toArray();
            res.send(result)
        })

        /**
         * post api
         */
        app.post('/user', async (req, res) => {
            const newUser = req.body;
            // console.log('adding new user', newUser) 
            const result = await userCollection.insertOne(newUser);
            res.send(result)
        })

        /**
         * Delete an user
         */
        app.delete('/user/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await userCollection.deleteOne(query);
            res.send(result)
        })

        /**
         * Update an user
         */
        app.put('/user/:email', async (req, res) => {
            const email = req.params.email;
            const user = req.body;
            const filter = { email: email };
            const options = { upsert: true };
            const updateDoc = {
                $set: user,
            };
            const result = await userCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        });
        /**
         * ////////////////////////////////// Post Collection \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
         */
        app.get('/post', async (_req, res) => {
            const query = {};
            const cursor = postCollection.find(query);
            const posts = await cursor.toArray();
            res.send(posts);
        })
        app.get('/post/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const cursor = postCollection.find(query);
            const post = await cursor.toArray();
            res.send(post);
        })
        app.post('/post', async (req, res) => {
            const newPost = req.body;
            const result = await postCollection.insertOne(newPost);
            res.send(result);
        })
        app.delete('/post/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await postCollection.deleteOne(query);
            res.send({ delete: "success", result: result })
        })
        app.put('/post/:id', async (req, res) => {
            const id = req.params.id;
            const post = req.body;
            const filter = { _id: ObjectId(id) };
            const option = { upsert: true };
            const updatePost = {
                $set: post,
            }
            const result = await postCollection.updateOne(filter, updatePost, option);
            res.send(result)
        })
        /**
         * ////////////////////////////////// Comment Collection \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
         */
        app.get('/comment', async (_req, res) => {
            const query = {};
            const cursor = commentCollection.find(query);
            const posts = await cursor.toArray();
            res.send(posts);
        })
        app.get('/comment/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const cursor = commentCollection.find(query);
            const post = await cursor.toArray();
            res.send(post);
        })
        app.post('/comment', async (req, res) => {
            const newPost = req.body;
            const result = await commentCollection.insertOne(newPost);
            res.send(result);
        })
        app.delete('/comment/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await commentCollection.deleteOne(query);
            res.send({ delete: "success", result: result })
        })
        app.put('/comment/:id', async (req, res) => {
            const id = req.params.id;
            const post = req.body;
            const filter = { _id: ObjectId(id) };
            const option = { upsert: true };
            const updatePost = {
                $set: post,
            }
            const result = await commentCollection.updateOne(filter, updatePost, option);
            res.send(result)
        })


    }
    finally {

    }
}
run().catch(console.dir)


app.get('/', (_req, res) => {
    res.send('Server is Running well')
})

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
})

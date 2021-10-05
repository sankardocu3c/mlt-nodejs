const express = require('express');
const router = express.Router();
const mongodb = require('mongodb');

router.get('/', async (req,res) => {
    const posts = await loadPostsColection();
    res.send(await posts.find({}).toArray());
});

router.post('/', async (req,res) => {
    const posts = await loadPostsColection();
    setTimeout(() => {
        posts.insertOne({
            text: req.body[0],
            createdAt: new Date()
        });
        res.status(201).send()
    },2000)

});

router.delete('/:id',async (req,res) => {
    const posts = await loadPostsColection();
    let i = 0;
    var id_delete = "";
    for(i = 0; i < req.params.id.length; i++) {
        id_delete = id_delete.concat(req.params.id[i]);
    }
    console.log("delete id = : " + id_delete);
    var objectId_delete = await get_id(id_delete);
    posts.deleteOne({_id : objectId_delete})
    res.status(200).send();
});

async function loadPostsColection() {
    const client = await mongodb.MongoClient.connect
    //('mongodb+srv://sankar:sankar1234@project-demo.qvve2.mongodb.net/calendar?retryWrites=true&w=majority',{
    ('mongodb://appointmentmlt:KsOEoinsCdKlD3E53KHb5cslQ8UM7T2cPDDz1zsZ0zfWYOU47bfsTGYZvllp01pi6j9yiqm7WSwaKlbuYolclQ==@appointmentmlt.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&maxIdleTimeMS=120000&appName=@appointmentmlt@',{ 
    useNewUrlParser:true
    });

    return client.db('calendar').collection('events');
}

async function get_id(val){
    const posts = await loadPostsColection();
    console.log(typeof(val));
    var z = await posts.findOne({ "text.Id" : val });
    const value = z._id;
    return value;
}

module.exports = router;
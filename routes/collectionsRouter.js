const { Router } = require('express');
const collectionsController = require("../controllers/collectionsController");



const app = Router();


app.get('/collections',collectionsController.getCollections);

app.get('/collections/add',collectionsController.getAddCollection);

app.post('/collections/add',collectionsController.postAddCollection);

app.get('/collections/search',collectionsController.getSearchCollection);


app.get("/collections/:id",collectionsController.getCollection)



app.get('/collections/:id/edit',collectionsController.getEditCollection);

app.post('/collections/:id/edit',collectionsController.postEditCollection);

app.get('/collections/:id/del',collectionsController.DelCollection);


module.exports =  app;
const { Router } = require('express');
const docsController = require("../controllers/docsController");







const app = Router();


app.get("/collections/:collection_id/search", docsController.getSearchDocs);
app.get("/collections/:collection_id/add", docsController.getAddDocs);
app.post("/collections/:collection_id/add", docsController.postAddDocs);
app.get("/collections/:collection_id/docs/:doc_id",docsController.getDocs)
app.get("/collections/:collection_id/docs/:doc_id/del",docsController.delDoc)
app.get("/collections/:collection_id/edit", docsController.getEditDocs);
app.post("/collections/:collection_id/edit", docsController.postEditDocs);





module.exports =  app;
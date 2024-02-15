const path = require('path');




// const validate = require('../utils/validation/'); 

const flashInputData = require('../utils/validation/flashInputData');
const Collection = require("../database/models/collection");
const Doc = require("../database/models/doc");





async function getSearchDocs(req, res, next) {
    const user_id = req.session.user._id;
    const collection_id = req.params.collection_id;
    const title = req.query.title

    try {
        let docs = await Doc.fetchByTitle(title,collection_id,user_id);
        console.log(docs);
        res.json({statusOk:true,docs: docs});
    } catch (error) {
        console.error("error in getSearchDocs function:",error);
        res.json({statusOk:true,docs: null});
    }
}



async function getAddDocs(req, res, next) {
 const inputdata = flashInputData.getInputData(req,{title:"",content:""});
 return res.render("addDoc",{inputdata:inputdata,collection_id:req.params.collection_id});
}



async function postAddDocs(req, res, next) {
    if (!req.body.title || !req.body.title.trim()||
        !req.body.content || !req.body.content.trim())
        {
            flashInputData.flashInputData(req,{...req.body,massege:"invalid input"},
            function(){res.redirect(`/collections/${req.params.collection_id}/add`)})
            return;
        }

    const collection_id = req.params.collection_id;
    const user_id = req.session.user._id;

    const doc = new Doc(null,req.body.title,req.body.content,collection_id,user_id)

    try {
        const doc_id = await doc.add();
        res.redirect(`/collections/${collection_id}/docs/${doc_id}`)

    } catch (error) {
        res.render("500")
    }
}


async function getDocs(req, res, next) {
    const user_id = req.session.user._id;
    const collection_id = req.params.collection_id;
    const doc_id = req.params.doc_id;
    try {
        const collection  =await new Collection().fetchById(collection_id,user_id)
        if (!collection._id)
            return res.render("404");

        const doc = new Doc();
        const result = await doc.fetchById(doc_id,user_id,collection_id);
        if (result)
            return res.render("doc",{doc:doc.data,collection:collection});
        return res.render("404");

    } catch (error) {
        console.error(error);
        return res.render("500");
    }

}



async function delDoc(req, res, next) {

}



async function getEditDocs(req, res, next) {

}



async function postEditDocs(req, res, next) {

}



module.exports = {
    getSearchDocs:getSearchDocs,
    getAddDocs:getAddDocs,
    postAddDocs:postAddDocs,
    getDocs:getDocs,
    getEditDocs:getEditDocs,
    postEditDocs:postEditDocs,
    delDoc:delDoc,

}

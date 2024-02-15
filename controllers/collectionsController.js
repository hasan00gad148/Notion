const path = require('path');

// const validate = require('../utils/validation/'); 

const flashInputData = require('../utils/validation/flashInputData');
const Collection = require("../database/models/collection");
const Doc = require("../database/models/doc");


async function  getCollections(req,res,next) {

    try {
      const collections = await Collection.fetchByUser(req.session.user._id); //
    //   console.log(collections,req.session.user._id)
      return res.render('collections',{collections:collections});
    } catch (error) {
        next(error);
        return false; 
    }
      
}


async function getCollection(req, res, next) {
  const user_id = req.session.user._id;

  let collection = null;
  try {
    collection = new Collection(req.params.id);
    collection = await collection.fetchById(req.params.id,user_id)
    if(!collection){
      return res.render("404");
    }
    let docs = await Doc.fetchAll(collection._id,req.session.user._id)

    return res.render("collection",{collection:collection,docs:docs})
  } catch (error) {
    next(error);
    return false;
  }
}

async function getAddCollection(req, res, next) {

  let inputData = flashInputData.getInputData(req,{title:"",description:""})
  return res.render('addCollection',{inputData:inputData}); 
}

async function postAddCollection(req, res, next) {
  const title =  req.body.title;
  const description = req.body.description;
  const user_id = req.session.user._id;

  if (!title || !description ||!title.trim()||!description.trim()){
    flashInputData.flashInputData(req,{...req.body,
    massege:"invalid input"},
    function(){
      res.redirect("/collections/add")
    })
    return false;
  }

  try {
    let collection = new Collection(null,title, description, user_id);
    let result = await collection.add(user_id);
    if(result){
      return res.redirect(`/collections/${result}`);
    }else{
      console.error("something went wrong in collectoin add")
      return res.render("500");
    }
  } catch (error) {
    next(error);
    return false;
  }
  
}


async function getSearchCollection(req, res, next){
  const user_id = req.session.user._id;
  let collections ;
  try {
    collections = await Collection.fetchByTitle(req.query.title,user_id);
    if(!collections || !collections.length){
      return res.status(200).json({statusOk:false,collections:null});
    }
  } catch (error) {
    next(error);
    return false;
  }
  return res.status(200).json({statusOk:true,collections:collections})
}


async function getEditCollection(req, res, next) {
  const user_id = req.session.user._id;
  let collection = null;
  try {
    collection = new Collection(req.params.id);
    collection = await collection.fetchById(req.params.id,user_id)
    if(!collection){
      return res.render("404");
    }
  } catch (error) {
    next(error);
    return false;
  }
  
  let inputData = flashInputData.getInputData(req,collection)
  return res.render('editCollection',{inputData:inputData,collection_id:collection._id});
}

async function postEditCollection(req, res, next) {

  const collection_id = req.params.id;
  const title =  req.body.title;
  const description = req.body.description;
  const user_id = req.session.user._id;

  if (!title || !description ||!title.trim()||!description.trim()){
    flashInputData.flashInputData(req,{...req.body,
    massege:"invalid input"},
    function(){
      res.redirect(`/collections/${collection_id}/edit`)
    })
    return false;
  }

  try {
    let collection = new Collection(collection_id,title, description, user_id);
    let result = await collection.update(collection_id,user_id);
    if(result){
      return  res.redirect(`/collections/${collection_id}`)
    }else{
      console.log("something went wrong in collectoin edit")
      return res.render("404");
    }
  } catch (error) {
    next(error);
    return false;
  }
}

async function DelCollection (req, res, next) {
  const user_id = req.session.user._id;

  try {
    let result =await new Collection(req.params.id).delete(req.params.id,user_id);

    if(!result)
      return res.json({statusOk:false})
  } catch (error) {
    console.log(req.params.id,user_id)
    next(error);
    return false;
  }

  return res.json({statusOk:true})
}
module.exports = {getCollections:getCollections,
              getCollection:getCollection,
              getAddCollection:getAddCollection,
              getSearchCollection:getSearchCollection,
              postAddCollection:postAddCollection,
              getEditCollection:getEditCollection,
              postEditCollection:postEditCollection,
              DelCollection:DelCollection}








const path = require('path');

const { v4: uuidv4 } = require("uuid");
const express = require("express");
const formidable = require('express-formidable');

const {getdb,objectId} = require("./database/mongoDB");
const router = require("./routes/changepost");


db = null;

app = express();

app.use('/public',express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));



const formidableConfig ={
  uploadDir: __dirname + "public/uploads", 
  keepExtensions: true, 
  filename: (req, file, cb) => { 
    const uniqueName = uuidv4();
    
    const extension = path.extname(file.name);

    cb(null, uniqueName + extension);
  }
}
app.use(formidable(formidableConfig));


app.use(router);


//================================================================



app.get('/', function (req, res) {
  res.redirect("/posts");
});

app.get('/posts', async function (req, res, next) {
  try {
  const posts = await db.collection("posts").find({}).toArray();

  res.render("posts",{posts:posts})
  } catch (err) {
    return res.status(500).render("500")
  }
});



app.get('/createpost', async function (req, res,next) {
  try {   
    const authers = await db.collection("authers").find({}).toArray();
    res.render("createpost",{authers:authers});
  } catch (error) {
    return res.status(500).render("500")
  }
});


app.post('/createpost', async function (req, res) {
  let auther = null;
  try{
 
    auther = await db.collection("authers").find({_id:new objectId(req.fields.auther)}).toArray();
    auther = auther[0]
    console.log(auther)
    }catch (err) {
      console.error(err)
    return res.send({success: false})
  } 
  post = {
    auther_id:auther._id,
    title:req.fields.title,
    summary:req.fields.summary,
    content:req.fields.content,
    date:new Date(),
    auther:{
      name:auther.name,
      mail:auther.mail
    }
  };

  try{
  await db.collection("posts").insertOne(post)
  res.send({success: true})
  }catch (err) {
    console.error(err)
  res.send({success: false})
  }
});




//===================================================================


app.use((req, res, next) => {
    res.status(404).send('404');
  });

app.use((err,req, res, next) => {
    console.error(err)
    res.status(500 || err.status).render('500');
  });


getdb()
.then(database => {
    db = database
    if (db){

    
    port = 3000
    app.listen(port,(err, req, res)=>{
        if (err){
            console.error(err)
        }
        console.log("listenning on port " +port + ".......")
    })
  }
  else{
    console.error("couldn't connect to database")
  }
})

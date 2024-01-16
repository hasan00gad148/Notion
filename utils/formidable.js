let formidable = require('express-formidable');

const formidableConfig ={
    uploadDir: path.join(__dirname, "uploads") , 
    keepExtensions: true, 
    filename: (req, file, cb) => { 
      const uniqueName = uuidv4();
      
      const extension = path.extname(file.name);
  
      cb(null, uniqueName + extension);
    }
  }
formidable = formidable(formidableConfig);
  
const form = new formidable.IncomingForm();

//   // Pass the csrf token to the form
//   form.append('_csrf', req.csrfToken());

//   // Parse the request
//   form.parse(req, (err, fields, files) => {
//     if (err) {
//       // Handle the error
//       res.status(500).send('Something went wrong');
//     } else {
//       // Handle the success
//       res.status(200).send('File uploaded successfully');
//     }
//   });

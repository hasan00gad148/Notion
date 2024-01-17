 
function flashInputData(req,data,action){
    req.session.inputdata={
        ...data
      }
    req.session.save(action) 
}

function getInputData(req,defaults){
  let inputdata = req.session.inputdata
  if(!inputdata){
    inputdata={
     ...defaults,
      massege:false
    }
  }
  req.session.inputdata = null;
  return inputdata; 
}

module.exports = {flashInputData: flashInputData,getInputData: getInputData}

function validateFormFields(req){
    return (req.body.password && req.body.password.trim() &&
    req.body.email && req.body.email.trim())
} 






module.exports = {validateFormFields:validateFormFields}


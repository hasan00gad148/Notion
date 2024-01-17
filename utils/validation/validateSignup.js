






function validateFormFields(req){
    return (req.body.firstname && req.body.firstname.trim() &&
    req.body.lastname && req.body.lastname.trim() &&
    req.body.password && req.body.password.trim() &&
    req.body.email && req.body.email.trim() )
}

function regexEmail(email){
    const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;
    return regex.test(email)
}



module.exports = {regexEmail:regexEmail,validateFormFields:validateFormFields}
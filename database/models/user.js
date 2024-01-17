const mongodb = require('../mongoDB');


class User{
    constructor(id,firstname, lastname, email, password){
        
        this.data = {}      
        this.data._id = User.id(id)
        this.data.firstname = firstname;
        this.data.lastname = lastname;
        this.data.email = email;
        this.data.password = password;
   
    };

    static id(id){
        if(!id)
            return null;
        try {
            return new mongodb.objectId(id) ;
        } catch (error) {
            return null;
        }        
    }

    async add() {
        console.log("User add func",this.data)
        this.data.date = new Date();
        const result = await mongodb.getdb().collection('users').insertOne(this.data)
        this.data.id = result.insertedId;
        return result ;
    }


    async fetchById(id) {
        if(!this.data._id)
            this.data._id = User.id(id);
        const [user] =  await mongodb.getdb().collection('users').find({_id: this.data._id}).toArray();
        this.data= user
        return user
    }

    async fetchByEmail(email) { 
        if(!this.data.email)
            this.data.email = email;
        const [user] =  await mongodb.getdb().collection('users').find({email: this.data.email}).toArray();
        if (user)
            this.data= user
        return user
    }



}

module.exports = User
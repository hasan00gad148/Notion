const mongodb = require('../mongoDB');


class Collection {
    constructor(id,title,description,user_id){
        this.data = {};

        if(id){
            id = id.toString();
            this.data._id= Collection.id(id);
        }

           
        if(title)
            this.data.title= title;
        if(description)
            this.data.description= description;
        if(user_id){
            user_id = user_id.toString();
            this.data.user_id= Collection.id(user_id);
        }

    }

    static id(id){
        if(!id)
            return null;
        try {
            return new mongodb.objectId(id) ;
        } catch (error) {
            return null;
        }        
    }

    async add(user_id){
        user_id = Collection.id(user_id);
        if(!this.data.user_id )
            this.data.user_id = user_id
        if (!this.data.user_id)
            return null;
        this.data.date = new Date();
        let result = await mongodb.getdb().collection('doc_collections')
        .insertOne(this.data);
        this.data._id = result.insertedId.toString();

        return this.data._id;
    }


    async update(id,user_id){
        if(id)
            this.data._id = Collection.id(id);
        if(user_id)
            this.data.user_id = Collection.id(user_id);

        let result = await mongodb.getdb().collection('doc_collections')
        .updateOne({_id:this.data._id ,user_id:this.data.user_id},
            {$set:{title:this.data.title,description:this.data.description}});
            // console.log({_id:this.data._id ,user_id:this.data.user_id},result);
        return result.matchedCount == 1 || result.modifiedCount == 1;
    }


    async delete(id,user_id){
        if(id)
            this.data._id = Collection.id(id);
        if(user_id)
            this.data.user_id = Collection.id(user_id);

        let result = await mongodb.getdb().collection('doc_collections')
        .deleteOne({_id:this.data._id,user_id:this.data.user_id})

        await mongodb.getdb().collection('docs') 
        .deleteMany({user_id:this.data.user_id,collection_id: this.data._id});

        return result.deletedCount == 1
    }


    async fetchById(id,user_id){
        if(id)
            this.data._id = Collection.id(id);
        if(user_id)
            this.data.user_id = Collection.id(user_id);
        let [collection] = await mongodb.getdb().collection('doc_collections')
        .find({_id:this.data._id,user_id:this.data.user_id}).toArray();
        this.data= collection

        return this.data;
    }


    static async fetchByTitle(title,user_id){


        user_id = Collection.id(user_id);
        if(!user_id)
             return null;
        if (! title)
            return Collection.fetchByUser(user_id);
        let collection = await mongodb.getdb().collection('doc_collections') 
        .find({title:{$regex:`\\w*${title}\\w*`, $options: "i"},user_id:user_id}).toArray();
        return collection;    
    }


    static async fetchByUser(user_id){
        
        if(!user_id)
            return null;

        let collections = await mongodb.getdb().collection('doc_collections').find({user_id:Collection.id(user_id)}).toArray();
        return collections;        
    }
}

module.exports = Collection;
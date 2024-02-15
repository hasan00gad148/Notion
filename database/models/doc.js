const mongodb = require('../mongoDB');

class Doc{
    constructor(id,title,content,collection_id,user_id){
        this.data = {};

        this.data._id=Doc.id(id);
        this.data.title = title;
        this.data.content = content;
        this.data.collection_id = Doc.id(collection_id);
        this.data.user_id = Doc.id(user_id);

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




    async  add(){
        this.data.date = new Date();
        this.data._id=undefined;
        this.data.user_id = Doc.id(this.data.user_id);
        this.data.collection_id = Doc.id(this.data.collection_id);

        if(this.data.user_id && this.data.collection_id){
            let result = await mongodb.getdb().collection('docs')
            .insertOne(this.data);
            this.data._id = result.insertedId.toString();
        }

        return this.data._id;
    }



    async update(id,user_id,collection_id){
        if(id)
            this.data._id = Doc.id(id);
        if(user_id)
            this.data.user_id = Doc.id(user_id);
        if(collection_id)
            this.data.collection_id = Doc.id(collection_id)

        let result = await mongodb.getdb().collection('docs')
        .updateOne({_id:this.data._id ,user_id:this.data.user_id},
            {$set:{title:this.data.title,content:this.data.content}});
            // console.log({_id:this.data._id ,user_id:this.data.user_id},result);
        return result.matchedCount == 1 || result.modifiedCount == 1;
    }



    async fetchById(id,user_id,collection_id){
        if(id)
            this.data._id = Doc.id(id);
        if(user_id)
            this.data.user_id = Doc.id(user_id);
        if(collection_id)
            this.data.collection_id = Doc.id(collection_id)
        let [doc] = await mongodb.getdb().collection('docs') 
        .find({_id:this.data._id ,user_id:this.data.user_id,collection_id: this.data.collection_id}).toArray();
        
        this.data=doc;
        if (doc) 
            return true;
        return false; 
    }     



    static async fetchByTitle(title,collection_id,user_id){
        if(user_id)
            user_id = Doc.id(user_id);
        if(collection_id)
            collection_id = Doc.id(collection_id)
        if(title){
            let docs = await mongodb.getdb().collection('docs') 
            .find({title:{$regex:`\\w*${title}\\w*`, $options: "i"},user_id:user_id,collection_id:collection_id}).toArray();
            return docs; 
        } else{
            let docs = await mongodb.getdb().collection('docs') 
            .find({user_id:user_id,collection_id: collection_id}).toArray();
            return docs; 
        }
    
    }



    static async fetchAll(collection_id,user_id){
        collection_id = Doc.id(collection_id);
        user_id = Doc.id(user_id);

        if(!collection_id || !user_id)
            return null;
        
        let docs = await mongodb.getdb().collection('docs') 
        .find({user_id:user_id,collection_id:collection_id}).toArray();
        return docs; 
    }

    async delete(id,user_id,collection_id){
        if(id)
            this.data._id = Doc.id(id);
        if(user_id)
            this.data.user_id = Doc.id(user_id);
        if(collection_id)
            this.data.collection_id = Doc.id(collection_id)
        let result = await mongodb.getdb().collection('docs') 
        .deleteOne({_id:this.data._id,user_id:this.data.user_id,collection_id: this.data.collection_id});
        this.data=null;
        return result.deletedCount == 1
        
    }    
}

module.exports = Doc;
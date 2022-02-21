const Records = require("./models/recordModels").Records;
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} = require('graphql');



//data
const records_lis = [
    {id : '1' , desc : 'Remaining Balance-1' , amount : 10},
    {id : '2' , desc : 'Remaining Balance-2' , amount : 20},
    {id : '3' , desc : 'Remaining Balance-3' , amount : 30},
    {id : '4' , desc : 'Remaining Balance-4' , amount : 40},
]

// Record Type
const RecordType = new GraphQLObjectType({
    name : 'Record' , 
      fields:()=>({
        id : {type : GraphQLString},
        desc : {type : GraphQLString},
        amount : {type : GraphQLInt}
    })
});



// Root query
const RootQuery = new GraphQLObjectType({
    name : "RootQueryType" , 
     fields :{
        record : {
            type : RecordType,
            args : { id : {type : GraphQLString} } , 
        resolve(parentValue , args){
            return Records.findOne({id : args.id});
               }
        } , 

        records : {
            type : new GraphQLList(RecordType),
            resolve(parentValue , args){ return Records.find({}) }
        }

     }
});



const mutation = new GraphQLObjectType({
    name : 'Mutation' , 
    fields : {
        add_record : {
            type : RecordType,
            args : {
                id : {type : new GraphQLNonNull(GraphQLString)},
                desc : {type : new GraphQLNonNull(GraphQLString)},
                amount : {type : new GraphQLNonNull(GraphQLInt)} } , 
            resolve(parentValue , args){
                let obj = new Records({
                    id : args.id ,
                    desc : args.desc , 
                    amount : args.amount
                });
                return obj.save(); }
        },

        delete_record : {
            type : RecordType , 
            args : { id : {type : new GraphQLNonNull(GraphQLString)} },
            resolve(parentValue , args){
                return new Promise((resolve , reject)=>{
                    Records.findOneAndDelete(
                        {id : args.id},
                        {"new" : true}).exec((err , res)=>{
                            if(err) reject(err)
                            else resolve(res)
                        })

                });
            }
        },

        update_record : {
            type : RecordType , 
            args : {
                id : {type : new GraphQLNonNull(GraphQLString)} , 
                desc : {type : GraphQLString } , 
                amount : {type : GraphQLInt } , 
            },
            resolve(parentValue , args){
                return new Promise((resolve, reject) => {
                    Records.findOneAndUpdate(
                        {"id": args.id},
                        { "$set":{desc: args.desc, amount: args.amount}},
                        {"new": true} 
                    ).exec((err, res) => {
                        if(err) reject(err)
                        else resolve(res)
                    }) })
            }
        }



    }
});





module.exports = new GraphQLSchema({  
     query: RootQuery,
     mutation

  });





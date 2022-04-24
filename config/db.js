require('dotenv').config();
const mongoose = require('mongoose');


function connectDB (){
    // console.log('MongoDB URL in use: ' + process.env.MONGO_CONNECTION_URL)
    //database connection
    // process.env.MONGO_CONNECTION_URL
    // const url ="mongodb+srv://rakesh:J7aWzwdh3DSiAtIc@cluster0.jbkdd.mongodb.net/sharefile?retryWrites=true&w=majority"
    mongoose.connect(process.env.MONGO_CONNECTION_URL,{ useNewUrlParser: true,
        useUnifiedTopology: true});
    const connection = mongoose.connection;

    connection.once('open',()=>{
        console.log('DataBase Connected');
    }),(err =>{
        console.log(err)
        console.log('Connection faild');
    });
    
    // mongoose.connect(process.env.MONGO_CONNECTION_URL, {
    //     useNewUrlParser: true, 
    //     useUnifiedTopology: true 
    //  }, err => {
    //     if(err) throw err;
    //     console.log('Connected to MongoDB!!!')
    //  })

}

module.exports = connectDB;
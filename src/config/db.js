const mongoose = require('mongoose')

const connectToDB = ()=>{
    mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log('Server is connected to DB')
    })
    .catch(()=>{
        console.log('Error connecting to DB');
        process.exit(1);
    })
}

module.exports = connectToDB;
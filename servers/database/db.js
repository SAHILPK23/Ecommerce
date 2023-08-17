import mongoose from "mongoose";


export const Connection = async(USERNAME, PASSWORD) => {
    const URL =`mongodb://${USERNAME}:${PASSWORD}@ac-bkjskya-shard-00-00.mrmr5oo.mongodb.net:27017,ac-bkjskya-shard-00-01.mrmr5oo.mongodb.net:27017,ac-bkjskya-shard-00-02.mrmr5oo.mongodb.net:27017/SANCHEZ?ssl=true&replicaSet=atlas-h9sjm0-shard-0&authSource=admin&retryWrites=true&w=majority`
    try {
         await mongoose.connect(URL, {useUnifiedTopology: true, useNewUrlParser: true });
         console.log('Database connected Successfully');
    }catch(error){
        console.log('Error while connecting wih the database',error.message);

    }
}

export default Connection;
import Mongoose from 'mongoose';



const Category=Mongoose.Schema({
    name:{
        type: String,
    },
    description:{
        type:String
    }
});

const Categories=Mongoose.model('Categories',Category)

export default Categories;
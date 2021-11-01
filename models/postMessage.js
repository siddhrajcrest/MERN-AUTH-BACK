import Mongoose from "mongoose";

const postSchema=Mongoose.Schema({
    category: String,
    description: String,
    name: String,
    price: Number,
    selectedFile: String,
    createdAt:{
        type: Date,
        default: new Date()
    },
});

const postMessage = Mongoose.model('Products', postSchema);

export default postMessage;
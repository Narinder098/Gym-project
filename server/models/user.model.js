import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required :true
    },
    email:{
        type: String,
        required :true
    },
    password:{
        type : String,
        required :true
    },
    mobile:{
        type : Number,
        default : null
    },
    gender:{
        type:String,
        enum:["male","female","other"]
    },
    address: {
        street: String,
        state : String,
        city : String,
        country : String,
        postalCode : Number
    },
    opt:{
        type : Number,
        default : null
    },
    role:{
        type:String,
        enum:["user", "admin"],
        default:"user"
    },
    isVarified:{
        type:Boolean,
        default:false
    },
    token:{
        type : String,
        default: null
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }

},)

const UserModel = mongoose.model("User", userSchema);


export default UserModel;
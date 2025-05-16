import joi from 'joi';

const signupValidiation = (req,res,next) => {
    const schema = joi.object({
        name: joi.string().min(4).max(10).required(),
        email: joi.string().email().required(),
        password: joi.string().min(4).max(10).required()
    });
    const {error} = schema.validate(req.body);
    if(error){
        return res.status(400)  
        .json({message:"bad request" , error})
    }
    next();
}

const loginValidiator = (req,res,next) => {
    const schema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().min(4).max(10).required()
    });
    const {error} = schema.validate(req.body);
    if(error){
        return res.status(400)  
        .json({message:"bad request" , error})
    }
    next();
}

export {signupValidiation , loginValidiator} ;
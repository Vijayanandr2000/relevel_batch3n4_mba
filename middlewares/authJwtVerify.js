const User = require('../models/user.model');
const authConfig = require('../configs/auth.config');
const jwt = require('jsonwebtoken');

const constants = require('../utils/constants');


const verifyToken = (req, res, next) =>{

    const token = req.headers["x-access-token"];

    if(!token){
        return res.status(403).send({
            message : "No token provided !"
        })
    }

    jwt.verify(token, authConfig.secret, (err, decoded) =>{

        if(err){
            return res.status(401).send({
                message : "Unauthorized Token"
            });
        }
        req.userId = decoded.id;
        next();
    })

}

const isAdmin = async (req, res, next) =>{

    const user = await User.findOne({ userId : req.userId});

    if(user && user.userType == constants.userTypes.admin){
        next();
    }else{
        res.status(403).send({
            message : "Only ADMIN are allowed..!"
        })
    }
}

const isTheatreOwner = async (req, res, next) =>{

    const user = await User.findOne({ userId : req.userId});

    if(user && user.userType == constants.userTypes.owner){
        next();
    }else{
        res.status(403).send({
            message : "Only Theatre's Owner are allowed..!"
        })
    }
}


const authJwt = {
    verifyToken,
    isAdmin,
    isTheatreOwner
}

module.exports = authJwt;
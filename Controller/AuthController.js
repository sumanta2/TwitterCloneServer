import UserModel from "../Models/userModel.js";  //if here does not provide .js it will generate error
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken"


//create Account
export const registerUser = async (req, res) => {
    // const { username, password, firstname, lastname } = req.body;

    const salt = await bcrypt.genSalt(10)
    req.body.password =  await bcrypt.hash(req.body.password,salt)

    const newUser = new UserModel(req.body)

    const {username}=req.body;

    try {

        const oldUser= await UserModel.findOne({username})
        if(oldUser)
        {
            res.status(400).json({message:"Username is already registered!"})
        }
        else
        {

            const user=await newUser.save();
            const token=jwt.sign({
                username:user.username,
                id:user._id
            },process.env.JWT_KEY,{expiresIn:"1h"})    //here MERN is secret key and 1h is expire time of the webToken
            res.status(200).json({user:newUser,token})
        }
        
    } catch (error) {
        res.status(500).json({ "message": error.message })
    }
}


//Login user   status code 400 means unauthenticated user

export const loginUser= async(req,res)=>{
    const {username,password} = req.body;
    try {
        const user=await UserModel.findOne({username:username})
        if(user)
        {
            const validity= await bcrypt.compare(password,user.password)

            // validity? res.status(200).json(user):res.status(400).json("Wrong Password")
            if(!validity)
            {
                res.status(400).json("Wrong Password")
            }
            else{
                const token=jwt.sign({
                    username:user.username,
                    id:user._id
                },process.env.JWT_KEY,{expiresIn:"1h"})
                res.status(200).json({user,token})
                
            }
        }
        else{
            res.status(404).json("User Does Not Exist")
        }
    } catch (error) {
            console.log(error)
    }
}
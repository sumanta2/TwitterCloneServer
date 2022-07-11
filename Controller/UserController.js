import UserModel from "../Models/userModel.js";  //if here does not provide .js as extension it generate error 
import bcrypt from "bcrypt"


//get a User

export const getUser = async (req, res) => {
    const id = req.params.id;
    try {
        const user = await UserModel.findById(id)
        if(user)
        {
            const {password , ...otherDetails }=user._doc    //here _doc indicate all the date present in user object which assign to another variable
            res.status(200).json(otherDetails)
        }
        else{
            res.status(404).json("No such User Exists")
        }
        
    } catch (error) {
        res.status(500).json(error)
    }
}

export const updateUser= async (req,res)=>{
    const id=req.params.id 
    const {currentUserId,currentUserAdminStatus,password}=req.body
    if(id=== currentUserId || currentUserAdminStatus)
    {
        try {
            if (password)
            {
                const salt= await bcrypt.genSalt(10)
                req.body.password=await bcrypt.hash(password,salt)
            }
            const user= await UserModel.findByIdAndUpdate(id,req.body,{new:true})
            res.status(200).json(user)
        } catch (error) {
                res.status(500).json(error)
        }
    }
    else{
        res.status(403).json("Access Denied! You can update Only Your own password")
    }
}


//Delete User

export const DeleteUser = async (req,res)=>{
    const id=req.params.id 
    const {currentUserId,currentUserAdminStatus}=req.body
    if(currentUserId || currentUserAdminStatus)
    {
        try {
            await UserModel.findByIdAndDelete(id)
            res.status(200).json("User deleted successfully")
        } catch (error) {
            res.status(500).json(error)
            
        }
    }
    else{
        res.status(403).json("Access Denied! You can Delete Only Your own password")
    }
}

//Follow a User

export const followUser= async (req,res)=>{
    const id=req.params.id 
    const {currentUserId}=req.body
    if(currentUserId === id)
    {
        res.status(403).json("Action forbidden")
    }
    else{
        try {
            const followUser= await UserModel.findById(id)
            const followingUser=await UserModel.findById(currentUserId)
            if(!followUser.followers.includes(currentUserId))
            {
                await followUser.updateOne({$push:{followers:currentUserId}})
                await followingUser.updateOne({$push:{following:id}})
                res.status(200).json("User Followed!")
            }
            else{
                res.status(403).json("User is Already Following by You!")
            }
        } catch (error) {
            res.status(500).json(error)
        }
    }
}


//Follow a User

export const UnFollowUser= async (req,res)=>{
    const id=req.params.id 
    const {currentUserId}=req.body
    if(currentUserId === id)
    {
        res.status(403).json("Action forbidden")
    }
    else{
        try {
            const followUser= await UserModel.findById(id)
            const followingUser=await UserModel.findById(currentUserId)
            if(followUser.followers.includes(currentUserId))
            {
                await followUser.updateOne({$pull:{followers:currentUserId}})
                await followingUser.updateOne({$pull:{following:id}})
                res.status(200).json("User UnFollowed!")
            }
            else{
                res.status(403).json("User is Not Followed by You!")
            }
        } catch (error) {
            res.status(500).json(error)
        }
    }
}
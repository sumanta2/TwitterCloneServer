import UserModel from "../Models/userModel.js";  //if here does not provide .js it will generate error
import bcrypt from 'bcrypt'



//create Account
export const registerUser = async (req, res) => {
    const { username, password, firstname, lastname } = req.body;

    const salt = await bcrypt.genSalt(10)
    const hashedPass =  await bcrypt.hash(password,salt)

    const newUser = new UserModel({ username, password:hashedPass, firstname, lastname })

    try {
        await newUser.save();
        res.status(200).json(newUser)
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

            validity? res.status(200).json(user):res.status(400).json("Wrong Password")
        }
        else{
            res.status(404).json("User Does Not Exist")
        }
    } catch (error) {
            console.log(error)
    }
}
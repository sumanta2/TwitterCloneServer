import express from "express"
import { DeleteUser, getUser, updateUser, followUser,UnFollowUser,getAllUsers } from "../Controller/UserController.js";
import authMiddleWare from "../Middleware/authMiddleware.js";
const router = express.Router()

router.get("/",getAllUsers)
router.get('/:id',getUser);
router.put('/:id',authMiddleWare,updateUser)
router.delete('/:id',authMiddleWare,DeleteUser)
router.put('/:id/follow',authMiddleWare,followUser)
router.put('/:id/unfollow',authMiddleWare,UnFollowUser)

export default router;
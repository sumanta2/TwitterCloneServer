import express from "express"
import { DeleteUser, getUser, updateUser, followUser,UnFollowUser } from "../Controller/UserController.js";

const router = express.Router()


router.get('/:id',getUser);
router.put('/:id',updateUser)
router.delete('/:id',DeleteUser)
router.put('/:id/follow',followUser)
router.put('/:id/unfollow',UnFollowUser)

export default router;
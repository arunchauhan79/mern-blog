import express from "express";
import { deleteUser, test, updateUser, signout, getUsers } from "../controllers/user.controller.js";
import { verifyUser } from "../utils/verifyUser.js";


const router = express.Router();

router.get('/test', test);
router.put('/update/:userId', verifyUser, updateUser)
router.delete('/delete/:userId', verifyUser, deleteUser)
router.get('/getusers', verifyUser, getUsers)
router.post('/signout', signout)

export default router
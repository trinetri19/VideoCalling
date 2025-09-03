import {Router} from 'express'
import { getUser, login, logout, register } from '../controllers/userController.js';
const router = Router();

router.route('/login').post(login)
router.route('/register').post(register)
router.route('/logout').get(logout)
router.route('/user').get(getUser)


export default router;


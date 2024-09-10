const express = require('express');
const router = express.Router();
const authController = require('../controllers/authContoller');
const authMiddleware = require('../middleware/authMiddleware');
const serviceController = require('../controllers/serviceContoller');
const employeeController = require('../controllers/employeeController');
const chatController = require('../controllers/chatController');
const multer = require("multer");
const upload = multer({ dest: 'uploads/' });

router.get("/login", authController.viewLogin);
router.get("/", authMiddleware.handleToken, serviceController.displayService);
router.post("/login", authController.login);
router.get("/logout", authController.logout);
router.post('/register', authController.register);
router.get("/register", authController.viewRegister);
router.get("/profile", authMiddleware.handleToken, authController.viewProfile);
router.get("/services", authMiddleware.handleToken, serviceController.displayService);
router.post('/addService',authMiddleware.handleToken ,upload.single('image_path'), serviceController.addService);
router.get('/addService', serviceController.viewAddService);
router.delete('/deleteService/:serviceId',authMiddleware.handleToken, serviceController.deleteService);
router.post('/updateService/:serviceId',upload.single('image_path') , authMiddleware.handleToken, serviceController.updateService);
router.get('/updateService/:serviceId',  serviceController.viewUpdateService);
router.get('/addEmployee',authMiddleware.handleToken, employeeController.viewAddEmployee);
router.post('/addEmployee', upload.single('image_path'), authMiddleware.handleToken, employeeController.addEmployee);
router.get('/employees', authMiddleware.handleToken, employeeController.viewEmployees);
router.delete('/deleteEmployee/:employeeId',authMiddleware.handleToken, employeeController.deleteEmployee);
router.get('/searchService',authMiddleware.handleToken, serviceController.searchService);
router.post('/filterEmployees',authMiddleware.handleToken, employeeController.filterEmployees);
router.get('/updateProfile', authMiddleware.handleToken, authController.viewUpdateProfile);
router.post('/updateProfile', authMiddleware.handleToken, authController.updateProfile);
router.get('/createOrder', authMiddleware.handleToken, serviceController.viewOrder);
router.post('/createOrder',authMiddleware.handleToken ,serviceController.createOrder);
router.get('/getEmployees', employeeController.getEmployees);
router.get('/support', authMiddleware.handleToken, chatController.viewChats);
router.get('/chat/:userId', authMiddleware.handleToken, chatController.userChat);

module.exports = router;
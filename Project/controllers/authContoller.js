const users = require('../db/userAPI');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient()
const tokenKey = 'borisov-900';
async function register(req, res) {
    const user = await users.getUserByEmail(prisma, req.body.email);
    if (!user) {
        const newUser = await users.addUser(prisma, req.body.username, req.body.email, req.body.password, "user");
        const token = jwt.sign({
            id: newUser.user_id,
        }, tokenKey, {expiresIn: 60 * 60});
        res.cookie("accessToken", token);
        const isAdmin = newUser.role !== "user";
        return res.render('profile', {
            user: newUser,
            isAdmin: isAdmin
        });
    }
    res.render('registerView', {
        error: "User with this email already exist"
    })
}

function logout(req, res) {
    res.clearCookie('accessToken');
    res.render("login");
}
async function login(req, res) {
    const user = await users.getUserByEmail(prisma, req.body.username, req.body.password);
    if(user) {
        const token = jwt.sign({
            id: user.user_id,
        }, tokenKey, {expiresIn: 60 * 60});
        res.cookie("accessToken", token);
        const isAdmin = user.role !== "user";
        return res.render('profile', {
            user: user,
            isAdmin: isAdmin,
        });
    }
    res.render('login', {
        error: "There is no user with this email or password"
    })
}


function viewRegister(req, res) {
    res.render('registerView');
}

async function viewProfile(req, res) {
    const user = await users.getUser(prisma, req.payload.id);
    const isAdmin = user.role !== "user";
    res.render('profile', {
        user: user,
        isAdmin: isAdmin
    });
}

async function updateProfile(req, res) {
    if(req.body.confirmPassword === req.body.password) {
        const newUser = await users.updateUser(prisma, req.payload.id, req.body.username, req.body.password);
        const user = await users.getUser(prisma, req.payload.id);
        const isAdmin = user.role !== "user";
        return res.render('profile', {
            user: user,
            isAdmin: isAdmin,
        })
    }
    else {
        return res.render('updateProfile', {
            error: "Пароли не совпадают.",
        });
    }

}

async function viewUpdateProfile(req, res) {
    res.render('updateProfile');
}

function viewLogin(req , res) {
    res.render("Login");
}

module.exports = {
    login,
    logout,
    register,
    viewRegister,
    viewProfile,
    viewLogin,
    viewUpdateProfile,
    updateProfile
}
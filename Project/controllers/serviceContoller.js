const Services = require('../db/serviceAPI');
const { PrismaClient } = require('@prisma/client')
const users = require("../db/userAPI");
const {updateOrder} = require("../db/OrdersAPI");
const Orders = require('../db/OrdersAPI');
const Employees = require('../db/employeeAPI');
const nodemailer = require('nodemailer');

const prisma = new PrismaClient()


const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'leverxnodemailer@gmail.com',
        pass: 'xbwb tfwf htdi spcg'
    }
});
async function displayService(req , res) {
    const services = await Services.getServices(prisma);
    const user = await users.getUser(prisma, req.payload.id);
    const isAdmin = user.role !== "user";
    return res.render('services', {
        isAdmin: isAdmin,
        services: services,
    });
}

async function addService(req, res) {
    const services = await Services.getServices(prisma);
    const user = await users.getUser(prisma, req.payload.id);
    const isAdmin = user.role !== "user";
    if(services.length !== 0) {
        for (let i of services) {
            if(i.service_name === req.body.service_name) {
                return     res.render('profile', {
                    user: user,
                    isAdmin: isAdmin,
                    error: "This service already exist"
                })
            }
            else {
                await Services.addService(prisma, req.body.service_name, req.body.description, +req.body.price, `img\\${req.file.originalname}`);
                return  res.render('profile', {
                    user: user,
                    isAdmin: isAdmin
                });
            }
        }
    }
    else {
        await Services.addService(prisma, req.body.service_name, req.body.description, +req.body.price, `img\\${req.file.originalname}`);
        return   res.render('profile', {
            user: user,
            isAdmin: isAdmin
        });
    }
}

function viewAddService(req, res) {
    res.render('addService');
}

async function deleteService(req, res) {
    const serviceId = req.params.serviceId;
    await Services.deleteService(prisma, serviceId);
    const services = await Services.getServices(prisma);
    const user = await users.getUser(prisma, req.payload.id);
    const isAdmin = user.role !== "user";
    return res.render('services', {
        isAdmin: isAdmin,
        services: services,
    });
}

async function updateService(req, res) {
    const serviceId = req.params.serviceId;
    const updatedServiceData = req.body;
    const user = await users.getUser(prisma, req.payload.id);
    const isAdmin = user.role !== "user";
    try {
        const updatedService = await Services.updateService(prisma, serviceId, updatedServiceData.serviceName, updatedServiceData.serviceDescription, +updatedServiceData.servicePrice,`img\\${req.file.originalname}`);
        if (!updatedService) {
            return res.status(404).json({ error: 'Сервис не найден' });
        }
        res.render('profile', {
            user: user,
            isAdmin: isAdmin
        });
    } catch (error) {
        console.error('Ошибка обновления сервиса:', error);
        res.render('profile', {
            user: user,
            isAdmin: isAdmin,
            error: error
        });
    }
}


async function viewOrder(req, res) {
    const services = await Services.getServices(prisma);
    res.render('createOrder', {
        services: services
    });
}

async function createOrder(req, res) {
    const service = await Services.getService(prisma, req.body.serviceId);
    const order = await Orders.addOrder(prisma, req.payload.id, req.body.employeeId, service.price, req.body.serviceId, new Date());
    const services = await Services.getServices(prisma);
    const mailOptions = {
        from: 'leverxnodemailer@gmail.com',
        to: req.body.customerEmail,
        subject: 'Мойдодыр: подтверждение заказа!',
        text: 'Ваш заказ был успешно принят!'
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
    const user = await users.getUser(prisma, req.payload.id);
    const isAdmin = user.role !== "user";
    return res.render('services', {
        isAdmin: isAdmin,
        services: services,
    });
}

async function viewUpdateService(req, res) {
    res.render('updateService');
}

async function searchService(req, res) {
    const user = await users.getUser(prisma, req.payload.id);
    const isAdmin = user.role !== "user";
    const searchQuery = req.query.query;
    try {
        const searchResult = await prisma.services.findMany({
            where: {
                service_name: {
                    contains: searchQuery,
                },
            },
        });
        res.render('services', {
            services: searchResult,
            isAdmin: isAdmin
        });
    } catch (error) {
        console.error('Ошибка поиска сотрудников:', error);
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
}
module.exports = {
    displayService,
    addService,
    viewAddService,
    deleteService,
    updateService,
    viewUpdateService,
    searchService,
    viewOrder,
    createOrder
}
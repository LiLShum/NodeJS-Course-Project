const Employees = require('../db/employeeAPI');
const Services = require('../db/serviceAPI');
const { PrismaClient } = require('@prisma/client');
const bodyParser = require("body-parser");
const users = require("../db/userAPI");
const {query} = require("express");

const prisma = new PrismaClient();

async function addEmployee(req, res) {
    const employees = await Employees.getEmployees(prisma);
    const user = await users.getUser(prisma, req.payload.id);
    const isAdmin = user.role !== "user";
    const employee = await Employees.addEmployee(prisma, req.body.employeeName, req.body.sex, `img\\${req.file.originalname}`, req.body.services);
    res.render('profile', {
        user: user,
        isAdmin: isAdmin
    });
}

async function viewAddEmployee(req, res) {
    const services = await Services.getServices(prisma);
    res.render('addEmployee', {
        services: services
    });
}

async function deleteEmployee(req, res) {
    const employeeId = req.params.employeeId;
    const deleted = await Employees.deleteEmployee(prisma, employeeId);
    const user = await users.getUser(prisma, req.payload.id);
    const employees = await Employees.getEmployees(prisma);
    const isAdmin = user.role !== "user";
    res.render('employees', {
        isAdmin: isAdmin,
        employees: employees,
    })
}

async function viewEmployees(req, res) {
    const employees = await prisma.employees.findMany({
        include: {
            Employee_Service: {
                include: {
                    Services: true
                }
            }
        }
    });
    const user = await users.getUser(prisma, req.payload.id);
    const isAdmin = user.role !== "user";
    res.render('employees', {
        isAdmin: isAdmin,
        employees: employees,
    })
}

async function getEmployees(req, res) {
    const { serviceId } = req.query;
    try {
        const employees = await prisma.employees.findMany({
            where: {
                Employee_Service: {
                    some: {
                        service_id: serviceId
                    }
                }
            }
        });
        res.json(employees);
    } catch (error) {
        console.error('Ошибка при получении данных о сотрудниках:', error);
        res.status(500).send('Ошибка при получении данных о сотрудниках');
    }
}


async function filterEmployees(req, res) {
    try {
        const user = await users.getUser(prisma, req.payload.id);
        const isAdmin = user.role !== "user";
        const genderFilter = req.body.gender;
        const nameFilter = req.body.name;

        const whereClause = {};
        if (genderFilter) {
            whereClause.sex = genderFilter;
        }
        if (nameFilter) {
            whereClause.employee_name = {
                contains: nameFilter,
            };
        }

        const filteredEmployees = await prisma.employees.findMany({
            where: whereClause,
            include: {
                Employee_Service: {
                    include: {
                        Services: true
                    }
                }
            }
        });

        res.render('employees', {
            employees: filteredEmployees,
            isAdmin: isAdmin,
        });
    } catch (error) {
        console.error('Ошибка при фильтрации сотрудников:', error);
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
}

module.exports = {
    viewEmployees,
    viewAddEmployee,
    addEmployee,
    deleteEmployee,
    filterEmployees,
    getEmployees
}
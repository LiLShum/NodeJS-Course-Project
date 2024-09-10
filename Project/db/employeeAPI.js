const { v4: uuid4 } = require("uuid");

async function addEmployee(db, employee_name, sex, image_path, service_ids) {

    const employee_id = uuid4();

    let employee_service_data = [];

    if (Array.isArray(service_ids)) {
        for (let i = 0; i < service_ids.length; i++) {
            const service = await db.services.findUnique({
                where: {
                    service_id: service_ids[i]
                }
            });
            employee_service_data.push({
                employee_id: employee_id,
                service_id: service_ids[i],
                service_name: service.service_name,
            });
        }

    } else {
        const service = await db.services.findUnique({
            where: {
                service_id: service_ids
            }
        });
        employee_service_data.push({
            employee_id: employee_id,
            service_id: service_ids,
            service_name: service.service_name,
        });
    }

    const employee = await db.employees.create({
        data: {
            employee_id: employee_id,
            employee_name: employee_name,
            sex: sex,
            image_path: image_path,
        }
    })

    const employee_service = await db.employee_Service.createMany({
        data: employee_service_data
    });
    return employee;
}



async function updateEmployee(db, employee_id, employee_name, sex, service_ids) {
    const updatedEmployee = await db.employees.update({
        where: {
            employee_id: employee_id
        },
        data: {
            employee_name: employee_name,
            sex: sex
        },
        include: {
            Employee_Service: true
        }
    });
    await db.Employee_Service.deleteMany({
        where: {
            employee_id: employee_id
        }
    });
    await db.Employee_Service.createMany({
        data: service_ids.map(service_id => ({
            employee_id: employee_id,
            service_id: service_id
        }))
    });
    return updatedEmployee;
}

async function deleteEmployee(db, employee_id) {
    await db.Employee_Service.deleteMany({
        where: {
            employee_id: employee_id
        }
    });
    return db.employees.delete({
        where: {
            employee_id: employee_id
        }
    });
}

async function getEmployees(db) {
    return db.employees.findMany();
}
async function getEmployee(db, employee_id) {
    return db.employees.findUnique({
        where: {
            employee_id: employee_id
        },
        include: {
            Employee_Service: true
        }
    });
}

module.exports = {
    addEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployee,
    getEmployees,
};

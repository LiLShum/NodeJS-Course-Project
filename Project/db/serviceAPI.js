const {v4: uuid4} = require("uuid");
async function addService(db, service_name, description, price, image_path) {
    return db.services.create({
        data: {
            service_id: uuid4(),
            service_name: service_name,
            description: description,
            price: price,
            image_path: image_path
        }
    });
}


async function deleteService(db, service_id) {
    await db.Employee_Service.deleteMany({
        where: {
            service_id: service_id,
        }
    })
    return db.services.delete({
        where: {
            service_id: service_id
        }
    })
}

async function updateService(db, service_id, service_name, description, price, service_image) {
    return db.services.update({
        where: {
            service_id: service_id
        },
        data: {
            service_name: service_name,
            description: description,
            price: price,
            image_path: service_image
        }
    });
}

async function getService(db, service_id) {
    return db.services.findUnique({
        where: {
            service_id: service_id
        }
    });
}

async function getServices(db) {
    return db.services.findMany();
}

module.exports = {
    addService,
    updateService,
    deleteService,
    getService,
    getServices
}
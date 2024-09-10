const {v4: uuid4} = require("uuid");
async function addOrder(db, user_id, employee_id, price, service_id, date_of_order) {
    return db.orders.create({
       data: {
           order_id: uuid4(),
           user_id: user_id,
           employee_id: employee_id,
           price: price,
           service_id: service_id,
           date_of_order: date_of_order
       }
    });
}

async function deleteOrder(order_id) {
    return db.orders.delete({
        where: {
            order_id: order_id
        }
    });
}

async function updateOrder(db, employee_id, price, service_id, date_of_order, order_id) {
    const order = await db.orders.findUnique({
        where: {
            order_id: order_id
        }
    });
    price = price === null ? order.price : price;
    date_of_order = date_of_order === null ? order.date_of_order : date_of_order;
    service_id = service_id === null ? order.service_id : service_id;
    employee_id = employee_id === null ? order.employee_id : employee_id;
    return db.orders.update({
        where: {
            order_id: order_id
        },
        data: {
            employee_id: employee_id,
            user_id: order.user_id,
            price: price,
            service_id: service_id,
            date_of_order: date_of_order,
        }
    })
}
async function getOrders(db) {
    return db.orders.findMany();
}

async function getOrder(db,order_id){
    return db.orders.findUnique({
        where: {
            order_id: order_id
        }
    })
}

module.exports = {
    deleteOrder,
    addOrder,
    updateOrder,
    getOrder,
    getOrders,
}
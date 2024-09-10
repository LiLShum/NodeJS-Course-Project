const {v4: uuid4} = require("uuid");

async function getUsers(db) {
    return db.users.findMany();
}

async function getUser(db, user_id) {
    return db.users.findUnique({
        where: {
            user_id: user_id
        }
    });
}

async function addUser(db, username, email, password, role)  {
    return db.users.create({
        data: {
            user_id: uuid4(),
            username: username,
            email: email,
            password: password,
            role: role
        }
    });
}

async function updateUser(db, id, username, password) {
    return db.users.update({
    where: {
        user_id: id
    },
    data: {
        username: username,
        password: password
    }
});
}

async function deleteUser(db, user_id){
    return db.users.delete({
        where: {
            user_id: user_id
        }
    })
}

async function getUserByEmail(db, email, password) {
    return db.users.findUnique({
        where: {
            email: email,
            password: password
        }
    });
}

module.exports = {
    addUser,
    updateUser,
    deleteUser,
    getUser,
    getUsers,
    getUserByEmail
}

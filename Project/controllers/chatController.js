const users = require("../db/userAPI");
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
async function viewChats(req, res) {
    const user = await users.getUser(prisma, req.payload.id)
    const isAdmin = user.role !== "user";
    const messages = await prisma.messages.findMany({
        where: {
            OR: [
                {
                    User_message: {
                        some: {
                            user_id: req.payload.id
                        }
                    }
                },
                {
                    User_message: {
                        some: {
                            user_id: "111"
                        }
                    }
                }
            ]
        },
        orderBy: {
            date_and_time: 'asc'
        },
    });
    const messagesWithUsername = messages.map(message => {
        message.username = user.username;
        return message;
    });
    if (isAdmin) {
        res.render('admin_chat', {
            users: await users.getUsers(prisma),
            user: user
        });
    } else {
        res.render('user_chat', { messages: messages, isAdmin: false, userId: req.payload.id , myUserName: user.username, senderName: user.username, receiverName: 'Admin'});
    }
}

async function userChat(req, res) {
    try {
        const userId = req.params.userId;
        const user =  await users.getUser(prisma, userId);
        const currentUser = await users.getUser(prisma, req.payload.id);
        const messages = await prisma.messages.findMany({
            where: {
                OR: [
                    {
                        User_message: {
                            some: {
                                user_id: userId
                            }
                        }
                    },
                    {
                        User_message: {
                            some: {
                                user_id: "111"
                            }
                        }
                    }
                ]
            },
            orderBy: {
                date_and_time: 'asc'
            },
        });

        res.render('user_chat', { messages: messages, myUserName: currentUser.username, userId: userId, userName: user.username, receiver: userId, senderName: currentUser.username, receiverName: user.username});
    } catch (error) {
        console.error('Ошибка при получении сообщений из базы данных:', error);
        res.status(500).send('Ошибка при загрузке сообщений чата');
    }
}

module.exports = {
    viewChats,
    userChat
}
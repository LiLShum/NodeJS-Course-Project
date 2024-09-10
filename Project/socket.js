const {v4: uuid4} = require("uuid");
const io = require('socket.io')(https);

io.on('connection',  (socket) => {
    socket.on('join', async (data) => {
        const key = data.receiver + data.sender;
        socket.join(key);
    });
    socket.on('message', async (data) => {
        const messageId = uuid4();
        await prisma.messages.create({
            data: {
                message_id: messageId,
                message: data.message,
                date_and_time: new Date(),
                receiver: data.receiver,
                sender: data.sender
            },
        });

        await prisma.user_message.create({
            data: {
                message_id: messageId,
                user_id: data.userId,
            },
        });
        const key = data.receiver + data.sender;
        socket.emit('message', {message: data.message, userName: data.userName})
    })
})

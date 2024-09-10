const express = require('express');
const fs = require('fs');
const app = express();
const router = require('./router/router');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { v4: uuid4 } = require("uuid");
const hbs = require('express-handlebars').create({
    extname: '.hbs'
});

let options =
    {
        key: fs.readFileSync('LAB.KEY'),
        passphrase: '12345',
        cert: fs.readFileSync('LAB.crt')
    };

const https = require('https').createServer(options, app);
const io = require('socket.io')(https);
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');

app.use(express.static(__dirname + '/static'));
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/', router);

io.on('connection',  (socket) => {
    socket.on('join', (data) => {
        const key = data.receiver + data.sender;
        socket.join(key);
    });
     socket.on('message', async (data) => {
         io.emit('message',  { message: data.message, userId: data.userId, userName: data.userName, receiver: data.receiver, sender: data.sender });
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

    })
})


app.set('views', __dirname + '\\views');
const PORT = process.env.PORT ?? 3333;

https.listen(PORT, () => {
    console.log(`Server has been started on  https://sna:${PORT}`);
});

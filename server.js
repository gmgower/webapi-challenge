const express = require('express');

const server = express();

const projectRouter = require('./routers/projectRouter.js');
const actionRouter = require('./routers/actionRouter.js');

server.use(express.json());

server.use('/projects', projectRouter);
server.use('/actions', actionRouter);

server.get('/', (req, res) => {
    res.send(`<h2>Test!!!</h2>`)
})

module.exports = server
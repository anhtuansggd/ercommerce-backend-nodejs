const app = require("./src/app")
const PORT = 3005

const server  = app.listen(PORT, () => {
    console.log(`Web service Ecommerce start with port: ${PORT}`);
})

process.on('SIGINT', () => {
    server.close( () => console.log(`Exit Server Express`))
})
const app = require("./src/app")
const PORT = process.env.DEV_APP_PORT || process.env.PROD_APP_PORT

const server  = app.listen(PORT, () => {
    console.log(`Web service Ecommerce start with port: ${PORT}`);
})

process.on('SIGINT', () => {
    server.close(
        () => {
            console.log(`Exit Server Express`)
                process.exit(0)
        }
    )
})
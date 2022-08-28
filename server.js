const http = require('http')
const app = require('./app')

const server = http.createServer(app)

try {
    app.set('port', process.env.PORT || 3000)
    server.listen(process.env.PORT || 3000, ()=>{
        console.log('Listen to port:', 3000);
})
} catch (error) {
    console.log('error connect to server');
}




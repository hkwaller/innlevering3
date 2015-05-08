var express =               require('express'),
    expressJwt =            require('express-jwt'),
    app =                   express(),
    bodyParser =            require('body-parser'),
    mongoose =              require('mongoose'),
    jwt =                   require('jsonwebtoken'),
    websocket =             require('./server/websockets.js'),
    postController =     require('./server/controllers/post-controller.js'),
    authController =       require('./server/controllers/auth-controller.js')

mongoose.connect('mongodb://localhost:27017/posts')

var secret = "supersecret"

app.use('/api/', expressJwt({secret: secret}))
app.use('/', express.static(__dirname + '/webapp/'))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/authenticate', authController.authenticate)
app.post('/signup', authController.signUp)
app.post('/api/posts', postController.create)
app.get('/api/posts', postController.list)
app.delete('/api/posts', postController.delete)

var server = app.listen(3000, function() {
    console.log('Im alive..')
    websocket.connect(server)
})
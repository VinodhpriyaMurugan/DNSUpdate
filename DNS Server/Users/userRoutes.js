module.exports = app => {
    var router = require('express').Router();
    const users = require('./users');
console.log("user router called")
    router.post('/register', users.create)
    router.get('/getAllUsers',users.findUsers)
    router.get('/getUserByRole',users.getByRole)
    router.get('/getUser/:id', users.findOne)
    router.post('/login', users.login)
    // router.get('/count',users.getCount)
    app.use('/api/users', router);
}

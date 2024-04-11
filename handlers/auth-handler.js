const mongoose = require('mongoose');
const User = require('../models/user');

const { connect } = require('../util/database');
const { response, error } = require('../util/response');

let client = null;
const secret = process.env.SECRET;

module.exports.login = async (event) => {
    const body = JSON.parse(req.body);
    const { username, password } = body;

    if (!username) {
        return response(400, { message: 'You need to enter a username.'});
    }

    if (!password) {
        return response(400, { message: 'You need to enter a password.'});
    }

    try {
        client = await connect();

        let userFound = await User.findOne({
            username: username,
        });

        if (!userFound) {
            return response(404, { message: 'Could not find user.' });
        }

        const isCorrect = await bcrypt.compare(password, userFound.password);
        if (!isCorrect) {
            return response(409, { message: 'Incorrect password' });
        }

        const result = await User.findByIdAndUpdate(userFound._id, {
            lastLogin: new Date().toISOString()
        });

        if (!result) {
            return response(409, { message: 'Could not update login info'});
        }

        const token = util.signToken(userFound);
    
        return response(200, {
            access_token: token,
            isAdmin: userFound.isAdmin,
            userId: userFound._id 
        });
        
    } catch (err) {
        console.log(err);
        return error('Could not login');
    }
}

module.exports.register = async (event) => {
    const { email, username, password, rePassword } = req.body;

    if (!email) {
        return response(409, { message: 'You need to enter email'});
    }

    if (!username) {
        return response(409, { message: 'You need to enter username'});
    }

    if (!password) {
        return response(409, { message: 'You need to enter password'});
    }

    if (!rePassword) {
        return response(409, { message: 'You need to re-enter password'});
    }

    if (password !== rePassword) {
        return response(409, { message: 'Re-entered password does not match' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 12);

        const apiToken = jwt.sign({
            username: username,
            password: hashedPassword,
            isAdmin: false,
            active: true
        }, secret);

        const user = new User({
            username: username,
            email: email,
            active: true,
            password: hashedPassword,
            apiToken: apiToken
        });
    
        const result = await user.save();

        if (!result) {
            return response(409, { message: 'Could not create user.'});
        }

        const token = util.signToken(user);
        
       return response(200, { access_token: token, userId: result._id });

    } catch (err) {
        console.log(err);
        return error('Could not register');
    }
}
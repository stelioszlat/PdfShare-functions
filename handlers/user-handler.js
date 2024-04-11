const mongoose = require('mongoose');
const User = require('../models/user');

const { connect } = require('../util/database');
const { response, error } = require('../util/response');

let client = null;
const secret = process.env.SECRET;

module.exports.getUsers = async (event) => {
    try {
        client = await connect();

        const users = await User.find();

        if (!users) {
            return response(404, { message: 'Could not find users.' });
        }
 
        return response(200, { users });
    } catch (err) {
        console.log(err);
        return error('Could not find users.');
    } finally {
        client.disconnect();
    }
}

module.exports.createUser = async (event) => {
    const body = JSON.parse(event.body);

    const { email, username, isAdmin, password, rePassword } = body;

    if (!email) {
        return response(409, { message: 'You need to enter email' });
    }

    if (!username) {
        return response(409, { message: 'You need to enter username' });
    }

    if (!password) {
        return response(409, { message: 'You need to enter password' });
    }

    if (!rePassword) {
        return response(409, { message: 'You need to re-enter password' });
    }

    if (password !== rePassword) {
        return response(409, { message: 'Re-entered password does not match' });
    }

    try {
        client = await connect();

        const existingUser = await User.findOne({
            username: username,
            email: email
        });

        if (existingUser) {
            return response(409, { message: 'User already exists' });
        }

        const apiToken = jwt.sign({
            username: username,
            password: password,
            active: true,
            isAdmin: isAdmin
        }, secret);

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({
            username: username,
            email: email,
            active: true,
            apiToken: apiToken,
            password: hashedPassword,
        });
    
        const result = await user.save();

        if (!result) {
            return response(409, { message: 'Could not create user.' });
        }
        
        return response(200, { user });
    } catch (err) {
        console.log(err);
        return error('Could not createUser');
    } finally {
        await client.disconnect();
    }
}

module.exports.getUserById = async (event) => {
    let userId = event.pathParameters;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return response(404, { message: 'Could not find user.' });
    }

    try {
        client = await connect();

        const user = await User.findById(userId);

        if (!user) {
            response(404, { message: 'User does not exist' });
        }

        return response(200, { user });
    } catch (err) {
        console.log(err);
        return error('Could not get user.');
    }
}

module.exports.updateUserById = async (event) => {
    const userId = event.pathParameters;
    const body = JSON.parse(event.body);

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return response(404, { message: 'Could not find user.' });
    }

    try {
        client = await connect();

        const user = await User.findByIdAndUpdate(userId, {
            ...body
        });

        if (!user) {
            return response(404, { message: 'User does not exist' });
        }

        return response(200, { user });
    
    } catch (err) {
        console.log(err);
        return error('Could not update user');
    }
}


module.exports.deleteUserById = async (event) => {
    const userId = event.pathParameters;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return response(404, { message: 'Could not find user.' });
    }

    try {
        client = await connect();

        const user = await User.findByIdAndDelete(userId);

        if (!user) {
            return response(404, { message: 'User does not exist' });
        }

        return response(200, { user });
    
    } catch (err) {
        console.log(err);
        return error('Could not delete user');
    }
}

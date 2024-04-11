const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI

let client = null;

module.exports.connect = async () => {
    try {
        if (client == null) {
            client = await mongoose.connect(MONGO_URI, {
                serverSelectionTimeoutMS: 5000,
                useNewUrlParser: true,
                useUnifiedTopology: true,
                bufferCommands: false,
            });
        }

        return client;
    } catch (err) {
        console.log(err);
    }
}
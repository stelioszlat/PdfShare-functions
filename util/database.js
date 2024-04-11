const MONGO_URI = process.env.MONGO_URI

export default connect = async () => {
    try {
        if (client == null) {
            client = await mongoose.connect(MONGO_URI, {
                serverSelectionTimeoutMS: 5000,
                useNewUrlParser: true,
                useUnifiedTopology: true,
                bufferCommands: false,
            });
        }
    } catch (err) {
        console.log(err);
    }
}
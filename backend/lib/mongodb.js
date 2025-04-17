import mongoose from 'mongoose'

const connectDb = async () => {
    mongoose.connection.on('connected' ,() => {
        console.log('mongodb подключен')
    })
    await mongoose.connect(`${process.env.MONGODB_URI}/twitter`)
}
export default connectDb
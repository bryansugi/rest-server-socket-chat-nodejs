const mongoose = require('mongoose')
const colors = require('colors')

const dbConnection = async() => {

    try {

        await mongoose.connect(process.env.MONGODB_CON, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        })

        console.log('Base de datos online'.green)

    } catch (error) {
        console.log(error)
        throw new Error('Error al momento de inicializar la base de datos')
    }

}

module.exports = {
    dbConnection
}
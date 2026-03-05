
import mongoose from 'mongoose';

const conectarDB = async () => {
    try {
        
        const conn = await mongoose.connect('mongodb://localhost:27017/MONGO_URL');

        console.log(`✅ MongoDB Conectado: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Error al conectar a MongoDB: ${error.message}`);
        process.exit(1);
    }
};




export default conectarDB;

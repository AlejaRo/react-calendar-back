const mongoose = require('mongoose');

const dbConnection = async () => {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(process.env.DB_CNN);

    console.log('DB online');
  } catch (error) {
    console.log(error);
    throw new Error('DB connection error');
  }
};

module.exports = {
  dbConnection
}
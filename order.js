
const mongoose =require('mongoose')

// creating schema

const orderSchema = new mongoose.Schema({
    confirmed: Boolean,
    packed: Boolean,
    onTheWay: Boolean,
    delivered: Boolean,
  });

  const order = mongoose.model('Order', orderSchema)


  module.exports = order
  
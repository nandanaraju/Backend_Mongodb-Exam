const { Schema } = require('mongoose')
const { model } = require('mongoose')
const demo = new Schema({
    parcelId: { type: Number, required: true, unique: true },
    sender_name: { type: String, required: true },
    receiver_name: { type: String, required: true },
    dispatch_date: { type: Date, required: true },
    delivery_date: { type: Date, required: true }

})

const Parceldetails = model('Parceldetails', demo)
module.exports = Parceldetails   



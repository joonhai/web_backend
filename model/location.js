const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Location Schema
const locationSchema = new Schema({
    title: { type: String, required: true },
    address: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    memo: { type: String, required: true },
    time: { type: String, required: true },
    bodyId: { type: Schema.Types.ObjectId, ref: 'Body', required: true },
});
const Location = mongoose.model('Location', locationSchema);

// Body Schema
const bodySchema = new Schema({
    title: { type: String, required: true },
    content: {type:String, required: true},
    location: [{ type: Schema.Types.ObjectId, ref: 'Location' },]  // Location 모델과 참조 연결
});
const Body = mongoose.model('Body', bodySchema);

module.exports = { Location, Body };

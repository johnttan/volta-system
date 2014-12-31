var mongoose = require('mongoose');
var Schema = mongoose.Schema;

exports.consumerSchema = new Schema({
  ip: String,
  id: String,
  role: String,
  subRole: String
});

exports.systemSchema = new Schema({
  connections: Number,
  ip: String,
  id: String,
  role: String,
  subRole: String
});

exports.producerSchema = new Schema({
  connections: Number,
  ip: String,
  id: String,
  role: String,
  subRole: String
});


var mongoose = require('mongoose');
var Schema = mongoose.Schema;

exports.consumerSchema = new Schema({
  ip: String,
  id: {type: String, unique: true},
  role: String,
  subRole: String
});

exports.systemSchema = new Schema({
  connections: Number,
  ip: String,
  id: {type: String, unique: true},
  role: String,
  subRole: String
});

exports.producerSchema = new Schema({
  ip: String,
  id: {type: String, unique: true},
  role: String,
  subRole: String
});

exports.models = {};
exports.models.consumer = mongoose.model('Consumers', exports.consumerSchema);
exports.models.producer = mongoose.model('Producers', exports.producerSchema);
exports.models.system = mongoose.model('System', exports.systemSchema);

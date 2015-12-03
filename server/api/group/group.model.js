'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema for Group
var groupSchema = new Schema({
  name: { type: String, required: true },
  bet: { type: Number, required: true },
  description: { type: String, required: false },
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  _members: [{type: mongoose.Schema.Types.ObjectId, ref:'User', required: false }],
  _creator: { type: mongoose.Schema.Types.ObjectId, ref:'User', required: true },
  created_at: Date,
  updated_at: Date
});

var Group = mongoose.model('Group', groupSchema);

module.exports = mongoose.model('Group', groupSchema);

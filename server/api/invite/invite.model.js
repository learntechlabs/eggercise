'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema for Invite
var InviteSchema = new Schema({
  email: { type: String, required: true },
  _user: { type: mongoose.Schema.Types.ObjectId, ref:'User', required: false },
  _group: { type: mongoose.Schema.Types.ObjectId, ref:'Group', required: true },
  created_at: Date,
  updated_at: Date
});

module.exports = mongoose.model('Invite', InviteSchema);

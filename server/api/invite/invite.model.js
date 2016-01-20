'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema for Invite
var InviteSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  _invited_user: { type: mongoose.Schema.Types.ObjectId, ref:'User', required: false },
  _group: { type: mongoose.Schema.Types.ObjectId, ref:'Group', required: true },
  status: { type: Boolean, required: false },
  created_at: Date,
  updated_at: Date,
  sent_at: Date
});

module.exports = mongoose.model('Invite', InviteSchema);

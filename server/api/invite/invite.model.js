'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema for Invite
var inviteSchema = new Schema({
  email: { type: String, required: true },
  _user: { type: mongoose.Schema.Types.ObjectId, ref:'User', required: false },
  _group: { type: mongoose.Schema.Types.ObjectId, ref:'Group', required: true },
  created_at: Date,
  updated_at: Date
});

var Invite = mongoose.model('Invite', inviteSchema);

module.exports = mongoose.model('Invite', InviteSchema);

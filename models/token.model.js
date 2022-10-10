const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TokenSchema = new Schema({
  _userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  token: { type: String, required: true },
  expireAt: {
    type: Date,
    default: Date.now,
    expires: 43200, // 12 hours
  },
});

module.exports = mongoose.model("Token", TokenSchema);

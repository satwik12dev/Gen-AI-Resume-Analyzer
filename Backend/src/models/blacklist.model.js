const mongoose = require('mongoose')

const BlacklistTokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: [true, "Token is required to be added to blacklist"]
    }
  },
  {
    timestamps: true   // ✅ correct
  }
)

const tokenBlacklistModel = mongoose.model("token_blacklist", BlacklistTokenSchema)

module.exports = tokenBlacklistModel
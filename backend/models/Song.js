const mongoose = require("mongoose");

const songSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  track: {
    type: String,
    required: true,
  },
  artists: {
    type: mongoose.Types.ObjectId,
    ref: "user",
  },
});

const SongModel = mongoose.model("Song", songSchema);
module.exports = SongModel;

import mongoose from "mongoose";

const { Schema } = mongoose;

// User schema tanımlama
const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    forms: [
      {
        type: Schema.Types.ObjectId,
        ref: "Form",
      },
    ],
  },
  { timestamps: true }
);

// Modeli daha önce tanımlandıysa kullan, yoksa tanımla
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;

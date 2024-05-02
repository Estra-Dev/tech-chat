import { Schema, model } from "mongoose";

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minLength: 5,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    maxLength: 50,
  },
  password: {
    type: String,
    required: true,
    minLength: 5,
  },
  profileImage: {
    type: String,
    default:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR__H-FaeADAspQbggprYkIa8oWFi2yQXs5zCjvV3ZGKA&s",
  },
});

export const User = model("User", userSchema);

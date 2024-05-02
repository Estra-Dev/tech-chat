import { User } from "../model/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";

const salt = 10;

// signup functionality
export const signUp = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (
    !username ||
    !password ||
    !email ||
    username === "" ||
    password === "" ||
    email === ""
  ) {
    return next(errorHandler(400, "all fields are required"));
  }
  if (username.length < 5) {
    return next(
      errorHandler(400, "username should not be less than 5 characters")
    );
  }
  if (password.length < 5) {
    return next(errorHandler(400, "password is too short"));
  }
  if (!password.match(/^(?=.*[A-Z])/)) {
    return next(errorHandler(400, "password must contain Uppercase character"));
  }
  if (!password.match(/^(?=.*[a-z])/)) {
    return next(errorHandler(400, "password must contain lowercase character"));
  }
  if (!password.match(/^(?=.*[0-9])/)) {
    return next(errorHandler(400, "password must contain number character"));
  }
  if (!password.match(/^(?=.*[!"#$%&'()*+,-./:;<=>?@[_`{|}~])/)) {
    return next(
      errorHandler(400, "password must contain at least one special character")
    );
  }
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return next(errorHandler(400, "user already exist"));
    }

    const hashedPassword = await bcryptjs.hash(password, salt);
    const newUser = User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json("register successfully");
    console.log(newUser);
  } catch (error) {
    console.log(error);
  }
};

// login functionality

export const login = async (req, res, next) => {
  try {
  } catch (error) {
    console.log(error);
  }
};

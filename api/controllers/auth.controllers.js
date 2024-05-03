import { User } from "../model/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

const salt = 10;

// signup functionality
export const signUp = async (req, res, next) => {
  const { username, email, password, reenterpassword } = req.body;

  if (
    !username ||
    !password ||
    !email ||
    !reenterpassword ||
    username === "" ||
    password === "" ||
    email === "" ||
    reenterpassword === ""
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
    const existingUserName = await User.findOne({ username });
    const existingEmail = await User.findOne({ email });
    if (existingUserName) {
      return next(errorHandler(400, "user already exist"));
    }
    if (existingEmail) {
      return next(errorHandler(400, "email already use"));
    }

    if (reenterpassword === password) {
      const hashedPassword = await bcryptjs.hash(password, salt);
    }
    const newUser = User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json("registered successfully");
    console.log(newUser);
  } catch (error) {
    console.log(error);
  }
};

// login functionality

export const login = async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password || username === "" || password === "") {
    return next(errorHandler(400, "all fields are required"));
  }

  try {
    const validUser = await User.findOne({ username });

    if (!validUser) {
      return next(errorHandler(400, "this user does not exist"));
    }

    const passOk = await bcryptjs.compare(password, validUser.password);

    if (!passOk) {
      return next(errorHandler(403, "worng credential, check login details"));
    } else {
      const { password, ...rest } = validUser._doc;

      const token = jwt.sign({ id: validUser._id }, process.env.SECRETE);
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json(rest);
      console.log(rest);
    }
  } catch (error) {
    next(error);
  }
};

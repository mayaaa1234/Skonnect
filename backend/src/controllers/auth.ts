import User from "../models/User.ts";
import jwt from "jsonwebtoken";

const signup = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      confirmPassword,
      adminKey = null,
    } = req.body;
    console.log("req.body", req.body);

    let isAdmin = false;
    if (adminKey) {
      if (adminKey !== process.env.ADMIN_KEY) {
        return res
          .status(401)
          .json({ error: "Can't create an admin. Invalid admin key" });
      }
      isAdmin = true;
    }

    const user = new User(username, email, password, confirmPassword, isAdmin);
    await user.signupValidation();

    const token = jwt.sign(
      { id: user.id, email: user.email, isAdmin: user.isAdmin },
      process.env.JWT_SECRET as string,
      {
        expiresIn: process.env.JWT_LIFETIME,
      },
    );

    await user.save(); // to db
    res.status(201).json({
      user: { id: user.id, name: user.username, email: user.email },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    //TODO:  gen jwt

    const user = new User(username, email, password);
    await user.loginValidation();

    const token = jwt.sign(
      { id: user.id, email: user.email, isAdmin: user.isAdmin },
      process.env.JWT_SECRET as string,
      {
        expiresIn: process.env.JWT_LIFETIME,
      },
    );

    res.json({
      user: { id: user.id, username: user.username, email: user.email },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

export { signup, login };

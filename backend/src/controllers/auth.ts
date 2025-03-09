import User from "../models/User.ts";

const signup = async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;
    console.log("req.body", req.body);

    const user = new User(username, email, password, confirmPassword);
    const err = user.validate();
    if (err) {
      throw new Error(err.join(" "));
    }

    await user.save();
    return res.json({});
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    return res.json(req.body);
  } catch (error) {
    console.error(error);
  }
};

export { signup, login };

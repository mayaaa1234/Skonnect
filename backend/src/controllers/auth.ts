import User from "../models/User.ts";

const signup = async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;
    console.log("req.body", req.body);

    const user = new User(username, email, password, confirmPassword);
    await user.validate(); // user input validation
    await user.save();

    res.status(201).json({ user: { id: user.id, name: user.username } });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    res.json(req.body);
  } catch (error) {
    console.error(error);
  }
};

export { signup, login };

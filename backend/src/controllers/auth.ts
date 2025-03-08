const adduser = async (req, res) => {
  return res.send("added user");
};

const auth = async (req, res) => {
  return res.send("hello");
};

export { auth, adduser };

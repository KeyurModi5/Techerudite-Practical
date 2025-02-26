const authService = require("../services/authService");

exports.registerCustomer = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    await authService.registerUser(
      firstName,
      lastName,
      email,
      password,
      "customer"
    );
    res
      .status(201)
      .json({ message: "Customer registered. Check email for verification." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.registerAdmin = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    await authService.registerUser(
      firstName,
      lastName,
      email,
      password,
      "admin"
    );
    res
      .status(201)
      .json({ message: "Admin registered. Check email for verification." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    console.log(req.params.token);
    const message = await authService.verifyEmail(req.params.token);
    res.send(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password, "admin");
    res.json(result);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

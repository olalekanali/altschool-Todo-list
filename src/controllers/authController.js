import bcrypt from "bcrypt";
import User from "../models/User.js";

/**
 * @desc Register user
 * @route POST /auth/register
 */
export const register = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.render("register", { error: "All fields are required" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.render("register", { error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await User.create({ username, password: hashedPassword });

    res.redirect("/auth/login");
  } catch (error) {
    res.render("register", { error: "Server error" });
  }
};

/**
 * @desc Login user
 * @route POST /auth/login
 */
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.render("login", { error: "All fields are required" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.render("login", { error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render("login", { error: "Invalid credentials" });
    }

    // store user in session
    req.session.user = {
      _id: user._id,
      username: user.username,
    };

    res.redirect("/dashboard");
  } catch (error) {
    res.render("login", { error: "Server error" });
  }
};

/**
 * @desc Logout user
 * @route GET /auth/logout
 */
export const logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/auth/login");
  });
};

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import users from "../data/users.js";

const getJwtSecret = () => process.env.JWT_SECRET || "codveda_development_secret";

const getPublicUser = (user) => {
  const { password, ...publicUser } = user;
  return publicUser;
};

const createToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    getJwtSecret(),
    {
      expiresIn: "1d",
    }
  );
};

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      status: "fail",
      message: "Name, email, and password are required",
    });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const existingUser = users.find((user) => user.email === normalizedEmail);

  if (existingUser) {
    return res.status(400).json({
      status: "fail",
      message: "Email is already registered",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    id: Date.now().toString(),
    name: name.trim(),
    email: normalizedEmail,
    password: hashedPassword,
    role: "user",
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);

  res.status(201).json({
    status: "success",
    message: "User registered successfully",
    data: getPublicUser(newUser),
  });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: "fail",
      message: "Email and password are required",
    });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const user = users.find((item) => item.email === normalizedEmail);

  if (!user) {
    return res.status(401).json({
      status: "fail",
      message: "Invalid email or password",
    });
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    return res.status(401).json({
      status: "fail",
      message: "Invalid email or password",
    });
  }

  const token = createToken(user);

  res.json({
    status: "success",
    message: "Login successful",
    token,
    data: getPublicUser(user),
  });
};

export const getCurrentUser = (req, res) => {
  res.json({
    status: "success",
    data: getPublicUser(req.user),
  });
};

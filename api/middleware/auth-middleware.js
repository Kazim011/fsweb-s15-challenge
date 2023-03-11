const UserModel = require("../users/user-model");
const bcrypt = require("bcryptjs");

const payloadCheck = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).json({ message: "username ve şifre gereklidir" });
    } else {
      req.inPassword = await bcrypt.hash(password, 8);
      next();
    }
  } catch (error) {
    next(error);
  }
};

const usernameUnique = async (req, res, next) => {
  try {
    let isExistUser = await UserModel.getByFilter({
      username: req.body.username,
    });
    if (isExistUser) {
      res.status(401).json({ message: "Username alınmış" });
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
};

const passwordCheck = async (req, res, next) => {
  try {
    let user = await UserModel.getByFilter({ username: req.body.username });
    if (!user) {
      res.status(401).json({ message: "Geçersiz kriterler" });
    } else {
      const { password } = req.body;
      let isTruePassword = bcrypt.compareSync(password, user.password);
      if (!isTruePassword) {
        res.status(401).json({ message: "Geçersiz Kriterler" });
      } else {
        req.user = user;
        next();
      }
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  payloadCheck,
  usernameUnique,
  passwordCheck,
};

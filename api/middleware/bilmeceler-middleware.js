const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../secrets/utils");

const checkToken = async (req, res, next) => {
  /*
    EKLEYİN

    1- Authorization headerında geçerli token varsa, sıradakini çağırın.

    2- Authorization headerında token yoksa,
      response body şu mesajı içermelidir: "token gereklidir".

    3- Authorization headerında geçersiz veya timeout olmuş token varsa,
	  response body şu mesajı içermelidir: "token geçersizdir".
  */
  try {
    const token = req.headers.authorization;
    if (token) {
      jwt.verify(token, JWT_SECRET, (err) => {
        if (err) {
          res.status(401).json({ message: "token geçersizdir" });
        } else {
          next();
        }
      });
    } else {
      res.status(401).json({ message: "token gereklidir" });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  checkToken,
};

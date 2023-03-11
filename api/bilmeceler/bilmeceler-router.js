// değişiklik yapmayın
const router = require("express").Router();
const bilmecelerModel = require("./bilmeceler-model");
const mdw = require("../middleware/bilmeceler-middleware");

router.get("/", async (req, res, next) => {
  try {
    const allBilmeceler = await bilmecelerModel.getAll();
    if (!allBilmeceler) {
      res.status(400).json({ message: "Sonuç yok!" });
    } else {
      res.status(200).json(allBilmeceler);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;

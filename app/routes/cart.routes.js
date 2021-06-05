module.exports = (app) => {
  const CartController = require("../controllers/CartController.js");
  var router = require("express").Router();

  router.get("/cart", CartController.get);
  router.post("/addCart", CartController.add);
  router.post("/subtract", CartController.subtract);
  router.post("/remove", CartController.remove);
  router.delete("/deleteProduit/:id", CartController.deleteProduit);

  app.use("/api/cart", router);
};

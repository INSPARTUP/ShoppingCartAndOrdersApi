module.exports = (app) => {
  const CartController = require("../controllers/CartController.js");
  var router = require("express").Router();aa

  router.get("/cart", CartController.get);
  router.post("/addCart", CartController.add);
  router.post("/subtract", CartController.subtract);
  router.post("/remove", CartController.remove);
  router.delete("/deleteProduit", CartController.deleteProduit);

  app.use("/api/cart", router);
};
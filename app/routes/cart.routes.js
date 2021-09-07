module.exports = app => {
    const CartController = require("../controllers/CartController.js");
    var router = require("express").Router();





    router.get('/cart', CartController.get);
    router.post('/addCart', CartController.add);
    router.post('/subtract', CartController.subtract);
    router.post('/remove', CartController.remove);










    app.use("/api/cart", router);
};

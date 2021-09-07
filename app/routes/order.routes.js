module.exports = app => {
    const OrderController = require("../controllers/OrderController.js");
    var router = require("express").Router();




    
    router.get('/', OrderController.list);
    router.post('/create', OrderController.placeOrder);
    router.get('/:orderId', OrderController.get);
    router.param('orderId', OrderController.load);





    app.use("/api/order", router);
};

module.exports = app => {
    const OrderController = require("../controllers/OrderController.js");
    var router = require("express").Router();




      
    router.get('/', OrderController.list);
    router.get('/orders', OrderController.findAll);
    // Retrieve all Orders 
    router.post('/create', OrderController.placeOrder);
   //Retrieve Order
    router.get('/:orderId', OrderController.get);   
    router.param('orderId', OrderController.load);
   //Delete Order
    router.delete("/:id", OrderController.delete);

    router.put("/:id", OrderController.update);
   // Delete all orders  
   router.delete("/", OrderController.deleteAll);
    app.use("/api/order", router);
};

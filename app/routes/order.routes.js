module.exports = app => {
    const OrderController = require("../controllers/OrderController.js");
    var router = require("express").Router();




      
    router.get('/', OrderController.list);
 // Retrieve all Orders 
    router.get('/orders', OrderController.findAll);
 // Create Order
    router.post('/create', OrderController.placeOrder);
 // Retrieve Order by Id
    router.get('/:orderId', OrderController.get);   
    router.param('orderId', OrderController.load);
 // Delete Order
    router.delete("/:id", OrderController.delete);
 // Update Order
    router.put("/:id", OrderController.update);
 // Delete all orders  
    router.delete("/", OrderController.deleteAll);
    app.use("/api/order", router);
};

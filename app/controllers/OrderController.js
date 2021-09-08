const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');



/**
 * Load product and append to req.
 */
exports.load = function (req, res, next, id) {
  Order.get(id)
    .then(order => {
      req.order = order; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(err => {
      const error = new APIError(err.message, httpStatus.NOT_FOUND, true);
      return next(error);
    });
};

exports.get = function (req, res, next) {
  return res.json(req.order);
};







/**
 * Create new order
 * @returns {Order}
 */

 exports.placeOrder = function (req, res, next) {
  console.log(req.body);
  // res.json(req.body);
  console.log(Array.isArray(req.body.items));
  console.log(req.body.items.length);



  if (!(Array.isArray(req.body.items) && req.body.items.length)) {
    const err = new APIError('No order items included', httpStatus.UNPROCESSABLE_ENTITY, true);
    return next(err);
  }



  const orderData = {
    user: req.body.user,
    billingAddress: req.body.billingAddress,
    shippingMethod: req.body.shippingMethod,
    paymentMethod: req.body.paymentMethod,
    phoneNumber: req.body.phoneNumber

  };
  orderData.items = req.body.items.map(item => {
    return {
      productId: item.productId,
      name: item.name,
      price: item.price,
      qty: item.qty
    };
  });
  orderData.grandTotal = req.body.items.reduce((total, item) => {
    return total + item.price * item.qty;
  }, 0);
  // console.log(orderData);
  const order = new Order(orderData);








  order
    .save()
    .then(savedOrder => {



      const allProductPromises = savedOrder.items.map(item => {

        return Product.get(item.productId).then(product => {

          if (product.quantite - item.qty < 0) {
            res.status(500).send({
              message: `la quantite du commande avec identifiant=${id} est inferieur a la quantite demandé!`
            });
            return null;
          } else
            product.quantite = product.quantite - item.qty;
          return product.save();
        });
      });
      Promise.all(allProductPromises)
        .then(data => {
          return Cart.get(savedOrder.user);
        })
        .then(cart => {
          cart.items = [];
          return cart.save();
        })
        .then(data => {
          res.json(savedOrder);
        })
        .catch(err => {
          // console.log(err);
          const error = new APIError(err.message, httpStatus.INTERNAL_SERVER_ERROR, true);
          return next(error);
        });
    })
    .catch(err => {
      // console.log(err);
      const error = new APIError(err.message, httpStatus.INTERNAL_SERVER_ERROR, true);
      return next(error);
    });




};









/**
 * Get order list.
 * @property {number} req.query.skip - Number of orders to be skipped.
 * @property {number} req.query.limit - Limit number of orders to be returned.
 * @returns {Order[]}
 */
/*
exports.list = function (req, res, next) {
  const { email, sort = 'createdAt', limit = 50, skip = 0 } = req.query;
  // console.log(email);
  if (!email) {
    throw new APIError('order email has not been provided!', httpStatus.BAD_REQUEST, true);
  }
  Order.list({ email, sort, limit, skip })
    .then(orders => res.json(orders))
    .catch(e => next(e));
};
*/

/**
 * Get orders by email.
 * @property {string} req.query.email
 * @returns {Cart}
 */
exports.list = function (req, res, next) {
  const { email } = req.query;
  // console.log(email);
  if (!email) {
    const error = new APIError('Invalid request', httpStatus.BAD_REQUEST, true);
    return next(error);
  }
  Order.list({ email })
    .then(Order => res.json(Order))
    .catch(err => {
      const error = new APIError(err.message, httpStatus.INTERNAL_SERVER_ERROR, true);
      return next(error);
    });
};


// Retrieve all Orders from the database.
exports.findAll = (req, res) => {
  const nom = req.query.nom;
  var condition = nom ? { nom: { $regex: new RegExp(nom), $options: "i" } } : {};

  Order.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Une erreur s'est commandee lors de la récupération des commandes."
      });
    });
};


// Delete a Order with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Order.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Impossible de supprimer la commande avec l'identifiant=${id}. Peut-être que le commande n'a pas été trouvé!`
        });
      } else {
        res.send({
          message: "la commande été supprimé avec succès!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Impossible de supprimer la commande avec l'identifiant=" + id
      });
    });
};



// Update a Order by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Les données à mettre à jour ne peuvent pas être vides!"
    });
  }

  const id = req.params.id;

  Order.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Impossible de mettre à jour le commande avec l'identifiant=${id}. Peut-être que commande n'a pas été trouvé!`
        });
      } else res.send({ message: "Le commande a été mis à jour avec succès." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Erreur lors de la mise à jour du commande avec l'ID=" + id
      });
    });
};


// Delete all Orders from the database.
exports.deleteAll = (req, res) => {
  Order.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} commandes a été supprimé avec succès!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Une erreur s'est commandee lors de la suppression de tous les commandes."
      });
    });
};
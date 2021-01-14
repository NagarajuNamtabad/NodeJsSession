const Product = require('../models/product');
const Result = require('../models/result');
const Cart = require('../models/cart');
const Sequelize = require('sequelize');

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
  .then(([rows, fieldData]) => {
    res.render('shop/product-list', {
      prods: rows,
      pageTitle: 'All Products',
      path: '/products'
    });

  })
  .catch(err => console.log(err));
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId).then(([product]) => {
    res.render('shop/product-detail', {
      product: product[0],
      pageTitle: product.title,
      path: '/products'
    });
  }).catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Result.findAll({
    attributes: [
      'examName',
      'studentName',
      'english',
      'maths',
      'physics',
      'chemistry',
      [
        Sequelize.fn(
          'SUM',
          Sequelize.where(Sequelize.col('english'), '+',
                          Sequelize.col('maths'), '+',
                          Sequelize.col('physics'), '+',
                          Sequelize.col('chemistry'))
        ),
        'total_marks',
      ],
    ],
    group: ['examName','studentName', 'english', 'maths', 'physics', 'chemistry'],
  })
  .then(results => {
    console.log(results);
    console.log(results.english);
   // console.log(results.fieldData);
    res.render('shop/index', {
      prods: results,
      pageTitle: 'Shop', 
      path: '/'
    });
  })
  .catch(err => {
    console.log(err);
  });
 /* Result.fetchAll()
  .then(([rows, fieldData]) => {
    console.log(fieldData);
    console.log(rows);
    res.render('shop/index', {
      prods: rows,
      pageTitle: 'Shop', 
      path: '/'
    });

  })
  .catch(err => console.log(err));*/

  
};

exports.getCart = (req, res, next) => {
  Cart.getCart(cart => {
    Product.fetchAll(products => {
      const cartProducts = [];
      for(product of products)
      {
        const cartProductData = cart.products.find(prod => prod.id === product.id);
        if(cart.products.find(prod => prod.id === product.id)){
             cartProducts.push({productData: product, qty: cartProductData.qty});
        }
      }
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: cartProducts
      });
    });
  });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, product => {
    Cart.addProduct(prodId, product.price);
  });
  res.redirect('/cart');
};

exports.postCartDeleteProduct = (req, res, next) => {
   const prodId = req.body.productId;
   Product.findById(prodId, product => {
    Cart.deleteProduct(prodId, product.price);
    res.redirect('/cart');
   });
   
};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};

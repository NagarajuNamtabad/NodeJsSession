const path = require('path');

const express = require('express');
const { body } = require('express-validator/check');

const adminController = require('../controllers/admin');

const isAuth = require('../middleware/is-auth');

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', isAuth, adminController.getAddProduct);

// /admin/products => GET
router.get('/products', isAuth, adminController.getProducts);

// /admin/add-product => POST
router.post(
    '/add-product',
     [
        body('examName')
        .isString()
        .isLength({ min: 3 }),
        body('studentName')
        .isString()
        .isLength({ min: 3 }),
        body('english')
        .isNumeric(),
        body('maths')
        .isNumeric(),
        body('physics')
        .isNumeric(),
        body('chemistry')
        .isNumeric()
     ],
     isAuth,
     adminController.postAddProduct
     );

router.get('/edit-product/:resultId', isAuth, adminController.getEditProduct);

//router.get('/edit-product/:productId', adminController.getEditProduct);

router.post(
    '/edit-product',
    [
        body('examName')
        .isString()
        .isLength({ min: 3 }),
        body('studentName')
        .isString()
        .isLength({ min: 3 }),
        body('english')
        .isNumeric(),
        body('maths')
        .isNumeric(),
        body('physics')
        .isNumeric(),
        body('chemistry')
        .isNumeric()
     ],
     isAuth,
     adminController.postEditProduct
      );

router.delete('/product/:resultId', isAuth, adminController.deleteProduct);

module.exports = router;

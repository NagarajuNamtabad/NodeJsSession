const { validationResult } =require('express-validator/check');

const Product = require('../models/product');
const Result = require('../models/result');
const User = require('../models/user');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    hasError: false,
    errorMessage: null,
    validationErrors: []
  });
};

exports.postAddProduct = (req, res, next) => {

  const examName = req.body.examName;
  const studentName = req.body.studentName;
  const english = req.body.english;
  const maths = req.body.maths;
  const physics =req.body.physics;
  const chemistry =req.body.chemistry;

  const errors = validationResult(req);

  if(!errors.isEmpty()) {
    console.log(errors);
     return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      hasError: true,
      result: {
        examName: examName,
        studentName: studentName,
        english: english,
        maths: maths,
        physics: physics,
        chemistry: chemistry
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }

  Result.create({
    examName: examName,
    studentName: studentName,
    english: english,
    maths: maths,
    physics: physics,
    chemistry: chemistry,
    userId: req.user.id

  }).then(result1 => {
   // console.log(result1);
   console.log('Created Result');
   res.redirect('/');
  }).catch(err => {
   const error = new Error(err);
   error.httpStatusCode = 500;
   return next(error);
  });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const resId = req.params.resultId;
  Result.findByPk(resId)
  .then(result => {
    if(!result){
       return res.redirect('/');
    }
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      result: result,
      hasError: false,
      errorMessage: null,
      validationErrors: []
    });
  })
  .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });
};

/*exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findById(prodId, product => {
    if (!product) {
      return res.redirect('/');
    }
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: product
    });
  });
};*/

exports.postEditProduct = (req, res, next) => {
  const resId = req.body.resultId;
  const updatedExamName = req.body.examName;
  const updatedStudentName = req.body.studentName;
  const updatedEnglish = req.body.english;
  const updatedMaths = req.body.maths;
  const updatedPhysics = req.body.physics;
  const updatedChemistry = req.body.chemistry;

  const errors = validationResult(req);

  if(!errors.isEmpty()) {
     return res.status(422).render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: true,
      hasError: true,
      result: {
        examName: updatedExamName,
        studentName: updatedStudentName,
        english: updatedEnglish,
        maths: updatedMaths,
        physics: updatedPhysics,
        chemistry: updatedChemistry,
        id: resId 
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }

  Result.findByPk(resId)
  .then(result => {
    if(result.userId.toString() !== req.user.id.toString()) {
         return res.redirect('/admin/products');
    }
    result.examName = updatedExamName;
    result.studentName = updatedStudentName;
    result.english = updatedEnglish;
    result.maths = updatedMaths;
    result.physics = updatedPhysics;
    result.chemistry = updatedChemistry;
    return result.save().then(result => {
      console.log('Updated Result');
      res.redirect('/admin/products');
    });
  })
  .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });
};

/*exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  const updatedProduct = new Product(
    prodId,
    updatedTitle,
    updatedImageUrl,
    updatedDesc,
    updatedPrice
  );
  updatedProduct.save();
  res.redirect('/admin/products');
};*/



exports.getProducts = (req, res, next) => {
  Result.findAll({ where: { userId: req.user.id }})
  .then((result1) => {
   console.log(result1);

  for( let result of result1) {

    var marks = [result.english, result.maths, result.physics, result.chemistry];

    console.log("Total Marks##### :"+marks.reduce(addTotal));
    result.totalmarks = marks.reduce(addTotal);
    console.log("Total Marks :"+result.totalmarks);

    function addTotal(total, num) {
         return total + num;
    }

  }
    res.render('admin/products', {
    //  prods: rows,
        prods: result1,
      pageTitle: 'Admin Products', 
      path: '/admin/products'
    });

  })
  .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });
};

/* exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('admin/products', {
     // prods: result,
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  });
};*/

/* exports.postDeleteProduct = (req, res, next) => {
    const resId = req.body.resultId;
    console.log("resId:" +resId);
    //Result.findByPk(resId)
    Result.deleteOne({id: resId, userId: req.user.id})
    .then(() => {
      console.log('Destroyed Result');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
}; */

 exports.postDeleteProduct = (req, res, next) => {
    const resId = req.body.resultId;
    console.log("resId:" +resId);
    //Result.findByPk(resId)
    Result.findByPk(resId)
    .then(result => {
      console.log("result:" +result);
      return result.destroy();
    })
    .then(result => {
      console.log('Destroyed Result');
      res.redirect('/');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
}; 
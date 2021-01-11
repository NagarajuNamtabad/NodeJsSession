const Product = require('../models/product');
const Result = require('../models/result');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {

  const examName = req.body.examName;
  const studentName = req.body.studentName;
  const english = req.body.english;
  const maths = req.body.maths;
  const physics =req.body.physics;
  const chemistry =req.body.chemistry;

  Result.create({
    examName: examName,
    studentName: studentName,
    english: english,
    maths: maths,
    physics: physics,
    chemistry: chemistry

  }).then(result1 => {
   // console.log(result1);
   console.log('Created Result');
   res.redirect('/');
  }).catch(err => {
    console.log(err);
  });
  /*const result = new Result(null, examName, studentName, english, maths, physics, chemistry);
  result.save()
  .then(() => {
    res.redirect('/');
  })
  .catch(err => console.log(err));*/
  /*const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const commands =req.body.commands;
  const product = new Product(null, title, imageUrl, description, price, commands);
  product.save()
  .then(() => {
    res.redirect('/');
  })
  .catch(err => console.log(err));*/
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
      result: result
    });
  })
  .catch(err => console.log(err));
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

  Result.findByPk(resId)
  .then(result => {
    result.examName = updatedExamName;
    result.studentName = updatedStudentName;
    result.english = updatedEnglish;
    result.maths = updatedMaths;
    result.physics = updatedPhysics;
    result.chemistry = updatedChemistry;
    return result.save();
  })
  .then(result => {
    console.log('Updated Result');
    res.redirect('/');
  })
  .catch(err => console.log(err));
  
  
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
  Product.fetchAll(products => {
    res.render('admin/products', {
     // prods: result,
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  });
};

exports.postDeleteProduct = (req, res, next) => {
    const resId = req.body.resultId;
    Result.findByPk(resId)
    .then(result => {
      return result.destroy();
    })
    .then(result => {
      console.log('Destroyed Result');
      res.redirect('/');
    })
    .catch(err => console.log(err));
    
};
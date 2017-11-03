var express = require('express');
var router = express.Router();

var Footballplayer = require('../models/footballplayer');
var Cart = require ('../models/cart.js');
var Order = require('../models/order');

/* GET home page. */
router.get('/', function(req, res, next) {
  var successMsg = req.flash('success')[0];
  Footballplayer.find(function(err, docs){
    var footballplayerArray = [];
    var arraySize = 3;
    for(var i = 0; i < docs.length; i+= arraySize){
      footballplayerArray.push(docs.slice(i, i + arraySize));
    }
    res.render('shop/index', { title: 'Express', footballplayers: footballplayerArray, successMsg: successMsg, noMessages: !successMsg});
  });
});

router.get('/add-to-cart/:id', function(req, res){
  var footballplayerId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  Footballplayer.findById(footballplayerId, function(err, footballplayer){
    if(err){
      return res.redirect('/');
    }
    cart.add(footballplayer, footballplayer.id);
    req.session.cart = cart;
    console.log(req.session.cart);
    res.redirect('/');
  });
});

router.get('/remove/:id', function(req, res, next){
  var footballplayerId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  cart.removeOne(footballplayerId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
});

router.get('/removeitem/:id', function(req, res, next){
  var footballplayerId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  cart.removeAll(footballplayerId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
});

router.get('/shopping-cart', function(req, res, next){
  if(!req.session.cart){
    return res.render('shop/shopping-cart', {footballplayers: null});
  }
  var cart = new Cart(req.session.cart);
  res.render('shop/shopping-cart', {footballplayers: cart.generateArray(), totalPrice: cart.totalPrice});
});

router.get('/checkout', isLogin,function(req, res, next){
  if(!req.session.cart){
    return res.redirect('/shopping-cart');
  }
  var cart = new Cart(req.session.cart);
  var errMsg = req.flash('error')[0];
  res.render('shop/checkout', {total: cart.totalPrice, errMsg: errMsg, noError: !errMsg});
});

router.post('/checkout', function(req, res, next){
   if(!req.session.cart){
    return res.redirect('/shopping-cart');
  }
  var cart = new Cart(req.session.cart);

  var stripe = require("stripe")("sk_test_c1nIRThi10NJ592KBCmgKSoG");

  stripe.charges.create({
    amount: cart.totalPrice * 100,
    currency: "usd",
    source: req.body.stripeToken, // obtained with Stripe.js
    description: "Test Token"
  }, function(err, charge) {
    // asynchronously called
    if(err){
      req.flash('error', err.message);
      return res.redirect('/checkout');
    }
    var order = new Order({
      user: req.user,
      cart: cart,
      address: req.body.address,
      name: req.body.name,
      paymentId: charge.id
    });
    order.save(function(err, result){
      req.flash('success', 'Successful buy them!');
      req.session.cart = null;
      res.redirect('/');
    });
  });
});

module.exports = router;

function isLogin(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.session.oldUrl = req.url;
    res.redirect('/user/signin');
}

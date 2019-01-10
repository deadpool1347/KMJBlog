var express = require('express');
var router = express.Router();
var mysql = require ( 'mysql2' ) ;
var mailgun = require("mailgun-js");
var api_key = '6a232dacbbdc434f21d4e73621d49bde-060550c6-846510c4';
var DOMAIN = 'sandbox271a7fb6dc7141af87ae09f601348477.mailgun.org';
var mailgun = require('mailgun-js')({apiKey: api_key, domain: DOMAIN});


var connection = mysql . createConnection ( {
  host: 'localhost' ,
  user : 'root' ,
  database: 'Blog'
} ) ;



/* GET home page. */
router.get('/', function(req, res, next) {
  connection.query(
    'SELECT * FROM Subject',
    function(err, subjects) {
      var where = '';
      var join = '';
      if (req.query.theme) {
        where += `${!where ? 'where':' and'} idTheme=${req.query.theme}`
      }

      if(req.query.article){
        where += `${!where ? 'where':' and'} name like "%${req.query.article}%"`
      }

      if(req.query.author){
        where += `${!where ? 'where':' and'} login like "%${req.query.author}%"`
        join+= ` inner join User on Article.idUser=User.idUser`
      }

      connection.query(
        `SELECT * FROM Article ${join} ${where}` ,
        function(err, articles) {
          res.render('index', {title: 'KMJ School', articles: articles, query:req.query, subjects: subjects, session: req.session});
        }
      );
    }
  );
});

router.get('/newarticles', function(req, res, next) {
  connection.query(
    'SELECT * FROM Users',
    function(err, users) {
      res.render('newarticle', { title: 'Статья', user: users});
    }
  );
});

router.get('/articles/:id', function(req, res, next) {
  connection.query(
    'SELECT * FROM Article where idArticle='+req.params.id,
    function(err, article) {
      res.render('article', {article: article[0]});
    }
  );
});

router.get('/registration', function(req, res, next) {
  if(Object.keys(req.query).length === 0){
    res.render('registration');
    return;
  }

  var error;

  if(req.query.password1!==req.query.password2){
    error='Пароли не совпадают!';
    res.render('registration', {query: req.query, error: error});
    return;
  }

  connection.query(
    'SELECT * FROM Users where login='+req.query.email,
    function(err, user) {
      if(user){
        error='Такой login уже существует!';
        res.render('registration', {query: req.query, error: error});
        return;
      }
      var key = Math.floor(Math.random() * 1000000000) + 1;
      connection.query(
        'insert into User (login, password, idStatus, keyCode) values("'+req.query.email+'", '+req.query.password1+', 1, '+key+' )',
        function(err, result) {
          console.log(result);
          console.log(err);
          console.log('insert into User (login, password, idStatus) values('+req.query.email+', '+req.query.password1+', 1)');
          var data = {
            from: 'KMJ School <me@samples.mailgun.org>',
            to: req.query.email,
            subject: 'Активация аккаунта',
          };
          var link ='http://localhost:3000/email-activation?link='+key+'&email='+req.query.email;
          res.render('message',{link: link}, function (err, html) {
                if (err) {
                    return next(err);
                }
                data.html = html;
            });
          mailgun.messages().send(data, function (error, body) {
            res.render('registrated', {msg: 'Регистрация прошла успешно. Письмо для подтверждения мы вам отправили на вашу почту.' });

          });
        }
      );
    }
  );
});

router.get('/email-activation', function(req, res, next) {
  console.log(req.query);
  console.log();
  connection.query(
    'SELECT * FROM User where login="'+req.query.email+'"',
    function(err, user) {
      console.log('SELECT * FROM User where login="'+req.query.email+'"');
      if(user.keyCode!=req.query.key){
          res.render('registrated', {msg: 'Ошибка! Не удалось активировать логин.'});
          return;
      }
      connection.query(
        'UPDATE User SET idStatus=2 WHERE login ="'+req.query.email+'"',
        function(err, users) {
          req.session.email=req.query.email;
          res.redirect('/');
        }
      );
    }
  );
});



router.get('/login', function(req, res, next) {
  if(Object.keys(req.query).length === 0){
    res.render('login');
    return;
  }
  var error ;
  connection.query(
    'SELECT * FROM User where login="'+req.query.email+'"',
    function(err, user) {
      console.log(user);
      if(user.length === 0){
        error='Такого пользователя не существует';
        res.render('login',{error: error});
        return;
      }

      console.log(user[0].password);
      console.log(req.query.password);
      if(user[0].password!=req.query.password){
        error='Пароль не верный!';
        res.render('login',{error: error});
        return;
      }
      req.session.email=req.query.email;
      res.redirect('/');
    }
  );
});

router.get('/user', function(req, res, next) {
  connection.query(
    'SELECT * FROM User',
    function(err, users) {
      res.render('user', {user: users});
    }
  );
});

router.post('/filter', function(req, res, next) {
  connection.query(
    'SELECT * FROM Theme where idSubject = ' + req.body.subject,
    function(err, themes) {
      res.send({themes: themes});
    }
  );
});



module.exports = router;

var express = require('express');
var router = express.Router();
var mysql = require ( 'mysql2' ) ;
var mailgun = require("mailgun-js");
var api_key = 'key-2f09c76695a377a13554a4f01e97d874';
var DOMAIN = 'mg.kazakovmj.ru';
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
    'SELECT * FROM Subject',
    function(err, subjects) {
      if(Object.keys(req.query).length === 0){
        res.render('newarticle',{subjects: subjects, query: req.query});
        return;
      }

      var error;

      if(!req.query.theme || !req.query.name || !req.query.content){
        error='Заполните все поля!';
        res.render('newarticle', {query: req.query, error: error, subjects: subjects});
        return;
      }
      connection.query(
        'INSERT INTO `Article`( `name`, `content`, `idUser`, `idTheme`) VALUES ("'+req.query.name+'","'+req.query.content+'",'+req.session.idUser+','+req.query.theme+')',
        function(err) {
          res.redirect('/');
        }
      );
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
  connection.query(
    'SELECT * FROM User where login="'+req.query.email+'"',
    function(err, user) {
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
      if(user.length === 0){
        error='Такого пользователя не существует';
        res.render('login',{error: error});
        return;
      }

      if(user[0].password!=req.query.password){
        error='Пароль не верный!';
        res.render('login',{error: error});
        return;
      }
      req.session.email=req.query.email;
      req.session.idUser=user[0].idUser;
      if(user[0].idStatus==3)
        req.session.idStatus=user[0].idStatus;
      res.redirect('/');
    }
  );
});

router.get('/logout', function(req, res, next) {
      delete req.session.email;
      delete req.session.idUser;

      res.redirect('back');
});

router.get('/user', function(req, res, next) {
  if(!req.session.email){
    res.redirect('/login');
  }
  connection.query(
    'SELECT * FROM UserInfo where idUser='+req.session.idUser,
    function(err, user) {

      if (req.query && req.query.password1){
        if(req.query.password1!==req.query.password2){
          var error='Пароли не совпадают!';
          res.render('/user', {user: user && user[0], error: error});
          return;
        }
        connection.query(
          'UPDATE `User` SET `password`="'+req.query.password1+'" WHERE idUser='+req.session.idUser,
          function(err) {
            res.render('user', {user: user && user[0]});
          }
        );
        return;
      }

      if(Object.keys(req.query).length === 0){
        res.render('user', {user: user && user[0]});
        return;
      }

      if(user && user.length==0){
        connection.query(
          'INSERT INTO `UserInfo`(`idUser`, `name`, `vk`, `facebook`) VALUES ('+req.session.idUser+',"'+req.query.nickname+'","'+req.query.urlVK+'","'+req.query.urlFacebook+'")',
          function(err, user) {

            res.render('user', {user: user});
          }
        );
        return;
      }
      connection.query(
        'UPDATE `UserInfo` SET `name`="'+req.query.nickname+'",`vk`="'+req.query.urlVK+'",`facebook`="'+req.query.urlFacebook+'" WHERE idUser='+req.session.idUser,
        function(err) {
          connection.query(
            'SELECT * FROM UserInfo where idUser='+req.session.idUser,
            function(err, user) {
              res.render('user', {user: user[0]});
            }
          );
        }
      );
    }
  );
});

router.get('/password', function(req, res, next) {
  if(Object.keys(req.query).length === 0){
    res.render('password');
    return;
  }
console.log(req.query.email);
  connection.query(
    'SELECT * FROM User where login="'+req.query.email+'"',
    function(err, user) {
      var data = {
        from: 'KMJ School <me@samples.mailgun.org>',
        to: req.query.email,
        subject: 'Восстановление пароля',
      };
      console.log(user);
      var link ='http://localhost:3000/email-recovery?link='+user[0].key+'&email='+req.query.email;
      res.render('recovery',{link: link}, function (err, html) {
            if (err) {
                return next(err);
            }
            data.html = html;
        });
      mailgun.messages().send(data, function (error, body) {
          res.render('registrated', {msg: 'Восстановление пароля прошло успешно. Письмо для воостановления мы вам отправили на вашу почту.' });

      });
    }
  );
});

router.get('/email-recovery', function(req, res, next) {
  connection.query(
    'SELECT * FROM User where login="'+req.query.email+'"',
    function(err, user) {
      if(user.keyCode!=req.query.key){
          res.render('registrated', {msg: 'Ошибка! Не удалось восстановить праоль.'});
          return;
      }
      req.session.email=req.query.email;
      req.session.idUser=user[0].idUser;
      if(user[0].idStatus==3)
        req.session.idStatus=user[0].idStatus;
      res.redirect('/user');
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

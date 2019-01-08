var express = require('express');
var router = express.Router();
var mysql = require ( 'mysql2' ) ;

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
      res.render('index', { title: 'KMJ School', subjects: subjects});
    }
  );
});

router.get('/article', function(req, res, next) {
  connection.query(
    'SELECT * FROM Users',
    function(err, users) {
      res.render('article', { title: 'Статья', user: users});
    }
  );
});

router.get('/login', function(req, res, next) {
  connection.query(
    'SELECT * FROM Users',
    function(err, users) {
      res.render('login', { title: 'Авторизация'});
    }
  );
});

router.get('/user', function(req, res, next) {
  connection.query(
    'SELECT * FROM Users',
    function(err, users) {
      res.render('user', { title: 'Пользователь',user: users});
    }
  );
});

router.post('/filter', function(req, res, next) {

  console.log(req.body);
  connection.query(
    'SELECT * FROM Theme where idSubject = ' + req.body.subject,
    function(err, themes) {
      res.send({themes: themes});
    }
  );
});


module.exports = router;

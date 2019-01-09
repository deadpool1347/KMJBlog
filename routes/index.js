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
          res.render('index', {title: 'KMJ School', articles: articles, query:req.query, subjects: subjects});
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
  connection.query(
    'SELECT * FROM Users',
    function(err, articles) {
      res.render('registration', { title: 'Регистрация', articles: articles});
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
  connection.query(
    'SELECT * FROM Theme where idSubject = ' + req.body.subject,
    function(err, themes) {
      res.send({themes: themes});
    }
  );
});



module.exports = router;

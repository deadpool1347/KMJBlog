var express = require('express');
var router = express.Router();
var path = require('path');
var mysql = require ( 'mysql2' ) ;
var api_key = 'key-2f09c76695a377a13554a4f01e97d874';
var DOMAIN = 'mg.kazakovmj.ru';
var mailgun = require('mailgun-js')({apiKey: api_key, domain: DOMAIN});
var multer  = require('multer')



var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/images'))
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now()+'.jpg')
  }
})
var upload = multer({ dest: 'uploads/', storage: storage })


var connection = mysql . createConnection ( {
  host: 'localhost' ,
  user : 'root' ,
  database: 'Blog'
} ) ;



/* GET home page. */
router.get('/', function(req, res, next) {

  req.session.email='fuurria@yandex.ru';
  req.session.idUser=20;
  req.session.idStatus=3;

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

      console.log(`SELECT COUNT(Article.idArticle) as count FROM Article  ${join} ${where}`);



      connection.query(
        `SELECT COUNT(Article.idArticle) as count FROM Article  ${join} ${where}`,
        function(err, count) {

          console.log(count);
          var limit = 3;
          var pageNumber = Math.ceil(count[0].count/limit);
          var pages = [];
          for(var i=0; i<pageNumber; i++)
            pages.push(i+1);
          var offset = limit * (req.query.activePage ? req.query.activePage-1 : 0);

          var pagi = {
            pages:pages,
            activePage: req.query.activePage||1
          }
          join+=` left join ArticleLike on ArticleLike.idArticle=Article.idArticle`;

          connection.query(
            `SELECT Article.idArticle, name, content, Article.date, img,
            sum(case when likes=1 then 1 end) as likes,
            sum(case when likes=0 then 1 end) as dislikes
            FROM Article ${join} ${where}
            GROUP by Article.idArticle
            limit ${limit}
            offset ${offset}` ,
            function(err, articles) {
              var newArticlas = articles.map(article => {
                return { ...article, content: article.content.slice(0, 400)+'...' }
              })

              if(req.query.subject){
                connection.query(
                  'SELECT * FROM Theme where idSubject = ' + req.query.subject,
                  function(err, themes) {

                    res.render('index', {title: 'KMJ School',pagi: pagi, articles: newArticlas, query:req.query, subjects: subjects, session: req.session, themes: themes});
                  }
                );
                return;
              }

              res.render('index', {title: 'KMJ School',pagi: pagi, articles: newArticlas, query:req.query, subjects: subjects, session: req.session});
            }
          );
        }
      );
    }
  );
});

router.post('/like', function(req, res, next) {
  connection.query(
    'SELECT * FROM ArticleLike where idUser = ' + req.session.idUser+' and idArticle='+req.body.idArticle,
    function(err, like) {


      if(like[0]){

        if(like[0].like==req.body.like){
            res.send({Status: 0});
        }
        else {
          connection.query(
            'UPDATE ArticleLike SET likes='+req.body.like+' WHERE idArticleLike=' + like[0].idArticleLike,
            function(err, themes) {
              res.send({Status: 2});
            }
          );
        }
          return;
      }

      connection.query(
        'INSERT INTO ArticleLike(idArticle, likes, idUser) VALUES ('+req.body.idArticle+','+req.body.like+','+req.session.idUser+')',
        function(err, themes) {
          res.send({Status: 1});
        }
      );

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

router.get('/newarticles/:id', function(req, res, next) {
  connection.query(
    'SELECT * FROM Subject',
    function(err, subjects) {
      connection.query(
        'SELECT * FROM Tag',
        function(err, tags) {
          if(req.params.id !== '0'){
            connection.query(
              `SELECT Article.idArticle, Article.name, content, Article.date, Article.img, idSubject, Article.idTheme  FROM Article
inner join Theme on Theme.idTheme=Article.idTheme
where idArticle=`+req.params.id,
              function(err, article) {
                connection.query(
                  'SELECT * FROM TagArticle where idArticle = ' + article[0].idArticle,
                  function(err, tagArticle) {
                    var newtags = tagArticle.map(tag =>{
                      return tag.idTag
                    })
                    connection.query(
                      'SELECT * FROM Theme where idSubject = ' + article[0].idSubject,
                      function(err, themes) {
                        res.render('newarticle',{title: 'Редактирование статьи', subjects: subjects, query: { ...article[0], tags: newtags }, tags: tags, themes: themes});
                      }
                    );
                  }
                );
              }
            );
            return;
          }

          res.render('newarticle',{title: 'Добавление статьи', subjects: subjects, query: req.query, tags: tags});
        }
      );
    }
  );
});

router.post('/newarticles/:id', upload.single('img'), function(req, res, next) {

  if(req.params.id!=='0'){
    connection.query(
      'UPDATE Article SET name="'+req.body.name+'", content="'+req.body.content+'",idTheme='+req.body.idTheme+', img="'+req.body.img+'" WHERE idArticle=' + req.params.id,
      function(err, themes) {
        res.redirect('/');
      }
    );
    return;
  }



  connection.query(
    'SELECT * FROM Subject',
    function(err, subjects) {
      connection.query(
        'SELECT * FROM Tag',
        function(err, tags) {
          if(Object.keys(req.body).length === 0){
            res.render('newarticle',{subjects: subjects, query: req.body, tags: tags});
            return;
          }

          var error;


          if(req.body.idTheme && (!req.body.name || !req.body.content)){
            connection.query(
              'SELECT * FROM Theme where idSubject = ' + req.body.idSubject,
              function(err, themes) {
                error='Заполните все поля!';
                res.render('newarticle', {query: req.body, error: error, subjects: subjects, tags: tags, themes: themes});
              }
            );
            return;
          }

          if(!req.body.idTheme || !req.body.name || !req.body.content){
            error='Заполните все поля!';
            res.render('newarticle', {query: req.body, error: error, subjects: subjects, tags: tags});
            return;
          }

          connection.query(
            'INSERT INTO `Article`( `name`, `content`, `idUser`, `idTheme`, `img`) VALUES ("'+req.body.name+'","'+req.body.content+'",'+req.session.idUser+','+req.body.idTheme+', "'+(req.file ? req.file.filename : '')+'")',
            function(err, article) {
              var mas;
              if(typeof req.body.tags=='object'){
                 mas=req.body.tags.map(tag => {
                  return [tag, article.insertId]
                });
              }
              else{
                mas=[[req.body.tags, article.insertId]];
              }
              connection.query(
                'INSERT INTO `TagArticle`(`idTag`, `idArticle`) VALUES ?',[mas],
                function(err, tags) {
                  res.redirect('/');
                }
              );
            }
          );
        }
      );
    }
  );
});

router.get('/articles/:id', function(req, res, next) {
  connection.query(
    `SELECT Article.idArticle, Article.name, content, Article.date, Article.img, User.login, Theme.name as themeName, Subject.name as subjectName FROM Article
inner join User on User.idUser=Article.idUser
inner join Theme on Theme.idTheme=Article.idTheme
inner join Subject on Theme.idSubject=Subject.idSubject
where idArticle=`+req.params.id,
    function(err, article) {

      connection.query(
        `SELECT name FROM TagArticle
        inner join Tag on TagArticle.idTag=Tag.idTag
        where TagArticle.idArticle=`+req.params.id,
        function(err, tags) {

          if(req.query.comment){
            connection.query(
              'INSERT INTO Comment(content, idArticle, idUser) VALUES ("'+req.query.comment+'", '+req.params.id+','+req.session.idUser+')',
              function(err) {
                connection.query(
                  `SELECT content, Comment.date, User.login FROM Comment
                  inner join User on User.idUser=Comment.idUser
                  WHERE idArticle=`+req.params.id,
                  function(err, comments) {
                    res.render('article', {article: article[0], tags: tags, comments: comments});
                  }
                );
              }
            );
            return;
          }



          connection.query(
            `SELECT content, Comment.date, User.login FROM Comment
            inner join User on User.idUser=Comment.idUser
            WHERE idArticle=`+req.params.id,
            function(err, comments) {
              res.render('article', {article: article[0], tags: tags, comments: comments});
            }
          );

        }
      );


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

  connection.query(
    'SELECT * FROM User where login="'+req.query.email+'"',
    function(err, user) {
      var data = {
        from: 'KMJ School <me@samples.mailgun.org>',
        to: req.query.email,
        subject: 'Восстановление пароля',
      };
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





module.exports = router;

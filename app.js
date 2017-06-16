const express = require('express');

const app = express();
const app_env = app.get('env');
const path = require('path');

app.set('view engine', 'ejs');


app.get('/', (req, res) => res.render('about'));

app.get('/js/jquery.json-viewer.js', (req,res) => res.sendFile(path.join(__dirname, '/views/js', 'jquery.json-viewer.js')));
app.get('/js/jquery.csv.min.js', (req,res) => res.sendFile(path.join(__dirname, '/views/js', 'jquery.csv.min.js')));


app.get('/news', (req,res) => with_tag(req,res,'article=news','https://theodi.org/news'));
app.get('/news.:ext', (req,res) => with_tag(req,res,'article=news','https://theodi.org/news'));
app.get('/blog', (req,res) => with_tag(req,res,'article=blog','https://theodi.org/blog'));
app.get('/blog.:ext', (req,res) => with_tag(req,res,'article=blog','https://theodi.org/blog'));
app.get('/team', (req,res) => with_tag(req,res,'person=team','https://theodi.org/team'));
app.get('/team.:ext', (req,res) => with_tag(req,res,'person=team','https://theodi.org/team'));
app.get('/courses', (req,res) => with_tag(req,res,'type=course','https://theodi.org/courses'));
app.get('/courses/instances', (req,res) => with_tag(req,res,'type=course_instance','https://theodi.org/courses'));
app.get('/events', (req,res) => with_tag(req,res,'type=events','https://theodi.org/events'));
app.get('/events.:ext', (req,res) => with_tag(req,res,'type=events','https://theodi.org/events'));
app.get('/publications', (req, res) => res.render('publications'));
app.get('/publications/:type', (req,res) => with_type(req,res,'https://theodi.org/publications'));
app.get('/publications/:type.:ext', (req,res) => with_type(req,res,'https://theodi.org/publications'));
app.get('/tags', (req, res) => res.render('tags'));
app.get('/tags/:tag', (req,res) => with_keyword(req,res,'https://theodi.org/tags/'));
app.get('/tags/:tag.:ext', (req,res) => with_keyword(req,res,'https://theodi.org/tags/'));

async function with_tag(req,res,arg,site) {
  if (req.params.ext == "json") {
    res.redirect(302,'https://contentapi.theodi.org/with_tag.json?' + arg);
  } else if (req.params.ext == "csv") {
    res.redirect(302,'https://contentapi.theodi.org/with_tag.csv?' + arg);
  } else if (req.accepts("text/html") && !req.params.ext) {
    res.render('index', {
      url: "https://contentapi.theodi.org/with_tag.json?" + arg, 
      csvurl: "https://contentapi.theodi.org/with_tag.csv?" + arg,
      path: req.url
    });
  } else if (req.accepts("application/json") || req.params.ext == "json") {
    res.redirect(302,'https://contentapi.theodi.org/with_tag.json?' + arg);
  } else if (req.accepts("text/csv") || req.params.ext == "csv") {
    res.redirect(302,'https://contentapi.theodi.org/with_tag.csv?' + arg);
  } else {
    res.render('index', {url: "https://contentapi.theodi.org/with_tag.json?" + arg, path: req.url});
  }
}
async function with_type(req,res,site) {
  var parts = (req.params.type).split(".");
  var arg='article=' + parts[0];
  req.params.ext = parts[1];
  with_tag(req,res,arg,site);
}
async function with_keyword(req,res,site) {
  var parts = (req.params.tag).split(".");
  var arg='article=' + parts[0];
  req.params.ext = parts[1];
  var keyword = parts[0];
  var arg='keyword=' + parts[0];
  with_tag(req,res,arg,site);
}

console.log("Available endpoints are " + app._router.stack.filter(r => r.route).map(r => r.route.path).join(', '));

////////////////////////////////////////////
// catch 404 and forward to error handler
app.use((req, res, next) => {
  res.status(404);
  res.render('error', {
    msg: 'Not Found',
    status: '404',
    path: req.url
  });
});

/////////////////////////////////////////////
// error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    msg: err.message,
    status: err.status || 500,
    path: req.url
  });
});

module.exports = app;

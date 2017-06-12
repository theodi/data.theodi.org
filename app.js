const express = require('express');

const app = express();
const app_env = app.get('env');

app.get('/', (req, res) => showGuide(req,res));
app.get('/news', (req,res) => with_tag(req,res,'article=news','https://theodi.org/news'));
app.get('/news.:ext', (req,res) => with_tag(req,res,'article=news','https://theodi.org/news'));
app.get('/blog', (req,res) => with_tag(req,res,'article=blog','https://theodi.org/blog'));
app.get('/blog.:ext', (req,res) => with_tag(req,res,'article=blog','https://theodi.org/blog'));
app.get('/team', (req,res) => with_tag(req,res,'person=team','https://theodi.org/team'));
app.get('/team.:ext', (req,res) => with_tag(req,res,'person=team','https://theodi.org/team'));
app.get('/events', (req,res) => with_tag(req,res,'type=events','https://theodi.org/events'));
app.get('/events.:ext', (req,res) => with_tag(req,res,'type=events','https://theodi.org/events'));
app.get('/publications/:type', (req,res) => with_type(req,res,'https://theodi.org/publications'));
app.get('/publications/:type.:ext', (req,res) => with_type(req,res,'https://theodi.org/publications'));
app.get('/tags/:tag', (req,res) => with_keyword(req,res,'https://theodi.org/tags/'));
app.get('/tags/:tag.:ext', (req,res) => with_keyword(req,res,'https://theodi.org/tags/'));

function showGuide(req,res) {
  res.send("Available endpoints are <br/>" + app._router.stack.filter(r => r.route).map(r => r.route.path).join('<br/>'));
}

async function with_tag(req,res,arg,site) {
  if (req.params.ext == "json") {
    res.redirect(302,'https://contentapi.theodi.org/with_tag.json?' + arg);
  } else if (req.params.ext == "csv") {
    res.redirect(302,'https://contentapi.theodi.org/with_tag.csv?' + arg);
  } else if (req.accepts("text/html") && !req.params.ext) {
    res.redirect(302,site);
  } else if (req.accepts("application/json") || req.params.ext == "json") {
    res.redirect(302,'https://contentapi.theodi.org/with_tag.json?' + arg);
  } else if (req.accepts("text/csv") || req.params.ext == "csv") {
    res.redirect(302,'https://contentapi.theodi.org/with_tag.csv?' + arg);
  } else {
    res.redirect(302,site);
  }
}
async function with_type(req,res,site) {
  var parts = (req.params.type).split(".");
  var arg='article=' + parts[0];
  req.params.ext = parts[1];
  if (req.params.ext == "json") {
    res.redirect(302,'https://contentapi.theodi.org/with_tag.json?' + arg);
  } else if (req.params.ext == "csv") {
    res.redirect(302,'https://contentapi.theodi.org/with_tag.csv?' + arg);
  } else if (req.accepts("text/html") && !req.params.ext) {
    res.redirect(302,site);
  } else if (req.accepts("application/json") || req.params.ext == "json") {
    res.redirect(302,'https://contentapi.theodi.org/with_tag.json?' + arg);
  } else if (req.accepts("text/csv") || req.params.ext == "csv") {
    res.redirect(302,'https://contentapi.theodi.org/with_tag.csv?' + arg);
  } else {
    res.redirect(302,site);
  }
}
async function with_keyword(req,res,site) {
  var parts = (req.params.tag).split(".");
  var arg='article=' + parts[0];
  req.params.ext = parts[1];
  var keyword = parts[0];
  var arg='keyword=' + parts[0];
  if (req.params.ext == "json") {
    res.redirect(302,'https://contentapi.theodi.org/with_tag.json?' + arg);
  } else if (req.params.ext == "csv") {
    res.redirect(302,'https://contentapi.theodi.org/with_tag.csv?' + arg);
  } else if (req.accepts("text/html") && !req.params.ext) {
    res.redirect(302,site + keyword);
  } else if (req.accepts("application/json") || req.params.ext == "json") {
    res.redirect(302,'https://contentapi.theodi.org/with_tag.json?' + arg);
  } else if (req.accepts("text/csv") || req.params.ext == "csv") {
    res.redirect(302,'https://contentapi.theodi.org/with_tag.csv?' + arg);
  } else {
    res.redirect(302,site + keyword);
  }

}

console.log("Available endpoints are " + app._router.stack.filter(r => r.route).map(r => r.route.path).join(', '));

////////////////////////////////////////////
// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/////////////////////////////////////////////
// error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
  console.log(err);
});

function find_mongo_url(mongo_config) {
  if (process.env.MONGODB_URI) {
    console.log("Using MONGODB_URI environment variable");
    return process.env.MONGODB_URI;
  } // find_mongo_url

  const hostname = mongo_config.hostname;
  const port = mongo_config.port;
  const database = mongo_config.database;
  return `${hostname}:${port}/${database}`;
} // find_mongo_url

module.exports = app;

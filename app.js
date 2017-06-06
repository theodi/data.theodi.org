const express = require('express');

const app = express();
const app_env = app.get('env');

app.get('/', (req, res) => res.send('Hello World'));
app.get('/hello.json', (req, res) => res.json({ greeting: 'Hello World' }));

app.get('/news', function(req, res) {
  if (req.accepts("text/html")) {
    res.redirect(302,'https://theodi.org/news');
  } else if (req.accepts("application/json")) {
    res.redirect(302,'https://contentapi.theodi.org/with_tag.json?article=news');
  } else if (req.accepts("text/csv")) {
    res.redirect(302,'https://contentapi.theodi.org/with_tag.csv?article=news');
  } else {
    res.redirect(302,'https://theodi.org/news');
  }
});
app.get('/news.:ext', function(req,res) {
  if (req.params.ext == "json") {
    res.redirect(302,'https://contentapi.theodi.org/with_tag.json?article=news');
  } else if (req.params.ext == "csv") {
    res.redirect(302,'https://contentapi.theodi.org/with_tag.csv?article=news');
  } else {
    res.redirect(302,'https://theodi.org/news');
  }
});
/*
app.get('/search.json', legacy_proxy('/search.json'));
app.get('/tags.:ext', tags(db, url_helper));
app.get('/tag_types.:ext', tag_types(db, url_helper));
app.get('/tags/:tag_type_or_id.:ext', tags_type_or_id(db, url_helper));
app.get('/tags/:tag_type/:tag_id.:ext', tags_type_and_id(db, url_helper));
app.get('/with_tag.:ext', with_tag(db, url_helper));
app.get('/latest.:ext', latest(db, url_helper));
app.get('/upcoming.json', legacy_proxy());
app.get('/course-instance.:ext', course_instance(db, url_helper));
app.get('/lecture-list.:ext', lecture_list(db, url_helper));
app.get('/section.:ext', section(db, url_helper));
app.get('/related.json', legacy_proxy());
app.get('/artefacts.json', legacy_proxy());
app.get('/:artefactSlug.:ext', artefact(db, url_helper));
app.get('/:artefactSlug/image', artefact_image(db));
*/

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
  if (!test_mode)
    console.log(err);
});

//////////////////////////////////////////////
function open_mongo(mongo_config) {
  const mongo_url = find_mongo_url(mongo_config);
  const db = monk(mongo_url);

  if (!test_mode)
    console.log(`Connected to mongo at ${mongo_url}`);

  return db;
} // open_mongo

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

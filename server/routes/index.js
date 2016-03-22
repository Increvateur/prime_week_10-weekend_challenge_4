var express = require("express");
var router = express.Router();
var path = require("path");
var pg = require("pg");

var connectionString = '';

if (process.env.DATABASE_URL !== undefined) {
    connectionString = process.env.DATABASE_URL + 'ssl';
} else {
    connectionString = 'postgres://localhost:5432/weekend_challenge_4';
}

router.post('/tasks', function(req, res) {
  pg.connect(connectionString, function(err, client, done) {
    if (err) {
      console.log('Error connecting to the database:', err);
      res.status(500).send(err);
      done();
      return;
    }

    var query = client.query('INSERT INTO todo_list (task) VALUES ($1)' +
                             'RETURNING id, task, completed',
                             [req.body.task]);

    var result = [];

    query.on('row', function(row) {
      result.push(row);
    });

    query.on('end', function() {
      res.send(result);
      done();
    });

    query.on('error', function(error) {
      console.log('Error querying the database:', error);
      res.status(500).send(error);
      done();
    });
  });
});

router.get('/tasks', function(req, res) {
  pg.connect(connectionString, function(err, client, done) {
    if (err) {
      console.log('Error connecting to the database:', err);
      res.status(500).send(err);
      done();
      return;
    }

    var start = client.query('CREATE TABLE IF NOT EXISTS todo_list' +
    '(id SERIAL NOT NULL, task character varying(255) NOT NULL,' +
    'completed boolean DEFAULT false NOT NULL,' +
    'CONSTRAINT todo_list_pkey PRIMARY KEY (id))');

    var query = client.query('SELECT * FROM todo_list');

    var result = [];

    query.on('row', function(row) {
      result.push(row);
    });

    query.on('end', function() {
      res.send(result);
      done();
    });

    query.on('error', function(error) {
      console.log('Error querying the database:', error);
      res.status(500).send(error);
      done();
    });
  });
});

router.delete('/tasks', function(req, res) {
  pg.connect(connectionString, function(err, client, done) {
    if (err) {
      console.log('Error connecting to the database:', err);
      res.status(500).send(err);
      done();
      return;
    }

    var query = client.query('DELETE FROM todo_list WHERE id=($1)', [req.body.id]);

    var result = [];

    query.on('row', function(row) {
      result.push(row);
    });

    query.on('end', function() {
      res.send(result);
      done();
    });

    query.on('error', function(error) {
      console.log('Error querying the database:', error);
      res.status(500).send(error);
      done();
    });
  });
});

router.put('/tasks', function(req, res) {
  pg.connect(connectionString, function(err, client, done) {
    if (err) {
      console.log('Error connecting to the database:', err);
      res.status(500).send(err);
      done();
      return;
    }

    var query = client.query('UPDATE todo_list SET completed = ($2) WHERE id = ($1)', [req.body.id, req.body.state]);

    var result = [];

    query.on('row', function(row) {
      result.push(row);
    });

    query.on('end', function() {
      res.send(result);
      done();
    });

    query.on('error', function(error) {
      console.log('Error querying the database:', error);
      res.status(500).send(error);
      done();
    });
  });
});

router.get("/*", function(req,res){
  var file = req.params[0] || "/views/index.html";
  res.sendFile(path.join(__dirname, "../public/", file));
});

module.exports = router;

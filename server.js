
var port = process.env.PORT || 3000;


var express = require('express'), bodyParser = require('body-parser');;
var app = express();

app.use(bodyParser.json());


var mongodb = require('./dbmongo');
var mongoconf = require("./mongoconf").configuration();


app.all('/*', function(req, res, next) {
    // CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    // Set custom headers for CORS
    res.setHeader('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key,enctype,Pragma,Cache-Control,If-Modified-Since');
    res.setHeader('Access-Control-Allow-Credentials', true);
    //res.header('Access-Control-Allow-Headers', 'X-Requested-With');

    if (req.method == 'OPTIONS') {
      res.status(200).end();
    } else {
      next();
    }
  });



/**
*	Method that returns all the holes in the system
*	
*/
app.get('/api/v1/holes', function(req, res){
  
  	var db=mongodb.get();
    var collection = db.collection("holes");

    
    collection.find( ).sort({indicator: -1}).toArray(function(err, items) {
        if(err){
            res.json({
              "status": "error",
              "message": err
            });
            return;
        }else{

            

            
            res.json(items);
       
            
            
        }
    });
       



    


});




/**
* Method that returns all the holes's routes in the system
*/
app.get('/api/v1/holes/:id/routes', function(req, res){
  
    var id=req.params.id;
    var db=mongodb.get();
    var collection = db.collection("holesroutes");
    var resultado=collection.find({"hole_id": id});
    
    
    resultado.toArray(function (err, items) {
      if(err){
        res.json({
          "status": "error",
          "message": err
        });
        return;
      }else{
        res.json(items);
        
        return;
      }
    });


});


/**
*	Method that returns all the alerts in the system
*/
app.get('/api/v1/alerts', function(req, res){
  
  	var db=mongodb.get();
    var collection = db.collection("alerts");
    var resultado=collection.find();
    
    
    resultado.toArray(function (err, items) {
      if(err){
        res.json({
          "status": "error",
          "message": err
        });
        return;
      }else{
        res.json(items);
        
        return;
      }
    });


});


/**
* Method that returns all the jams polygons in the system
*/
app.get('/api/v1/jams', function(req, res){
  
    var db=mongodb.get();
    var collection = db.collection("jams");
    var resultado=collection.find();
    
    
    resultado.toArray(function (err, items) {
      if(err){
        res.json({
          "status": "error",
          "message": err
        });
        return;
      }else{
        res.json(items);
        
        return;
      }
    });


});

/**
*Method that returns all the alerts in the system
*/
app.get('/api/v1/alerts/:id', function(req, res){
  
  var id=req.params.id;

  var mongo = require('mongodb');
  var o_id = new mongo.ObjectID(id);  
  
  var db=mongodb.get();
  var collection = db.collection("alerts");
  var resultado=collection.find({"_id": o_id});
    
    
  	resultado.toArray(function (err, items) {
	  if(err){
	    res.json({
	      "status": "error",
	      "message": err
	    });
	    return;
	  }else{
	    res.json(items);
	    
	    return;
	  }
	});


});


/*
* Method that returns the shapes in the system
*/
app.post('/api/v1/shapes', function(req, res){
  
  var db=mongodb.get();
  var collection = db.collection('shapes');
    collection.insert(req.body, {w:1}, function(err, result) {
      if(err) {
        res.json({
          "status": "error",
          "message": err
        });
        return;
      } else {
        res.json({
          "status": "success",
          "message": "inserted"
        });

      }
    });


});


/**
* Method that returns the routes in the system
*/
app.get('/api/v1/routes', function(req, res){
  
  
  	var db=mongodb.get();
    var collection = db.collection("routes");
    var resultado=collection.find();
    
    
    resultado.toArray(function (err, items) {
      if(err){
        res.json({
          "status": "error",
          "message": err
        });
        return;
      }else{
        res.json(items);
        
        return;
      }
    });
  


});

/**
* Method that returns a route by id
*/
app.get('/api/v1/routes/:id', function(req, res){
  
  var id=req.params.id;

  var mongo = require('mongodb');
  var o_id = new mongo.ObjectID(id);  
  
  var db=mongodb.get();
  var collection = db.collection("routes");
  var resultado=collection.find({"_id": o_id});
    
    
    resultado.toArray(function (err, items) {
    if(err){
      res.json({
        "status": "error",
        "message": err
      });
      return;
    }else{
      res.json(items);
      
      return;
    }
  });


});

/**
* Method that returns all shapes by shape_id
*/
app.get('/api/v1/shapes/routes/:id', function(req, res){
  
  	var id=req.params.id;
  	var db=mongodb.get();
    var collection = db.collection("shapes");
    var resultado=collection.find({"shape_id": id});
    
    
    resultado.toArray(function (err, items) {
      if(err){
        res.json({
          "status": "error",
          "message": err
        });
        return;
      }else{
        res.json(items);
        
        return;
      }
    });
  


});



mongodb.connect('mongodb://'+((mongoconf.autenticar=="true")?mongoconf.user+':'+mongoconf.password+'@':"")+mongoconf.host+'/'+mongoconf.database, function(err) {
    if (err) {
        console.log('Unable to connect to Mongo.');
        process.exit(1);
    } 
    else
    {

      //We create a geographic index here
    	var db=mongodb.get();
  		var collection = db.collection("holes").ensureIndex({location:"2d"}); 		

  		

        console.log("Mongo db connected in worker");
        var server = app.listen(port, function() {
          console.log('Listening on port 3000...');
          

        });
    }
});




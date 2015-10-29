/**
 * Created by timfulmer on 10/20/15.
 */
var restify=require('./config/restify'),
  passport=require('./config/passport'),
  waterline=require('./config/waterline');

waterline({authorize:true})
  .then(passport)
  .then(restify)
  .catch(function(err){
    console.log('Caught error running server:\n%s.',err.stack);
    process.exit(-1);
  });

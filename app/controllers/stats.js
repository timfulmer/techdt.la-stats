/**
 * Created by timfulmer on 10/20/15.
 */
var Promise=require('bluebird'),
  aggregate=require('../aggregate'),
  collections=void 0;

function aggregateStats(req,res,done){
  aggregate.countWorldStats({
    throw:collections.throw,
    playerId:req.user.id,
    playerSession:req.user.session
  })
    .then(aggregate.countPlayerStats)
    .then(aggregate.countSessionStats)
    .then(function(options){
      res.send(options.stats);
      return done();
    })
    .catch(function(err){
      res.send(err.stack);
      return done();
    });
}
function preCalculateStats(req,res,done){
  aggregate.countWorldStats({
    throw:collections.throw,
    throw_stats:collections.throw_stats,
    playerId:req.user.id,
    playerSession:req.user.session,
    persist:true
  })
    .then(aggregate.countPlayerStats)
    .then(aggregate.countSessionStats)
    .then(function(options){
      res.send(options.stats);
      return done();
    })
    .catch(function(err){
      res.send(err.stack);
      return done();
    });
}
function preCalculatedStats(req,res,done){
  collections.throw_stats.native(function(err,statsCollection){
    if(err){
      return res.send(err.stack);
    }
    statsCollection.find({}).toArray(function(err,stats) {
      if(err){
        return res.send(err.stack);
      }
      res.send(stats);
      return done();
    });
  });
}

function initialize(options){
  options=options || {};
  function initializePromise(resolve,reject){
    if(!options.collections || !options.collections.throw){
      return reject(new Error('Could not find throw collection.'));
    }
    collections=options.collections;
    // Please Note: options.server may be null if you want to initialize
    //   without a server.
    if(options.server){
      options.server.get('/api/stats/aggregate',aggregateStats);
      options.server.get('/api/stats/preCalculate',preCalculateStats);
      options.server.get('/api/stats/preCalculated',preCalculatedStats);
    }
    return resolve(options);
  }
  return new Promise(initializePromise);
}

module.exports=initialize;
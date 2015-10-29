/**
 * Created by timfulmer on 10/26/15.
 */
function persistStats(options){
  options=options || {};
  function persistStatsPromiseFactory(stats){
    return function persistStatsPromise(resolve,reject){
      options.throw_stats.native(function(err,statsCollection){
        statsCollection.findOne({_id:stats._id},function(err,statsDocument){
          if(err){
            return reject(err);
          }
          if(statsDocument){
            statsCollection.update({_id:stats._id},{$set:{count:stats.count}},function(err){
              if(err){
                return reject(err);
              }
              return resolve(options);
            });
          }else{
            statsCollection.insert(stats,function(err,stats){
              if(err){
                return reject(err);
              }
              options.stats=stats;
              return resolve(options);
            })
          }
        });
      });
    }
  }
  var promises=[];
  options.stats.forEach(function(stats){
    promises.push(new Promise(persistStatsPromiseFactory(stats)));
  });
  return Promise.all(promises);
}
function countStatsPromise(options){
  return function(resolve,reject){
    var match={};
    if(options.type==='player'){
      match.playerId=options.playerId;
    }
    if(options.type==='session'){
      match.playerId=options.playerId;
      match.playerSession=options.playerSession;
    }
    var pipeline=[
      {$match:match},
      {$group:{
        _id:{
          type:options.type,
          outcome:'$outcome'
        },
        count:{$sum:1}
      }}
    ];
    options.throw
      .native(function(err,throwCollection){
        throwCollection.aggregate(
          pipeline,function(err,data){
            if(err){
              return reject(err);
            }
            function resolvePromise(){
              options.stats=options.stats || [];
              options.stats=options.stats.concat(data);
              return resolve(options);
            }
            if(options.persist){
              persistStats({stats:data,throw_stats:options.throw_stats})
                .then(function(){
                  return resolvePromise();
                })
                .catch(function(err){
                  return reject(err);
                });
            }else{
              return resolvePromise();
            }
          });
      });
  }
}
function countWorldStats(options){
  options=options || {};
  options.type='world';
  return new Promise(countStatsPromise(options));
}
function countPlayerStats(options){
  options=options || {};
  options.type='player';
  return new Promise(countStatsPromise(options));
}
function countSessionStats(options){
  options=options || {};
  options.type='session';
  return new Promise(countStatsPromise(options));
}

module.exports={
  countWorldStats:countWorldStats,
  countPlayerStats:countPlayerStats,
  countSessionStats:countSessionStats
};
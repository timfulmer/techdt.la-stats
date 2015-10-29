/**
 * Created by timfulmer on 10/20/15.
 */
function loadCollection(options){
  options.orm.loadCollection(
    options.waterline.Collection.extend(
      {
        identity: 'throw_stats',
        connection: 'localhostMongo'
      }
    )
  );
}

module.exports=loadCollection;
/**
 * Created by timfulmer on 7/4/15.
 */
var outcomes=['player','opponent','draw'];

function loadCollection(options){
  options.orm.loadCollection(
    options.waterline.Collection.extend(
      {
        identity: 'throw',
        connection: 'localhostMongo',
        attributes: {
          playerId:{type:'string',required:true},
          playerSession:{type:'string',required:true},
          outcome:{type:'string',in:outcomes}
        }
      }
    )
  );
}

module.exports=loadCollection;
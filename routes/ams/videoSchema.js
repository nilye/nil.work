var mongoose = require('mongoose');
const commatubeDB = mongoose.createConnection('mongodb://commatube:comma0705@ds157672-a0.mlab.com:57672,ds157672-a1.mlab.com:57672/commatube?replicaSet=rs-ds157672');
var Schema = mongoose.Schema;
var mongooseUniValidator = require('mongoose-unique-validator');

var videoSchema = new Schema({
  type:{type:String, default:'#video'},
  id:{type:String, require: true, unique: true},
  snippet:{
    id:{type:String},
    title:{type:String},
    publishedDate:{type:Date},
    channelTitle:{type:String},
    duration:{type:String},
    viewCount:{type:Number, min: 0,default:0},
    chatCount:{type:Number, min: 0,default:0},
    thumbnail:{
      url:{type:String},
      width:{type:Number},
      height:{type:Number}
    }
  },
  content:{
    title:{type:String},
    description:{type:String},
    category:{type:Number},
    channel:{type:String}, //which is owner and save user._id
    durationInSecond:{type:Number},
    tags:[{type:String}],
    publishedDate:{type:Date},
    rating:{type:String, enum:['G','PG','PG-13','R','NC-17','UR'], default:'UR'} //*1
  },
  statistics:{
    viewCount:{type:Number, min: 0,default:0},
    likeCount:{type:Number, min: 0,default:0},
    chatCount:{type:Number, min: 0,default:0},
    commentCount:{type:Number, min: 0,default:0},
  },
  status:{
    encoding:{
      state:{type:Number, min:0, max:6, default:0},
      jobId:{type:String}
    }, //*2
    published:{type:Boolean, default: false},
    license:{type:String, default:'creator'} //*3
  },
  streaming:{
    path:{type:String, default:null},
    manifest:{type:String}
  },
  upload:{
    rawFile:{
      name:{type:String},
      size:{type:Number},
      type:{type:String},
      lastModifiedDate:{type:Date}
    },
    assetId:{type:String},
    uploadDate:{type:Date}
  },
  assets:{
    videos:{
      assetId:{type:String}
    },
    thumbnails:{
      assetId:{type:String},
      baseUri:{type:String},
      contentAccessComponent:{type:String}
    }
  }
});


videoSchema.plugin(mongooseUniValidator)

module.exports = commatubeDB.model("video",videoSchema,"video");

/*
  Reference:

  *1. MPAA rating system
  https://www.mpaa.org/wp-content/uploads/2013/11/film_ratings1.jpg

  *2. AMS encoding state:
  https://docs.microsoft.com/en-us/rest/api/media/operations/job#job_entity_properties
   - Queued = 0
   - Scheduled = 1
   - Processing = 2
   - Finished = 3
   - Error = 4
   - Canceled = 5
   - Canceling = 6

  *3 Commatube Creator License

  *4 ./assetFile.js

*/

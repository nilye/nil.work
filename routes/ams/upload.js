var express = require('express')
var router = express.Router()
var request = require("request");
var schedule = require('node-schedule')
var videoDB = require('./videoSchema')
var shortid = require('shortid')

/*AMS configuration*/
var config = {
  AzureADSTSEndpoint:'https://login.microsoftonline.com/xyesva.onmicrosoft.com/oauth2/token',
  RESTAPIEndpoint:'https://commatube.restv2.eastus.media.azure.net/api',
  clientID:'abd9c1ad-d09c-409f-8ef7-4a46e1ff45cd',
  clientSecret:'Ta8vW+ViHSUARoUU44/+QZpscmxqJlqwf5+36Nnb+yA=',
  accessToken: null,
  uploadAccessPolicy: 'nb:pid:UUID:4bf35451-3203-4f33-a5bc-f19a11ad1a41',
  streamingAccessPolicy:'nb:pid:UUID:05b5b3e4-445f-4edc-a676-fa6f8cb4641a'
}
var header = {
  'Cache-Control': 'no-cache',
  Authorization: null,
  MaxDataServiceVersion: '3.0',
  DataServiceVersion: '3.0',
  'Content-Type': 'application/json',
  Accept: 'application/json',
  'x-ms-version': '2.15'
}

/*
------------------------------------------------------------------------------------------------------------------------
  Get Azure AD token at the start of the server and every 1 hour
  Azure AD token is essential for all other operation
  It has an expiration of 1 hour
*/
getAzureADToken()
schedule.scheduleJob('*/00 * * * *', function () {
  getAzureADToken()
})

function getAzureADToken() {
  var options = { method: 'POST',
    url: config.AzureADSTSEndpoint,
    headers:
      { 'Cache-Control': 'no-cache',
        'Keep-Alive': 'true',
        'Content-Type': 'application/x-www-form-urlencoded' },
    form:
      { grant_type: 'client_credentials',
        client_id: config.clientID,
        client_secret: config.clientSecret,
        resource: 'https://rest.media.azure.net' } };

  request(options, function (error, response, body) {
    config.accessToken = JSON.parse(body)['access_token']
    header.Authorization = 'Bearer ' + config.accessToken
    console.log('--------------ADToken updated-------------')
  });
}


/*
------------------------------------------------------------------------------------------------------------------------
  Step A - Create an new Asset in AMS (Azure Media Server)
    A1. Create a new Asset
    A2. Create Asset SAS locator
    Router: Response the SAS locator to client so that user can http PUT the file
  Doc: https://docs.microsoft.com/en-us/azure/media-services/media-services-rest-upload-files
*/

/*
  A1. Create a new Asset
    An asset is a container for multiple types or sets of objects in Media Services, including video, audio, images, thumbnail collections, text tracks, and closed caption files. In the REST API, creating an Asset requires sending POST request to Media Services and placing any property information about your asset in the request body.
*/
function createAsset(name){
  var options = { method: 'POST',
    url: config.RESTAPIEndpoint+'/Assets',
    headers: header,
    body: { Name: name },
    json: true };
  return new Promise((resolve, reject) => {
    request(options, function (error, response, body) {
      if (response.statusCode == 201 && body){
        body['d'] ? resolve(body.d['Id']) : resolve(body['Id'])
      } else reject(body)
    })
  });
}
/*
  A2. Create Asset SAS locator
    To receive the actual upload URL, create a SAS Locator (shown below). Locators define the start time and type of connection endpoint for clients that want to access Files in an Asset. You can create multiple Locator entities for a given AccessPolicy and Asset pair to handle different client requests and needs. Each of these Locators uses the StartTime value plus the DurationInMinutes value of the AccessPolicy to determine the length of time (default is 100min) a URL can be used.
    AccessPolicy = {
     "Name": "NewUploadPolicy",
     "DurationInMinutes" : "100",
     "Permissions" : 2
    }
*/
function createSASLocator(assetId){
  var options = { method: 'POST',
    url: config.RESTAPIEndpoint+'/Locators',
    headers: header,
    body:
      { AccessPolicyId: config.uploadAccessPolicy,
        AssetId: assetId,
        Type: 1 },
    json: true };
  return new Promise((resolve, reject) => {
    request(options, function (error, response, body) {
      if (response.statusCode == 201) {
        body['d'] ? resolve(body['d']) : resolve(body)
      }
      else reject(body)
    });
  })
}
/*
  Router that response SAS locator(upload url) back
*/
router.post('/asset', function (req, res, next) {
  var assetName = 'RawFile - '+req.body.name
  createAsset(assetName).then(id =>{
    return createSASLocator(id)
  }).then(result =>{
    res.status(200).json(result)
  }).catch(err=> {
    return res.status(400).send(err)
  })
})


/*
------------------------------------------------------------------------------------------------------------------------
  Step B - Create AMS asset file MetaData info:
    B1. Create file info
    B2. Validate the file
    If the file is valid, create video data in Database and automatically start encoding
    Else, response error and delete the raw file Asset
    B3: Get the job output Asset
    B4. Create video data
    Router: Response that the upload is valid and encoding is started
    B5. Publish thumbnail asap so that user can pick thumbnails
 */
/*
  B1. Create file info
    Once the file has been uploaded, you need to create a metadata in the asset for the media file you uploaded into the blob storage associated with your asset.
*/
function createFileInfo(assetId){
  var options = { method: 'GET',
    url: config.RESTAPIEndpoint+'/CreateFileInfos',
    qs: { assetid: `'${assetId}'` },
    headers:header }
  return new Promise((resolve, reject)=>{
    request(options, function (error, response, body) {
      if (response.statusCode == 204) resolve()
      else reject(body)
    });
  })
}
/*
  B2. Validate the file
    To validate that the file has been uploaded successfully, you might want to query the AssetFile and compare the ContentFileSize (or other details) to what you expect to see in the new asset.
 */
function validateFile(req, assetId){
  var options = { method: 'GET',
    url: `${config.RESTAPIEndpoint}/Assets('${assetId}')/Files`,
    headers: header };
  return new Promise((resolve, reject)=>{
    request(options, function (error, response, body) {
      if (response.statusCode == 200){
        body = JSON.parse(body)
        var assetFile = body['d'] ? body.d['results'][0] : body['value'][0]
        if (req.body.rawFile.name == assetFile.Name && req.body.rawFile.size == assetFile.ContentFileSize){
          resolve()
        } else reject(body)
      }
    });
  })
}
/*
 B3. Get the job output Asset
 Get the job,
 save to the pending job list for further state check
 and save the output assets in video database
 */
function getJobOutput(jobId) {
  var options = { method: 'GET',
    url: `${config.RESTAPIEndpoint}/Jobs('${jobId}')/OutputMediaAssets`,
    headers: header}
  return new Promise ((resolve, reject)=>{
    request(options, function (error, response, body) {
      if (response.statusCode == 200){
        body = JSON.parse(body)
        body['d'] ? resolve(body.d['results']) : resolve(body['results'])
      } else reject(body)
    });
  })
}
/*
  B4. create video data in Database
 */
function createVideoDB(req, videoId, job, outputAssets, thumbnail){
  var video = new videoDB({
    id: videoId,
    snippet:{
      title: req.body.basicInfo.title,
      id:videoId
    },
    content:{
      title:req.body.basicInfo.title,
      description:req.body.basicInfo.description,
      category:req.body.basicInfo.category,
      tags:req.body.basicInfo.tags,
    },
    status:{
      encoding:{
        state:0,
        jobId:job.Id
      },
      published:false,
    },
    upload:{
      rawFile:{
        name:req.body.rawFile.name,
        size:req.body.rawFile.size,
        type:req.body.rawFile.type,
        lastModifiedDate:new Date(req.body.rawFile.lastModifiedDate)
      },
      assetId:req.body.assetId,
      uploadDate:new Date()
    },
    assets:{
      videos:{assetId:outputAssets[0].Id},
      thumbnails:{
        assetId:outputAssets[1].Id,
        baseUri:thumbnail['BaseUri'],
        contentAccessComponent:thumbnail['ContentAccessComponent']
      }
    }
  })
  return new Promise((resolve, reject)=>{
    video.save(function (err, video) {
      if (err) reject(err)
      resolve(video)
    })
  })
}

/*
  Router: Response that the upload is valid
*/
router.post('/fileInfo', function (req, res, next) {
  var assetId = req.body.assetId
  var videoId = shortid.generate()
  var job = null
  var outputAssets
  createFileInfo(assetId).then(()=>{
    return validateFile(req, assetId)
  }).then(()=>{
    return createEncodingJob(assetId, videoId)
  }).then((result)=>{
    job = result
    var jobId = result['Id']
    return getJobOutput(jobId)
  }).then((output)=> {
    outputAssets = output
    return publishThumbnails(output[1].Id)
  }).then((thumbnail)=>{
    return createVideoDB(req, videoId, job, outputAssets, thumbnail)
  }).then((video)=>{
    res.status(201).json({job:job, video:video})
  }).catch(err=>{
    deleteAsset(assetId).then()
    return res.status(400).send(err)
  })
})


/*
------------------------------------------------------------------------------------------------------------------------
 Step C - Create AMS Encoding Job and monitor the process
   C1. Create an encoding job
       Response that the encoding job is created
   C2. Router: Monitor the job process
 */
/*
  C1. Create an encoding job
    You can specify the details of encoding tasks by using preset strings defined for your encoder, or by using preset configuration files.
 */
function createEncodingJob(assetId, videoId){
  var body = encodingJobBody(assetId, videoId)
  var newHeader = header
  newHeader.Accept = 'application/json;odata=verbose'
  newHeader['Content-Type'] = 'application/json;odata=verbose'
  var options = { method: 'POST',
    url: config.RESTAPIEndpoint+'/Jobs',
    headers: newHeader,
    body: JSON.stringify(body)};
  return new Promise((resolve, reject)=>{
    request(options, function (error, response, body) {
      if (response.statusCode == 201){
        body = JSON.parse(body)
        body['d'] ? resolve(body.d) : resolve(body)
      } else reject(body)
    })
  })
}
function encodingJobBody(assetId,videoId){
  return {
    Name: assetId,
    InputMediaAssets: [{
      "__metadata": {
        uri: `${config.RESTAPIEndpoint}/Assets('${assetId}')`
      }
    }],
    Tasks: [{
      Configuration: "Adaptive Streaming",
      MediaProcessorId: "nb:mpid:UUID:ff4df607-d419-42f0-bc17-a481b1331e56",
      TaskBody: `<?xml version=\"1.0\" encoding=\"utf-8\"?>
                  <taskBody>
                  <inputAsset>JobInputAsset(0)</inputAsset>
                  <outputAsset assetName=\"${videoId} - videos\">JobOutputAsset(0)</outputAsset>
                </taskBody>`
    },{
      Configuration: `{
        'Version': 1.0,
           'Codecs': [
          {
            'JpgLayers': [
              {
                'Quality': 80,
                'Type': 'JpgLayer',
                'Width': 320,
                'Height': 180
              }
            ],
            'Start': '0%',
            'Step': '2%',
            'Range': '100%',
            'Type': 'JpgImage'
          }
        ],
        'Outputs': [
          {
            'FileName': '${videoId}-{Index}{Extension}',
            'Format': {
              'Type': 'JpgFormat'
            }
          }
        ]
      }`,
      MediaProcessorId: "nb:mpid:UUID:ff4df607-d419-42f0-bc17-a481b1331e56",
      TaskBody: `<?xml version=\"1.0\" encoding=\"utf-8\"?>
                  <taskBody>
                  <inputAsset>JobOutputAsset(0)</inputAsset>
                  <outputAsset assetName=\"${videoId} - thumbnails\">JobOutputAsset(1)</outputAsset>
                </taskBody>`
    }]
  };
}

/*
  C2. Router: Monitor the job process
 */
function getJob(jobId,res){
  var options = { method: 'GET',
    url: `${config.RESTAPIEndpoint}/Jobs('${jobId}')/Tasks`,
    headers:header};
  request(options, function (error, response, body) {
    if (error) return res.status(400).send(error)
    if (response.statusCode == 200) {
      var body = JSON.parse(body) //data type might be JSON odata so parse body
      body['d'] ?  res.status(200).json(body.d) : res.status(200).json({results:body.value})
    }
  });

}
router.get('/job/:jobId', function(req, res, next){
  getJob(req.params['jobId'], res)
})



/*
------------------------------------------------------------------------------------------------------------------------
  Step D - Publish the video
  D1. Publish video by creating streaming locator
  D2. Publish thumbnails by creating progressive locator
  Save the both locator into video Database
*/
/*
  D1. Publish video by creating streaming locator
 */
function publishVideo(assetId){
  var options = { method: 'POST',
    url: `${config.RESTAPIEndpoint}/Locators`,
    headers: header,
    body: { AccessPolicyId: config.streamingAccessPolicy,
      AssetId: assetId,
      StartTime: new Date(),
      Type: 2 },
    json: true };
  return new Promise((resolve, reject)=>{
    request(options, function (error, response, body) {
      if (response.statusCode == 201){
        body['d'] ? resolve(body.d) : resolve(body)
      } else reject(body);
    });
  })
}
/*
 D2. Publish thumbnails by creating progressive locator
 */
function publishThumbnails(assetId){
  var options = { method: 'POST',
    url: `${config.RESTAPIEndpoint}/Locators`,
    headers: header,
    body: { AccessPolicyId: config.streamingAccessPolicy,
      AssetId: assetId,
      StartTime: new Date(),
      Type: 1 },
    json: true };
  return new Promise((resolve, reject)=>{
    request(options, function (error, response, body) {
      if (response.statusCode == 201){
        body['d'] ? resolve(body.d) : resolve(body)
      } else reject(body);
    });
  })
}

router.post('/publish', function(req, res, next){
  videoDB.findOne({id:req.body.videoId}, function(err, video){
    if (err || !video) res.status(400).send(err)
    if (video.status.published) res.status(204).send(null)
    publishThumbnails(video.assets.thumbnails.assetId).then((result)=>{
      video.assets.thumbnails.baseUri = result['BaseUri']
      video.assets.thumbnails.contentAccessComponent = result['ContentAccessComponent']
      return publishVideo(video.assets.videos.assetId)
    }).then((result)=>{
      video.streaming.path = result['Path']
      var rawFileName = video.upload.rawFile.name
      video.streaming.manifest = rawFileName.substring(0, rawFileName.indexOf('.'))+'.ism'
      var now = new Date()
      video.content.publishedDate = now
      video.snippet.publishedDate = now
      video.status.published = true
      video.save(function (err, obj) {
        if (err) return res.status(400).send(err)
        res.status(201).json(obj)
      })
    }).catch(err=>{
      return res.status(401).send(err)
    })
  })
})



/*
 ------------------------------------------------------------------------------------------------------------------------
 Step E - Finally clean up
 E1. If job finished, delete job and its raw file asset
 E2. If there is zombie asset files
 */
schedule.scheduleJob('*/30 * * * *', function () {
  cleanup()
})
function cleanup(){
  var options = { method: 'GET',
    url: `${config.RESTAPIEndpoint}/Jobs`,
    headers:header};
  request(options, function (error, response, body) {
    var jobList = []
    body = JSON.parse(body)
    console.log(body)
    if (response.statusCode == 200){
      jobList = body['d'] ? body.d['results'] : body['value']
      for (let i of jobList){
        if (i.State == 3 || i.State == 4 || i.State ==5){
          deleteAsset(i.Name).then(()=>{
            return deleteJob(i.Id)
          })
        }
      }
    }
  });
}

/*
------------------------------------------------------------------------------------------------------------------------
  Step X - Cancel and Delete anything or Abort the process
  E1. Delete raw file Asset
  E2. Delete video
  E3. Delete encoding job
  E4. Cancel encoding job
  */
// E1. Delete raw file Asset
function deleteAsset(assetId){
  var options = { method: 'DELETE',
    url: `${config.RESTAPIEndpoint}/Assets('${assetId}')`,
    headers: header};
  return new Promise ((resolve, reject)=>{
    request(options, function (error, response, body) {
      if (response.statusCode == 204 || response.statusCode == 404){
        resolve()
      } else reject()
    });
  })
}
router.delete('/asset/:assetId', function (req, res) {
  deleteAsset(req.params.assetId).then(()=>{
    res.status(204).json(null)
  }).catch(()=>{
    res.status(204).json(null)
  })
})
// E2. Delete video
router.delete('/video/:videoId', function (req, res) {
  videoDB.findOne({id:req.params.videoId}, function(err, video){
    if (err || !video) return res.status(204).json(null)
    deleteAsset(video.upload.assetId).then(()=>{
      return deleteAsset(video.assets.videos.assetId)
    }).then(()=>{
      return deleteAsset(video.assets.thumbnails.assetId)
    }).then(()=>{
      return deleteJob(video.status.encoding.jobId)
    }).then(()=>{
      video.remove(function (err, result) {
        res.status(204).json(null)
      })
    }).catch(()=>{
      res.status(204).json(null)
    })
  })
})


// E3. Delete encoding job
function deleteJob(jobId){
  var options = { method: 'DELETE',
    url: `${config.RESTAPIEndpoint}/Jobs('${jobId}')`,
    headers: header};
  return new Promise ((resolve, reject)=> {
    request(options, function (error, response, body) {
      if (response.statusCode == 204 || response.statusCode == 404){
        resolve()
      } else reject()
    });
  })
}



module.exports = router;

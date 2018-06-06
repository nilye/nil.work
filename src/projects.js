export const ProjPath = '/index/static/proj';
export const Projects = [{
  id:'commatubeSchoolProj',
  name:'Commatube Portfolio',
  title:'Commatube  (as School Project)',
  label:'C',
  context:'Commatube allows the comments of the video to be displayed while the associated video segment is playing. This allows comments to respond directly to events occurring in the video and in sync with the viewer in order to creat a sense of a shared watching experience.',
  links:{},
  tools:['sketch'],
  images:['tn.jpg','1.jpg']
},{
  id:'afa',
  name:'AFA Web Redesign',
  title:'AFA Web Redesign',
  label:'A',
  context:'',
  showContext:true,
  links:{
    web:'https://liveweave.com/NXXoTU',
    web1:'https://liveweave.com/AX2oVl'
  },
  tools:['sketch','js'],
  images:['tn.jpg','1.jpg']
},{
  id:'whyHPV',
  name:'WhyHPV',
  title:'WhyHPV',
  label:'W',
  context:'',
  showContext:false,
  links:{},
  tools:['sketch'],
  images:['tn.jpg','1.jpg']
},{
  id:'theShop',
  name:'The Shop',
  title:'The Shop',
  label:'S',
  context:'The Shop is a project that helps West Elm to conveying their brand story by connecting to a physical space at which customers’ are able to learn the techniques and craftmanship which goes into each West Elm product.',
  showContext:false,
  links:{},
  tools:['sketch'],
  images:['tn.jpg','1.jpg']
},{
  id:'ichibone',
  name:'Ichibone',
  title:'Ichibone',
  label:'I',
  context:'Dogs do love humanbeings, however, people cannot stay with their dogs through all days. Ichibone pillow combines scratching massage feeling with dog’s daily sleeping pillow. It can be controlled via smart phone app by sweeping your fingers wherever you are. It’s easier for you to have some interaction with your lovely dog when you miss them.',
  showContext:false,
  links:{},
  tools:['sketch'],
  images:['tn.jpg','1.jpg']
},{
  id:'jiwonchong',
  name:'jiwonchong.io',
  title:'jiwonchong.io',
  label:'J',
  context:`A freelance job to develop my friend's personal website. She is also a designer, and this website helps her to be hired by Apple.`,
  showContext:true,
  links:{
    web:'http://jiwonchong.io'
  },
  tools:['angular','nodejs','firebase','heroku'],
  images:['tn.png','1.jpg','2.jpg']
},{
  id:'league',
  name:'League',
  title:'League - an op.gg clone',
  label:'L',
  context:'A project of op.gg (insight and data service for League of Legend) clone.',
  showContext:true,
  links:{},
  tools:['angular','nodejs','riot'],
  imagePath:'/league/',
  images:['tn.png']
},{
  id:'ud',
  name:'Urban Dictionary - 微信小程序',
  title:'Urban Dictionary - 微信小程序',
  label:'S',
  context:`A practice project I did while I was learning wechat mini-program. This allows people search slang words or meme while using wechat through the database of "Urban Dictionary". *Due to China's 'The Doamain Name Registration' policy, this app may not function peroperly😂.`,
  showContext:true,
  links:{},
  tools:['wechat'],
  images:['tn.png','1.jpg','2.png']
},{
  id:'commatube',
  name:'Commatube',
  title:'Commatube',
  label:'C',
  context:`
  <br>
  😜🤪😆🤟🤟🤟
  <br>
  <a href="http://commatube.com" target="_blank" style="color:#ff4f65;text-decoration: underline;font-size: 28px;">http://commatube.com</a> 
  <br><span style="font-size: 12px;">*Require VPN, if you're in China.</span>
  <br><br/>
  Commatube started with one of my school project. I was trying to adapt the popular Chinese 'danmu' video watching feature in the US. When I begin running Commatube as a startup Project. I established a team of 4 people and dedicated all my passion. We start to brand it as a video playground that allows people to engage and send time-stamped comments on youtube videos. I play a role as founder and full-stack web developer.
  `,
  showContext:true,
  links:{
    web:'http://commatube.com',
    github:'https://github.com/nilye/commatube-md'
  },
  tools:['angular','nodejs','mongoDB','googleCloud','nginx','youtube','giphy'],
  images:['tn.png','1.png']
},{
  id:'ams',
  name:'Azure Media Server',
  title:'Azure Media Server Demo',
  label:'V',
  context:`A video server demo built for Commatube based on Microsoft's Azure which is able to upload, fetch, play and analysis videos, and is going to mount on Commatube. It is a more server-side focused project and works by calling several REST APIs of Microsoft's Azure Media Server, Blob storage, and CDN. Besides, it can adapt to other video server use cases, and I shared the github files so that people can know and learn how I did it.`,
  showContext:true,
  links:{
    web:'http://ams.nil.work',
    github:'https://github.com/nilye/commatube-AMS-demo'
  },
  tools:['azure','ams','nodejs','angular'],
  images:['tn.png','0.png','1.png']
},{
  id:'angularUIPipes',
  name:'Angular UI Pipe',
  title:'Angular UI Pipe Library',
  label:'A',
  context:`Dealing with raw data is annoying, and legibility is always required. On the other hand, there are several angular lib that help developer convert raw data into human-friendly format, for example to convert a timestamp into how much time ago from now. However, they are not complete and cannot help out all scenarios, and there are still more problems haven't been solved yet. Therefore, I began with this angular library which is a angular tools collection of as much tools for different scenarios as possible.`,
  showContext: true,
  links:{},
  tools:['npm','angular','nodejs'],
  images:['tn.png']
}];

export default {
  getProject(id){
    return Projects.find(function (p) {
      return p.id == id
    })
  },
  thumbnail(id){
    let p = this.getProject(id)
    return ProjPath+'/'+p.id+'/'+p.images[0]
  },
  allImages(id){
    let p = this.getProject(id)
    const imgList = p.images.map(i => ProjPath+'/'+p.id+'/'+i)
    return imgList
  }
}

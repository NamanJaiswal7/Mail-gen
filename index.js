var CronJob = require('cron').CronJob;
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'namankumar.jbs@gmail.com',
    pass: 'naman_jaiswal@6140341'
  }
});

let date=new Date();
let mdate=JSON.stringify(date)
let fDate=mdate.split("T");
let finalDate=fDate[0];
let str="";
for(let i=1;i<finalDate.length;i++){
str+=finalDate[i];
}

function insertData(){
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    var myobj = { minedate:str  };
    dbo.collection("products").insertOne(myobj, function(err, res) {
      if (err) throw err;
      console.log("1 document inserted");
      db.close();
    });
  });
}
function emailGenerate(arr,url)
{
 
  
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    dbo.collection("products").countDocuments({"minedate":str}, function(err, result) {
      if (err) throw err;
      console.log(result);
      var mailOptions = {
        from: 'namankumar.jbs@gmail.com',
        to: 'naman.patna@gmail.com',
        subject: 'Sending Email using Node.js',
        text: result.toString(2)
      };
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
      db.close();
    });
  });

}

var job = new CronJob('00 21 * * *', function() {
  emailGenerate([1,2],url)
  console.log('You will see this message every second');
}, null, true, 'America/Los_Angeles');
job.start();

// insertData();
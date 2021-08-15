const { Console, time } = require('console');
const http = require('http');
const fs = require('fs');
const readline = require('readline');
const { ifError } = require('assert');
var spawn = require("child_process").spawn;

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', (input) => {
    if(input == '.exit'){
        process.exit()
    }else if(input == '.dump'){
        console.log(timeStamp()+" [INFO] dumping stored data:\n"+POSTData);
    }else{
        console.log(timeStamp()+" [HELP]");
        console.log("Type .dump to dump stored data.");
        console.log("Type .exit to exit the application.");
    }
});

var web_server_port = 59
var host_address = 'voip.fetafisken.se'
console.log(host_address+":"+web_server_port);

var filterArray = ["png","jpg","jpeg","gif","webp"];
console.log(filterArray);

function addZero(obj){
    if(parseInt(obj) < 10){f_obj = "0"+obj.toString();return f_obj;}
    else{return obj};
}

function logReverser(){
    log_reverser = spawn("powershell.exe", ["-noprofile","./reverse_log.ps1"], {cwd: '.'});
    log_reverser.stdout.on("data",function(stdout){
    });
    log_reverser.stderr.on("data",function(stderr){
      console.log(timeStamp()+" [ERROR] log_reverser: "+stderr);
    });
    log_reverser.on("exit",function(){
    });
    log_reverser.stdin.end; //end input
}

function imageHandler(){
    image_handler = spawn("powershell.exe", ["-noprofile","./automagick.ps1"], {cwd: '.'});
    image_handler.stdout.on("data",function(stdout){
        if(stdout.toString().match(/processing/i)){
            console.log(timeStamp()+" [automagick.ps1]: "+stdout);
        }
    });
    image_handler.stderr.on("data",function(stderr){
      console.log(timeStamp()+" [ERROR] image_handler: "+stderr);
    });
    image_handler.on("exit",function(){
    });
    image_handler.stdin.end; //end input
}
  

function timeStamp(method){
    if(method == null){
      method = 0;
    }
    var ct = new Date;
    var fts_time;
    var fts_date;
    var fts_full;
    //switch Start
    //switch End
    fts_date = "["+ct.getFullYear().toString()+"-"+addZero(ct.getMonth()+1).toString()+"-"+addZero(ct.getDate()).toString()+"]"
    fts_time = "["+addZero(ct.getHours()).toString()+":"+addZero(ct.getMinutes()).toString()+":"+addZero(ct.getSeconds()).toString()+"]";
    fts_full = fts_date.replace("]","") + " @ " + fts_time.replace("[","");
    switch(method){
      case (0):
        return fts_full;
        break;
      case (1):
        return fts_date;
        break;
      case (2):
        return fts_time;
        break;
      default:
        return fts_full;
        break;
    }
}

function postData(POSTData){
    console.log(timeStamp()+" POSTData: ["+POSTData+"]");
}

//postData()

http.createServer(function (request, response){
    if(request.method == 'POST'){
        let body = '';
        //let target = request.url.replace("/","");
        let target = 'req'
        request.on('data', chunk => {
            body += chunk.toString()
            POSTData = body;
        });
        request.on('end', () => {
            //if(request.socket.remoteAddress.match(/::1/) == false){
            //    console.log("["+request.socket.remoteAddress+"] sent data to ["+target+"] by the ["+request.method+"] method.")
            //}
            var timeObj = new Date;
            var year = timeObj.getFullYear();
            if(year < 10){year = "0"+year;}else{year = year.toString()}
            var month = timeObj.getMonth();
            if(month < 10){month = "0"+month;}else{month = month.toString()}
            var date = timeObj.getDate();
            if(date < 10){date = "0"+date;}else{date = date.toString()}
            var hour = timeObj.getHours();
            if(hour < 10){hour = "0"+hour;}else{hour = hour.toString()}
            var minute = timeObj.getMinutes();
            if(minute < 10){minute = "0"+minute;}else{minute = minute.toString()}
            var second = timeObj.getSeconds();
            if(second < 10){second = "0"+second;}else{second = second.toString()}
            
            timeString = year+"-"+month+"-"+date+"_"+hour+"-"+minute+"-"+second;
            var decodedJSON = JSON.parse(POSTData);
            var uploader;
            fileString = timeString+"-"+decodedJSON.name+"."+decodedJSON.ext;
            if(decodedJSON === undefined ){
                uploader = request.socket.remoteAddress
            }else{
                uploader = decodedJSON.uploader
            }

            adminDataString = timeStamp()+" | "+decodedJSON.uploader+" | "+request.socket.remoteAddress+" | "+decodedJSON.name+" | "+decodedJSON.ext + "\n"

            console.log(timeStamp()+" [INFO] mjarni request: received payload: "+fileString);
            fs.writeFileSync("./"+target+"/"+fileString,decodedJSON.data,'base64',function(err){console.log(err)});
            if(filterArray.includes(decodedJSON.ext)){
                logReverser();
                fs.writeFileSync("./request",fileString)
                fs.appendFileSync("./tmp_upload.log","\n<span class=\"logitem\">"+timeStamp()+" | "+uploader+" uploaded "+decodedJSON.name+"."+decodedJSON.ext+"</span>");
                logReverser();
                imageHandler();
            }
            fs.appendFileSync("./adminlog",adminDataString);
            response.end(timeStamp()+" Server recieved "+fileString+".");
        });
    }
    else if(request.method == 'GET'){
        console.log("["+request.socket.remoteAddress+"] requested ["+request.url+"] by the ["+request.method+"] method.")
        response.end(null);
    }
}).listen((web_server_port));
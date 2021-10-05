const mongodb = require('mongodb');
const http = require('http');

getTimeZoneRegions('http://worldtimeapi.org/api/timezone/', (timeZoneRegions) => {
    console.log("in callback function" + timeZoneRegions);
    console.log(timeZoneRegions.length);
    var baseUrl = 'http://worldtimeapi.org/api/timezone/';
    var timeZoneDataList = [];
    for(var i = 0; i < timeZoneRegions.length; i++) {
        var url = baseUrl + encodeURIComponent(timeZoneRegions[i]);
        getTimeZoneRegions(url, (timeZoneData) => {
            timeZoneDataList.push(timeZoneData);
        });
    }
    setTimeout(async () => {
        const client = await loadPostsColection();
        console.log(timeZoneDataList.length);
        for(var i = 0; i < timeZoneDataList.length; i++) {
            client.insertOne(timeZoneDataList[i]);
        }
        console.log('inserted records into mongodb');
    },2000);
    
});



async function getTimeZoneRegions(url, callback) {
    http.get(url, async (res) => {
    var json = '';
    res.on('data', function (chunk) {
        json += chunk;
    });
    res.on('end', function () {
        if (res.statusCode === 200) {
            try {
                var data = JSON.parse(json);
                // data is available here:
                return callback(data);
            } catch (e) {
                console.log('Error parsing JSON!');
            }
        }
    });
  }).on('error', (e) => {
    console.error(e);
    console.log('api not working');
  });
}

async function loadPostsColection() {
    console.log('connecting to mongodb');
    const client = await mongodb.MongoClient.connect
    ('mongodb+srv://sankar:sankar1234@project-demo.qvve2.mongodb.net/calendar?retryWrites=true&w=majority',{
        useNewUrlParser:true
    });
    // setTimeout(() => {
    //     console.log('connection sucessful');
    //     console.log(client.db('calendar').collection('timezones'));
    //     return client.db('calendar').collection('timezones');
    // }, 3000);
    return client.db('calendar').collection('timezones');
}
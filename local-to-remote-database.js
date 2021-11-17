const mysql = require("mysql");
const request = require("request");

//Database connection
const connection = mysql.createConnection({
    host: '',
    user: '',
    password: '',
    database: '',
    insecureAuth: true
});


// buildTableApps(data);

connection.query("SELECT * FROM dashboard.apps;", function (error, results, fields) {
    if (error) {
        console.log(error);
    }

    let apps = JSON.parse(JSON.stringify(results));
    console.log(apps);

    apps.forEach(app => {
        const appName = {
            appName: app.appName
        }

        setInterval(() => {
            // request.post(
            //     'http://cf23134f.ngrok.io/api/app',
            //     { appName: appName },
            //     function (error, response, body) {
            //         if (!error && response.statusCode == 200) {
            //             console.log(body)
            //         } else {
            //             console.log(error)
            //         }
            //     }
            // );


            request({
                url: "http://cf23134f.ngrok.io/api/app",
                method: "POST",
                data: appName   // <--Very important!!!
            }, function (error, response, body){
                console.log(response);
            });
        }, 2500)
    });
})


// function buildTableApps(data) {

//     let appsCount;
//     apps.forEach(function(app, index) {
//         const appName = app.app;
//         const appServices = app.services;
//         connection.query("INSERT INTO dashboard.apps (appName) VALUES('" + appName + "');", function (error, results, fields) {
//             if (error) {
//                 console.log(error);
//             }

//             const appId = results.insertId;

//             const groupQuery = "INSERT INTO dashboard.groups (appId, groupName) VALUES("+appId+", 'ALL SERVICES');";
//             console.log(groupQuery);

//             connection.query(groupQuery, function (error, results, fields) {
//                 if (error) {
//                     console.log(error);
//                 }
//             })

//             appServices.forEach(function(service, index) {
//                 const hangers = service.hangers;
//                 const serviceName = service.service;
//                 const serviceQuery = "INSERT INTO dashboard.services (appId, serviceName, groupId) VALUES("+appId+", '" + serviceName + "', 0);";
//                 console.log(serviceQuery);
//                 connection.query(serviceQuery, function (error, results, fields) {
//                     if (error) {
//                         console.log(error);
//                     }

//                     const serviceId = results.insertId;

//                     hangers.forEach(function(hanger, index ) {

//                         const hangerName = hanger.hanger;
//                         const hangers = hanger.servers;

//                         const hangerQuery = "INSERT INTO dashboard.environments (serviceId, environmentName) VALUES("+serviceId+", '"+hangerName+"');";
//                         console.log(hangerQuery);

//                         connection.query(hangerQuery, function (error, results, fields) {
//                             if (error) {
//                                 console.log(error);
//                             }

//                             const hangerId = results.insertId;

//                             hangers.forEach(function(hanger, index ) {
//                                 const serverQuery = "INSERT INTO dashboard.servers (serviceId, environmentId, serverName) VALUES("+serviceId+", "+hangerId+", '"+hanger+"');";
//                                 console.log(serverQuery);

//                                 connection.query(serverQuery, function (error, results, fields) {
//                                     if (error) {
//                                         console.log(error);
//                                     }
//                                 })
//                             })
//                         })                    
//                     })
//                 })
//             })
//         })
//         appsCount = index + 1;
//     })
//     console.log("We have added "+ appsCount + " Records to the apps table");
// }

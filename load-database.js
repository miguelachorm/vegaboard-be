const mysql = require("mysql");
const data = require('./ServiceInfo.json');

//Database connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: '',
    password: '',
    database: '',
    insecureAuth: true
});


buildTableApps(data);


function buildTableApps(data) {
    const apps = data.apps;
    let appsCount;
    apps.forEach(function(app, index) {
        const appName = app.app;
        const appServices = app.services;
        connection.query("INSERT INTO dashboard.apps (appName) VALUES('" + appName + "');", function (error, results, fields) {
            if (error) {
                console.log(error);
            }

            const appId = results.insertId;

            const groupQuery = "INSERT INTO dashboard.groups (appId, groupName) VALUES("+appId+", 'ALL SERVICES');";
            console.log(groupQuery);

            connection.query(groupQuery, function (error, results, fields) {
                if (error) {
                    console.log(error);
                }
            })

            appServices.forEach(function(service, index) {
                const hangers = service.hangers;
                const serviceName = service.service;
                const serviceQuery = "INSERT INTO dashboard.services (appId, serviceName, groupId) VALUES("+appId+", '" + serviceName + "', 0);";
                console.log(serviceQuery);
                connection.query(serviceQuery, function (error, results, fields) {
                    if (error) {
                        console.log(error);
                    }

                    const serviceId = results.insertId;

                    hangers.forEach(function(hanger, index ) {

                        const hangerName = hanger.hanger;
                        const hangers = hanger.servers;

                        const hangerQuery = "INSERT INTO dashboard.environments (serviceId, environmentName) VALUES("+serviceId+", '"+hangerName+"');";
                        console.log(hangerQuery);
            
                        connection.query(hangerQuery, function (error, results, fields) {
                            if (error) {
                                console.log(error);
                            }

                            const hangerId = results.insertId;

                            hangers.forEach(function(hanger, index ) {
                                const serverQuery = "INSERT INTO dashboard.servers (serviceId, environmentId, serverName) VALUES("+serviceId+", "+hangerId+", '"+hanger+"');";
                                console.log(serverQuery);
                    
                                connection.query(serverQuery, function (error, results, fields) {
                                    if (error) {
                                        console.log(error);
                                    }
                                })
                            })
                        })                    
                    })
                })
            })
        })
        appsCount = index + 1;
    })
    console.log("We have added "+ appsCount + " Records to the apps table");
}

//connection.end();
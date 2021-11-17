const express = require('express')
const app = express()
const mysql = require("mysql");

app.use(express.json())

//Database connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'dashboard',
  insecureAuth: true
});

connection.connect((error) => {
  if (!!error) {
    console.log('CONNECTION ERROR', error)
  } else {
    console.log('CONNECTED')
  }
});

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', (req, res) => {
  res.send('Hello World')
})

// Apps API
app.get('/api/apps', (req, res) => {
  connection.query('SELECT * from apps', function (error, results, fields) {
    if (error) {
      res.send(JSON.stringify({ "status": 500, "error": error, "response": null }));
      //If there is error, we send the error in the error section with 500 status
    } else {
      res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
      //If there is no error, all is good and response is 200OK.
    }
  });
})

app.post('/api/app', (req, res) => {
  const value = req.body.appName;
  let appId;
  connection.query("INSERT INTO dashboard.apps (appName) VALUES('" + value + "');", function (error, results, fields) {
    appId = results.insertId;
    if (error) {
      res.send(JSON.stringify({ "status": 500, "error": error, "response": null }));
      //If there is error, we send the error in the error section with 500 status
    }
    connection.query("INSERT INTO dashboard.groups (groupName, appId) VALUES('ALL SERVICES', "+appId+");", function (error, results, fields) {
      // console.log(value);
      if (error) {
        res.send(JSON.stringify({ "status": 500, "error": error, "response": null }));
        //If there is error, we send the error in the error section with 500 status
      }
      connection.query("SELECT * from dashboard.apps;", function (error, results, fields) {
        //console.log(value);
        if (error) {
          res.send(JSON.stringify({ "status": 500, "error": error, "response": null }));
          //If there is error, we send the error in the error section with 500 status
        } else {
          res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
          //If there is no error, all is good and response is 200OK.
        }
      });
    });
  });
})

app.delete('/api/app/:id', (req, res) => {

  const parame = req.params.id;
  connection.query("DELETE FROM apps WHERE appId = " + parame + ";", function (error, results, fields) {
    if (error) {
      res.send(JSON.stringify({ "status": 500, "error": error, "response": null }));
      //If there is error, we send the error in the error section with 500 status
    }
    connection.query("DELETE FROM environments WHERE appId = " + parame + ";", function (error, results, fields) {
      if (error) {
        res.send(JSON.stringify({ "status": 500, "error": error, "response": null }));
        //If there is error, we send the error in the error section with 500 status
      }
      connection.query("DELETE FROM servers WHERE appId = " + parame + ";", function (error, results, fields) {
        if (error) {
          res.send(JSON.stringify({ "status": 500, "error": error, "response": null }));
          //If there is error, we send the error in the error section with 500 status
        }
        connection.query("DELETE FROM dashboard.groups WHERE appId = " + parame + ";", function (error, results, fields) {
          if (error) {
            res.send(JSON.stringify({ "status": 500, "error": error, "response": null }));
            //If there is error, we send the error in the error section with 500 status
          }
          connection.query("DELETE FROM services WHERE appId = " + parame + ";", function (error, results, fields) {
            if (error) {
              res.send(JSON.stringify({ "status": 500, "error": error, "response": null }));
              //If there is error, we send the error in the error section with 500 status
            }
          });
        });
      });
    });

    connection.query("SELECT * from apps;", function (error, results, fields) {
      if (error) {
        res.send(JSON.stringify({ "status": 500, "error": error, "response": null }));
        //If there is error, we send the error in the error section with 500 status
      } else {
        res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
        //If there is no error, all is good and response is 200OK.
      }
    });
  });
})

// ENVIRONMENTS APIs
app.post('/api/environments', (req, res) => {

  const serviceId = req.body.serviceId;

  connection.query("SELECT * from environments where serviceId = "+ serviceId +";", function (error, results, fields) {

    if (error) {
      res.send(JSON.stringify({ "status": 500, "error": error, "response": null }));
      //If there is error, we send the error in the error section with 500 status
    } else {
      res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
      //If there is no error, all is good and response is 200OK.
    }
  });
})

app.post('/api/environment', (req, res) => {

  const serviceId = req.body.serviceId;
  const envName = req.body.environmentName;
  connection.query("INSERT INTO environments (environmentName, serviceId) VALUES('" + envName + "', "+serviceId+");", function (error, results, fields) {
    // console.log(value);
    if (error) {
      res.send(JSON.stringify({ "status": 500, "error": error, "response": null }));
      //If there is error, we send the error in the error section with 500 status
    }
    connection.query("SELECT * from environments where serviceId = " + serviceId + ";", function (error, results, fields) {
      // console.log(value);
      if (error) {
        res.send(JSON.stringify({ "status": 500, "error": error, "response": null }));
        //If there is error, we send the error in the error section with 500 status
      } else {
        res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
        //If there is no error, all is good and response is 200OK.
      }
    });
  });
})

app.delete('/api/environment/:id', (req, res) => {

  const element = JSON.parse(req.params.id);
  // console.log(element.environmentId);
  connection.query("DELETE FROM environments WHERE environmentId = " + element.environmentId + ";", function (error, results, fields) {
    if (error) {
      res.send(JSON.stringify({ "status": 500, "error": error, "response": null }));
      //If there is error, we send the error in the error section with 500 status
    }
    connection.query("DELETE FROM servers WHERE environmentId = " + element.environmentId + ";", function (error, results, fields) {
      if (error) {
        res.send(JSON.stringify({ "status": 500, "error": error, "response": null }));
        //If there is error, we send the error in the error section with 500 status
      }
      connection.query("SELECT * from environments where serviceId = " + element.serviceId + ";", function (error, results, fields) {
        if (error) {
          res.send(JSON.stringify({ "status": 500, "error": error, "response": null }));
          //If there is error, we send the error in the error section with 500 status
        } else {
          res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
          //If there is no error, all is good and response is 200OK.
        }
      });
    });
  });
})

// SERVICES APIs
app.post('/api/services', (req, res) => {
  const value = req.body.appId;
  //console.log(value);
  connection.query("SELECT * from services where appId = " + value + ";", function (error, results, fields) {

    if (error) {
      res.send(JSON.stringify({ "status": 500, "error": error, "response": null }));
      //If there is error, we send the error in the error section with 500 status
    } else {
      res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
      //If there is no error, all is good and response is 200OK.
    }
  });
})

app.post('/api/service', (req, res) => {
  const appIdvalue = req.body.appId;
  const serviceName = req.body.serviceName;

  connection.query("INSERT INTO dashboard.services (serviceName, appId, groupId) VALUES('" + serviceName + "', "+appIdvalue+", 0);", function (error, results, fields) {
    // console.log(value);
    if (error) {
      res.send(JSON.stringify({ "status": 500, "error": error, "response": null }));
      //If there is error, we send the error in the error section with 500 status
    }

    console.log()
    connection.query("SELECT * from services where appId = " + appIdvalue + ";", function (error, results, fields) {
      // console.log(value);
      if (error) {
        res.send(JSON.stringify({ "status": 500, "error": error, "response": null }));
        //If there is error, we send the error in the error section with 500 status
      } else {
        res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
        //If there is no error, all is good and response is 200OK.
      }
    });
  });
})

app.delete('/api/service/:id', (req, res) => {

  const data = JSON.parse(req.params.id);

  connection.query("DELETE FROM services WHERE serviceId = " + data.serviceId + ";", function (error, results, fields) {
    if (error) {
      res.send(JSON.stringify({ "status": 500, "error": error, "response": null }));
      //If there is error, we send the error in the error section with 500 status
    }
    connection.query("SELECT * from services where appId = " + data.appId + ";", function (error, results, fields) {
      if (error) {
        res.send(JSON.stringify({ "status": 500, "error": error, "response": null }));
        //If there is error, we send the error in the error section with 500 status
      } else {
        res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
        //If there is no error, all is good and response is 200OK.
      }
    });
  });
})

// SERVERS APIs
app.post('/api/servers', (req, res) => {
  const envId = req.body.environmentId;
  connection.query("SELECT * from dashboard.servers where environmentId = "+envId+";", function (error, results, fields) {
    if (error) {
      res.send(JSON.stringify({ "status": 500, "error": error, "response": null }));
      //If there is error, we send the error in the error section with 500 status
    } else {
      res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
      //If there is no error, all is good and response is 200OK.
    }
  });
})

app.post('/api/serversbyservices', (req, res) => {
  const appId = req.body.appId; // 1

  const serversQuery = "select servers.serviceId, services.serviceName, servers.environmentId, servers.serverId, servers.serverName, environments.environmentName from servers "+
                      "join services on servers.serviceId = services.serviceId "+
                      "join environments on environments.environmentId = servers.environmentId "+
                      "join apps on services.appId = apps.appId "+
                      "where apps.appId = "+appId+";";

  connection.query(serversQuery, function (error, results, fields) {
    if (error) {
      res.send(JSON.stringify({ "status": 500, "error": error, "response": null }));
      //If there is error, we send the error in the error section with 500 status
    } else {
      res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
      //If there is no error, all is good and response is 200OK.
    }
  });
})

app.post('/api/server', (req, res) => {
  const envId = req.body.environmentId;
  const serverName = req.body.serverName;
  const serviceId = req.body.serviceId;
  connection.query("INSERT INTO servers (serverName, environmentId, serviceId) VALUES('" + serverName + "', "+envId+", "+serviceId+");", function (error, results, fields) {
    // console.log(value);
    if (error) {
      res.send(JSON.stringify({ "status": 500, "error": error, "response": null }));
      //If there is error, we send the error in the error section with 500 status
    }
    connection.query("SELECT * from servers where environmentId = "+envId+";", function (error, results, fields) {
      // console.log(value);
      if (error) {
        res.send(JSON.stringify({ "status": 500, "error": error, "response": null }));
        //If there is error, we send the error in the error section with 500 status
      } else {
        res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
        //If there is no error, all is good and response is 200OK.
      }
    });
  });
})

app.delete('/api/server/:id', (req, res) => {

  const data = JSON.parse(req.params.id);

  connection.query("DELETE FROM servers WHERE serverId = " + data.serverId + ";", function (error, results, fields) {
    if (error) {
      res.send(JSON.stringify({ "status": 500, "error": error, "response": null }));
      //If there is error, we send the error in the error section with 500 status
    }
    connection.query("SELECT * from servers where environmentId = "+data.environmentId+";", function (error, results, fields) {
      if (error) {
        res.send(JSON.stringify({ "status": 500, "error": error, "response": null }));
        //If there is error, we send the error in the error section with 500 status
      } else {
        res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
        //If there is no error, all is good and response is 200OK.
      }
    });
  });
})

// GROUPS APIs
app.post('/api/groups', (req, res) => {
  const value = req.body.appId;
  connection.query("SELECT * FROM dashboard.groups WHERE appId = " + value + ";", function (error, results, fields) {

    if (error) {
      res.send(JSON.stringify({ "status": 500, "error": error, "response": null }));
      //If there is error, we send the error in the error section with 500 status
    } else {
      res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
      //If there is no error, all is good and response is 200OK.
    }
  });
})

app.post('/api/group', (req, res) => {
  const appId = req.body.appId;
  const groupName = req.body.groupName;
  connection.query("INSERT INTO dashboard.groups (groupName, appId) VALUES('" + groupName + "', "+appId+");", function (error, results, fields) {
    // console.log(value);
    if (error) {
      res.send(JSON.stringify({ "status": 500, "error": error, "response": null }));
      //If there is error, we send the error in the error section with 500 status
    }
    connection.query("SELECT * from dashboard.groups where appId = " + appId + ";", function (error, results, fields) {
      // console.log(value);
      if (error) {
        res.send(JSON.stringify({ "status": 500, "error": error, "response": null }));
        //If there is error, we send the error in the error section with 500 status
      } else {
        res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
        //If there is no error, all is good and response is 200OK.
      }
    });
  });
})

app.delete('/api/group/:id', (req, res) => {

  const data = JSON.parse(req.params.id);
  const groupId = data.groupId;

  connection.query("DELETE FROM dashboard.groups WHERE groupId = " + groupId + ";", function (error, results, fields) {
    if (error) {
      res.send(JSON.stringify({ "status": 500, "error": error, "response": null }));
      //If there is error, we send the error in the error section with 500 status
    }
    connection.query("UPDATE dashboard.services SET groupId = 0 WHERE groupId = "+ groupId +";", function (error, results, fields) {
      if (error) {
        res.send(JSON.stringify({ "status": 500, "error": error, "response": null }));
        //If there is error, we send the error in the error section with 500 status
      } 
      connection.query("SELECT * from dashboard.groups where appId = " + data.appId + ";", function (error, results, fields) {
        if (error) {
          res.send(JSON.stringify({ "status": 500, "error": error, "response": null }));
          //If there is error, we send the error in the error section with 500 status
        } else {
          res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
          //If there is no error, all is good and response is 200OK.
        }
      });
    });
  });
})

// GROUP SERVICES APIs
app.post('/api/groupservices', (req, res) => {
  const appId = req.body.appId;
  const groupId = req.body.groupId;
  const allServices = req.body.isAllServicesSelected;

  let servicesQuery;

  if ( allServices ) {
    servicesQuery = "SELECT * FROM services WHERE  appId = " + appId + ";";  
  } else {
    servicesQuery = "SELECT * FROM services WHERE  appId = " + appId + " AND groupId = "+groupId+";";
  }
  
  connection.query(servicesQuery, function (error, results, fields) {

    if (error) {
      res.send(JSON.stringify({ "status": 500, "error": error, "response": null }));
      //If there is error, we send the error in the error section with 500 status
    } else {
      res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
      //If there is no error, all is good and response is 200OK.
    }
  });
})

app.post('/api/groupservice', (req, res) => {
  const appId = req.body.appId;
  const groupId = req.body.groupId;
  const serviceId = req.body.serviceId;
  const queryToPerform = "UPDATE dashboard.services SET groupId = "+ groupId +" WHERE serviceId = "+ serviceId +";"
  connection.query(queryToPerform, function (error, results, fields) {
    // console.log(value);
    if (error) {
      res.send(JSON.stringify({ "status": 500, "error": error, "response": null }));
      //If there is error, we send the error in the error section with 500 status
    }
    const servicesQuery = "SELECT * FROM services WHERE  appId = " + appId + " AND groupId = "+groupId+";";

    connection.query(servicesQuery, function (error, results, fields) {
      // console.log(value);
      if (error) {
        res.send(JSON.stringify({ "status": 500, "error": error, "response": null }));
        //If there is error, we send the error in the error section with 500 status
      } else {
        res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
        //If there is no error, all is good and response is 200OK.
      }
    });
  });
})

app.delete('/api/groupservice/:id', (req, res) => {

  const data = JSON.parse(req.params.id);
  const appId = data.appId;
  const groupId = data.groupId;
  const serviceId = data.serviceId;

  connection.query("UPDATE dashboard.services SET groupId = 0 WHERE serviceId = "+ serviceId +";", function (error, results, fields) {
    if (error) {
      res.send(JSON.stringify({ "status": 500, "error": error, "response": null }));
      //If there is error, we send the error in the error section with 500 status
    }

    const servicesQuery = "SELECT * FROM services WHERE  appId = " + appId + " AND groupId = "+groupId+";";

    connection.query(servicesQuery, function (error, results, fields) {
      if (error) {
        res.send(JSON.stringify({ "status": 500, "error": error, "response": null }));
        //If there is error, we send the error in the error section with 500 status
      } else {
        res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
        //If there is no error, all is good and response is 200OK.
      }
    });
  });
})

// Connecting to port 3000
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening to port ${port}`);
})
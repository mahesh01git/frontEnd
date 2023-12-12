const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.json());

const dbpath = path.join(__dirname, "todoApplication.db");

db = null;

const instalazation = async () => {
  try {
    db = await open({ filename: dbpath, driver: sqlite3.Database });
    app.listen(3000, () => {
      console.log("server is running on http://localhost:3000/covid-19/");
    });
  } catch (e) {
    console.log(`error ${e.message}`);
    process.exit(1);
  }
};

instalazation();
console.log(db);

const havePriorityAndStatus = (obj) => {
  return obj.priority !== undefined && obj.status !== undefined;
};
const havePriority = (obj) => {
  return obj.priority !== undefined;
};
const haveStatus = (obj) => {
  return obj.status !== undefined;
};

app.get("todos", async (request, response) => {
  const { priority, status, search_q = "" } = request.query;
  let data = null;
  let api1q = "";

  switch (true) {
    case havePriorityAndStatus(request.query):
      api1q = `
            SELECT * 
            FROM 
            todo 
            WHERE 
            todo LIKE '%${search_q}%' 
            AND priority = '${priority}' 
            AND status = '${status}'
            `;

      break;
    case havePriority(request.query):
      api1q = `
            SELECT * 
            FROM 
            todo 
            WHERE 
            todo LIKE '%${search_q}%' 
            AND priority = '${priority}' 
            
            `;
      break;
    case haveStatus(request.query):
      api1q = `
            SELECT * 
            FROM 
            todo 
            WHERE 
            todo LIKE '%${search_q}%' 
             
            AND status = '${status}'
            `;
      break;

    default:
      api1q = `
            SELECT * 
            FROM 
            todo 
            WHERE 
            todo LIKE '%${search_q}%' 
            
            `;
  }

  data = await db.all(api1q);
  response.send(data);
});

module.exports = app;

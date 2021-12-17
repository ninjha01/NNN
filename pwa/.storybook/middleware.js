const express = require("express");
const bodyParser = require("body-parser");
var fs = require("fs");
var path = require("path");

var state = {
  PERSONAL: [
    "* TODO Entry a\n  - [X] add books back to personal",
    "* TODO Entry b\n  - [X] add books back to personal",
    "* TODO Entry c\n  - [X] add books back to personal",
    "* TODO Entry d\n  - [X] add books back to personal",
  ].join("\n"),
  ARCHIVE: [
    "* TODO Archive Entry a\n  - [X] add books back to personal",
    "* TODO Archive Entry b\n  - [X] add books back to personal",
    "* TODO Archive Entry c\n  - [X] add books back to personal",
    "* TODO Archive Entry d\n  - [X] add books back to personal",
  ].join("\n"),
  WORK: [
    "* TODO WORK Entry a\n  - [X] add books back to personal",
    "* TODO WORK Entry b\n  - [X] add books back to personal",
    "* TODO WORK Entry c\n  - [X] add books back to personal",
    "* TODO WORK Entry d\n  - [X] add books back to personal",
  ].join("\n"),
};

const overwriteOrgFile = (newText, key) => {
  state[key] = newText;
};

const prependOrgFile = (newNote, key) => {
  const old = state[key];
  overwriteOrgFile(newNote.trim() + "\n" + old.trim(), key);
};

const replaceInOrgFile = (old_val, new_val, key) => {
  const old = state[key];
  overwriteOrgFile(old.replace(old_val, new_val), key);
};

const archiveOrgItem = (strToArchive, key) => {
  prependOrgFile(strToArchive, "ARCHIVE");
  replaceInOrgFile(strToArchive, "", key);
};

const sendJSONFileAsResponse = (filename, response) => {
  var sampleTxt = path.join(__dirname, filename);
  fs.readFile(sampleTxt, function (error, data) {
    if (error) return console.error(error);
    response.writeHead(200, {
      "Content-Type": "application/json;charset=UTF-8",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "If-Modified-Since",
    });
    response.write(data);
    response.end();
  });
};

const SERVER_DELAY = 5000;

const expressMiddleWare = (router) => {
  router.use(bodyParser.urlencoded({ extended: false }));
  router.use(bodyParser.json());
  /* Org  */
  router.get("/api/org/get/:orgFile", async (request, res) => {
    console.log("called /api/org/get/:orgFile");
    const orgFileKey = request.params.orgFile;
    await new Promise((r) => setTimeout(r, SERVER_DELAY));
    res.send({
      org_raw: state[orgFileKey],
      success: true,
    });
  });
  router.post("/api/org/push", async (req, res) => {
    console.log("called /api/org/push");
    const value = req.body.value;
    const orgFileKey = req.body.org_file_enum;
    overwriteOrgFile(value, orgFileKey);
    await new Promise((r) => setTimeout(r, SERVER_DELAY));
    res.send({
      org_raw: state[orgFileKey],
      success: true,
    });
  });
  router.post("/api/org/archive", async (req, res) => {
    console.log("called /api/org/archive");
    const value = req.body.orgItemText;
    const orgFileKey = req.body.org_file_enum;
    archiveOrgItem(value, orgFileKey);
    await new Promise((r) => setTimeout(r, SERVER_DELAY));
    res.send({
      org_raw: state[orgFileKey],
      success: true,
    });
  });
  router.post("/api/org/add", async (req, res) => {
    console.log("called /api/org/add");
    const value = req.body.value;
    const orgFileKey = req.body.org_file_enum;
    prependOrgFile(value, orgFileKey);
    await new Promise((r) => setTimeout(r, SERVER_DELAY));
    res.send({
      org_raw: state[orgFileKey],
      success: true,
    });
  });
  /* Fitness */
  router.get(
    "/mocked_api/fitness/sleep/users/me/sessions",
    async (request, res) => {
      console.log("called fitness sleep sessions api");
      await new Promise((r) => setTimeout(r, SERVER_DELAY));
      sendJSONFileAsResponse("sleepSessionResponse.json", res);
    }
  );

  router.post(
    "/mocked_api/fitness/sleep/users/me/dataset:aggregate",
    async (request, res) => {
      console.log("called fitness sleep stages api");
      await new Promise((r) => setTimeout(r, SERVER_DELAY));
      sendJSONFileAsResponse("sleepStageResponse.json", res);
    }
  );
};

module.exports = expressMiddleWare;

// const { test, expect } = require("@playwright/test");
// const fs = require('fs')
import { test, expect } from "@playwright/test";
import * as fs from "fs";
import { xlscls } from '../../common/excelconnection';
import { TestRail } from '../../common/testrailconnection';

// let testdataval;
let excelreader;
let tr;
let tr_projectid;
let tr_newRunid;
let testdata;
test.beforeAll(async () => {
  // Launch browser and create a context once for all tests in this describe block
  excelreader = new xlscls('testdata/apitestdata.xlsx', 'Main');
  excelreader.getRowsExcel();

  tr = new TestRail();
  tr_projectid =await tr.getProjects("OLBAPI");

  if (tr_projectid) {
    const tr_newRun = await tr.addRun(
      tr_projectid,
      "Automated Run - " + new Date().toISOString(),
      "Run created by OLB automation"
    );

    console.log("New Run ID:", tr_newRun.id);
    tr_newRunid = tr_newRun.id;
  }
});
test.afterAll(async () => {
  console.log('Cleanup after all tests in this file.');
});
test.beforeEach(async () => {
    const testcasename = test.info().title;
    testdata = excelreader.getTestcaseDetails(testcasename)
});

test.afterEach(async ({ page },testInfo) => {
  console.log(`Finished ${test.info().title} with status ${test.info().status}`);

  const caseid = await tr.getCaseID(tr_projectid,test.info().title);

  const responseStatus = testInfo.annotations.find(a => a.type === "responseStatus");
  const responseBody = testInfo.annotations.find(a => a.type === "responseBody");
  console.log(`responseStatus ${responseStatus}  ${responseBody}`);
  const statusId = testInfo.status === "passed" ? 1 : 5; // 1=Passed, 5=Failed

  await tr.addResult(tr_newRunid,caseid,statusId,"test");
  if (test.info().status !== test.info().expectedStatus)
    console.log(`Did not run as expected, ended up at ${page.url()}`);
});


test("Get OLB", async ({ request },testInfo) => {
  // Get the response and add to it
  const response = await request.get(`${process.env.API_URL}/getolbdetails`); // mock server
  expect(response.status()).toBe(200);
  
  const text = await response.json();
  console.log('Response Text:', text);

  testInfo.annotations.push({ type: "responseStatus", description: String(response.status()) });
  testInfo.annotations.push({ type: "responseBody", description: await response.text() });
});

test("Create OLB", async ({ request },testInfo) => {
    // Get the response and add to it
    const templatename = "olbcreation";
    console.log(test.info().title);
    // let testcasename = test.info().title
    const payloaddata = testdata
    const currentDirectory = process.cwd();

    const templatefilepath = `${currentDirectory}\\testdata\\api_templates\\${templatename}.json`
    // const createdata = require(templatefilepath);
    const fileContents = fs.readFileSync(templatefilepath, "utf-8");
    const createdata = JSON.parse(fileContents);
    
    createdata.name = payloaddata.name;
    createdata.insureamount = payloaddata.amount;
    await fs.promises.writeFile(templatefilepath, JSON.stringify(createdata, null, 2), "utf-8");
    const response = await request.post(`${process.env.API_URL}/createolb`); // mock server
    expect(response.status()).toBe(payloaddata.status);
    const text = await response.json();
    console.log('Response Text:', text);
    
    testInfo.annotations.push({ type: "responseStatus", description: String(response.status()) });
    testInfo.annotations.push({ type: "responseBody", description: await response.text() });
});



const fs = require('fs').promises;
const fetch = require('node-fetch');

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function checkTestStatus(apiUrl, testId) {
  try {
    const response = await fetch(`${apiUrl}/${testId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch test status for test ID ${testId}`);
    }
    const testData = await response.json();
    return testData.status;
  } catch (error) {
    throw new Error(`Failed to check test status for test ID ${testId}: ${error.message}`);
  }
}

async function delayTest() {
  try {
    const data = await fs.readFile('test-config.json', 'utf8');
    const config = JSON.parse(data);
    console.log(`TestName is: ${config.testName}`);

    const response = await fetch('https://1b0y3delb4.execute-api.us-west-2.amazonaws.com/prod/scenarios/');
    if (!response.ok) {
      throw new Error(`Failed to fetch data`);
    }
    const testData = await response.json();
    const test = testData.Items.find(item => item.testName === config.testName);
    if (!test) {
      throw new Error(`Test with name "${config.testName}" not found`);
    }
    console.log(`Test ID: ${test.testId}`);

    const apiUrl = 'https://1b0y3delb4.execute-api.us-west-2.amazonaws.com/prod/scenarios';
    let status = 'RUNNING';

    while (true) {
      status = await checkTestStatus(apiUrl, test.testId);
      console.log(`Test status: ${status}`);
      
      if (status === 'RUNNING' || status === 'running' || status === 'Running') {
        console.log('The test is RUNNING');
      } else if (status === 'failed' || status === 'complete') {
        console.log(`The test has ${status}`);
        console.log('Fetching results...');
        const resultResponse = await fetch(`${apiUrl}/${test.testId}`);
        if (!resultResponse.ok) {
          throw new Error(`Failed to fetch test result for test ID ${test.testId}`);
        }
        const resultData = await resultResponse.json();
        console.log('Test results:', resultData);
        break; // Exit the loop when the test status is not RUNNING or Queued
      }
      
      await delay(2 * 60 * 1000); // Wait for 2 minutes before checking again
    }
  } catch (err) {
    console.error("Error:", err);
  }
}

delayTest();

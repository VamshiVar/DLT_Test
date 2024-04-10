const fs = require('fs').promises;
const fetch = require('node-fetch');

async function delayTest() {
  try {
    const data = await fs.readFile('test-config.json', 'utf8');
    const config = JSON.parse(data);
    console.log(`TestName is: ${config.testName}`);

    // Fetch the test data
    const response = await fetch('https://1b0y3delb4.execute-api.us-west-2.amazonaws.com/prod/scenarios/');
    if (!response.ok) {
      throw new Error(`Failed to fetch data`);
    }
    const testData = await response.json();

    // Find the test by testName and retrieve its testId
    const test = testData.Items.find(item => item.testName === config.testName);
    if (!test) {
      throw new Error(`Test with name "${config.testName}" not found`);
    }

    // Construct the API URL with the retrieved testId
    const apiUrl = `https://1b0y3delb4.execute-api.us-west-2.amazonaws.com/prod/scenarios/${test.testId}`;

    // Fetch the data from the constructed API URL
    const resultResponse = await fetch(apiUrl);
    if (!resultResponse.ok) {
      throw new Error(`Failed to fetch data from ${apiUrl}`);
    }
    const resultData = await resultResponse.json();
    console.log('Data results from API:', resultData);
  } catch (err) {
    console.error("Error:", err);
  }
}

delayTest();

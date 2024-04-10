const fs = require('fs').promises;
const fetch = require('node-fetch');

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
    const test = testData.Items.find(item => item.testName === config.testName); // Removed single quotes from `${config.testName}`
    if (test) {
      console.log(`test id is: "${test.testId}" `); // Moved console.log before the return statement
      return test.testId;
    } else {
      throw new Error(`Failed to fetch test name "${config.testName}"`);
    }
  } catch (err) {
    console.error("Error:", err);
    return null;
  }
}

delayTest();

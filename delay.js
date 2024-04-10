const fs = require('fs').promises;
const fetch = require('node-fetch');

async function delayTest() {
  try {
    const data = await fs.readFile('test-config.json', 'utf8');
    const config = JSON.parse(data);
    console.log(`TestName is: ${config.testName}`); // Use backticks for template literals

    const response = await fetch('https://1b0y3delb4.execute-api.us-west-2.amazonaws.com/prod/scenarios/');
    if (!response.ok) {
      throw new Error(`Failed to fetch data`);
    }
    const testData = await response.json();
    const test = testData.Items.find(item => item.testName === '${config.testName}');
    if (test) {
      return test.testId;
      console.log(`test id is: "${testId}" `);
    } else {
      throw new Error(`Failed to fetch test name "${testName}" `);
    }
    // setTimeout(async () => {
    //   const url = `${config.api_url}${config.test_id}`; // Use backticks for template literals
    //   const response = await fetch(url);
    //   const result = await response.json();
    //   console.log('Data results from API:', result);
    // }, config.hold_for * 60 * 1000);
  } catch (err) {
    console.error("Error:", err); // Fix the syntax error here
    return null;
  }
}

delayTest();

const fs = require('fs').promises;
const fetch = require('node-fetch');

async function delayTest() {
  try {
    const data = await fs.readFile('test-config.json', 'utf8');
    const config = JSON.parse(data);
    console.log(`waiting for ${config.hold_for} sec`); // Use backticks for template literals
    setTimeout(async () => {
      const url = `${config.api_url}${config.test_id}`; // Use backticks for template literals
      const response = await fetch(url);
      const result = await response.json();
      console.log('Data results from API:', result);
    }, config.hold_for * 60 * 1000);
  } catch (err) {
    console.error("Error:", err); // Fix the syntax error here
  }
}

delayTest();

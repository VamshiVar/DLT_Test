const fs = require('fs').promises;
const fetch = require('node-fetch');

async function delayTest() {
  try {
    const data = await fs.readFile('test-config.json', 'utf8');
    const config = JSON.parse(data);
    console.log('waiting for ${config.hold_for} sec');
    setTimeout(async () => {
      const url = '${config.api_url}${config.test_id}';
      const response = await fetch(url);
      const result = await response.json();
      console.log('Data results from API:', result);
    }, config.hold_for * 1000);
  } catch (err) {
    console.error("Error:', err);
                  }
}

delayTest();

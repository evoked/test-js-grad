/**
 * Make the following POST request with either axios or node-fetch:

POST url: http://ambush-api.inyourarea.co.uk/ambush/intercept
BODY: {
    "url": "https://api.npms.io/v2/search/suggestions?q=react",
    "method": "GET",
    "return_payload": true
}

 *******

The results should have this structure:
{
    "status": 200.0,
    "location": [
      ...
    ],
    "from": "CACHE",
    "content": [
      ...
    ]
}

 ******

 *  With the results from this request, inside "content", return
 *  the "name" of the package that has the oldest "date" value
 */

const axios = require('axios');
module.exports = async function oldestPackageName() {
  // TODO
  const { data } = await axios.post('http://ambush-api.inyourarea.co.uk/ambush/intercept', {
    "url": "https://api.npms.io/v2/search/suggestions?q=react",
    "method": "GET",
    "return_payload": true
  })

  // Initialise array
  var nameDate = []

  // Add each key-value (name-date) to array
  data.content.forEach(element => {
    nameDate.push({name: element.package.name, date: element.package.date})
  });

  // Use reduce to return the object with the lowest date
  const name = nameDate.reduce((a,b) => {
    return a.date < b.date ? a : b
  })

  return name.name
};

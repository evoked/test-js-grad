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

 * With the results from this request, inside "content", 
 * list every maintainer and each package name that they maintain,
 * return an array with the following shape:
[
    ...
    {
        username: "a-username",
        packageNames: ["a-package-name", "another-package"]
    }
    ...
]
* NOTE: the parent array and each "packageNames" array should 
* be in alphabetical order.
*/
const axios = require('axios')
module.exports = async function organiseMaintainers() {
	const { data } = await axios.post('http://ambush-api.inyourarea.co.uk/ambush/intercept', {
		"url": "https://api.npms.io/v2/search/suggestions?q=react",
		"method": "GET",
		"return_payload": true
	})

	let contents = []

	data.content.forEach(element => {
		contents.push(element)
	});

	// Initialise two seperate arrays to allow us to create a sorted array of objects later, then 
	// store package names into the index of the respective user.
	let maintainerUsername = []
	let packageMaintainers = []

	contents.forEach(content => {
		const usernames = []
		for(const user of content.package.maintainers) {
			if(!maintainerUsername.includes(user.username)) {
				maintainerUsername.push(user.username)
			}
			usernames.push(user.username)
		}
		packageMaintainers.push({name: content.package.name, usernames: usernames})
	})

	maintainerUsername.sort()

	let maintainers = []

	for(const username of maintainerUsername) {
		maintainers.push({username: username, packageNames: []})
	}

	for(const element of packageMaintainers) {
		for (const user of element.usernames) {
			const index = maintainerUsername.indexOf(user)
			if (index === -1) {
				continue
			}
			maintainers[index].packageNames.push(element.name)
			maintainers[index].packageNames.sort()
		}
	}
	
	return maintainers
};

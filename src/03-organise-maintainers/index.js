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

	// We're going to iterate through every indice in contents, and add usernames to the 
	contents.forEach(content => {
		const usernames = []
		for(const user of content.package.maintainers) {
			// Check if username has already been added to overall user array
			if(!maintainerUsername.includes(user.username)) {
				maintainerUsername.push(user.username)
			}
			// Always push every username into usernames array
			usernames.push(user.username)
		}
		// Finally, add object to packageMaintainers containing package name & all usernames in package
		packageMaintainers.push({name: content.package.name, usernames: usernames})
	})

	// Sort usernames in ascending order using the array sort function
	maintainerUsername.sort()

	let maintainers = []

	// Start creating maintainers array by pushing sorted list of users into seperate objects 
	// & respectively adding a packageName array 
	for(const username of maintainerUsername) {
		maintainers.push({username: username, packageNames: []})
	}

	// Iterate through every object within array consisting of package name and respective users
	for(const element of packageMaintainers) {
		// Iterate through every user in usernames array
		for (const user of element.usernames) {
			// Find the index of the sorted username using the sorted array
			const index = maintainerUsername.indexOf(user)
			if (index === -1) {
				continue
			}
			// Finally, add everything to the maintainers array & iteratively sort them if they have more than 1 contribution
			maintainers[index].packageNames.push(element.name)
			if(maintainers[index].packageNames.length > 1) {
				maintainers[index].packageNames.sort()
			}
		}
	}
	
	return maintainers
};

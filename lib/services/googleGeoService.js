const fetch = require('node-fetch');

function getGoogleData(searchInfo) {
   let loc = searchInfo.location;

   fetch("https://jsonplaceholder.typicode.com/posts")
    .then(response => response.json())
    .then(json => json[0].title)
}

function bye() {
	console.log("Bye!")
}

async function fetchAsync() {
  try {
    let response = await fetch('https://hedgehog-party.herokuapp.com/api/v1/invites');
  let invites = await response.json();
  return invites;
  } catch(err) {
    console.log(err);
  }
}

// This is how we use our async function
fetchAsync()
    .then(data => console.log(data))
    .catch(reason => console.log(reason.message))


module.exports = {
	getGoogleData: getGoogleData,
  fetchAsync: fetchAsync,
	bye: bye
}

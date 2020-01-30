function getGoogleData(searchInfo) {
   let loc = searchInfo.location;

   fetch("https://jsonplaceholder.typicode.com/posts")
    .then(response => response.json())
    .then(result => console.log(result[0].title))
}

function bye() {
	console.log("Bye!")
}


module.exports = {
	getGoogleData: getGoogleData,
	bye: bye
}

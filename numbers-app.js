function get(url) {
	const request = new XMLHttpRequest();
	return new Promise((resolve, reject) => {
		request.onload = function () {
			if (request.readyState !== 4) return;

			if (request.status >= 200 && request.status < 300) {
				resolve({
					data: JSON.parse(request.response),
					status: request.status,
					request: request,
				});
			} else {
				reject({
					msg: "Server Error",
					status: request.status,
					request: request,
				});
			}
		};
		request.onerror = function handleError() {
			reject({
				msg: "NETWORK ERROR",
			});
		};
		request.open("GET", url);
		request.send();
	});
}

function getTrivia(number) {
	let url = `http://numbersapi.com/${number}/trivia?json`;
	return get(url);
}

function promptForNumber() {
	let number = prompt(
		"Enter a number for trivia, or leave blank for a random fact:",
		""
	);
	if (number === null || number.trim() === "") {
		number = "random";
	}
	return number;
}

function displayData(data) {
	const container = document.getElementById("trivia-info");
	container.innerHTML += `<p>${data.text}</p>`;
}

function runTriviaApp() {
	let number = promptForNumber();
	getTrivia(number)
		.then((res) => {
			displayData(res.data);
			let fourCardPromises = [];
			for (let i = 1; i <= 4; i++) {
				fourCardPromises.push(getTrivia(i));
			}

			return Promise.all(fourCardPromises);
		})
		.then((results) => {
			results.forEach((res) => displayData(res.data));
		})
		.catch((err) => console.log(err));
}

runTriviaApp();

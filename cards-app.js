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

function getCard() {
	let url = `https://deckofcardsapi.com/api/deck/new/draw/?count=1`;
	return get(url);
}

// function displayData(data) {
// 	const container = document.getElementById("trivia-info");
// 	container.innerHTML = `<p>${data.text}</p>`;
// }

function runCardApp() {
	getCard()
		.then((res) => {
			console.log(res.data.cards[0].value, " of ", res.data.cards[0].suit);
			let deck_id = res.data.deck_id;
			return get(
				`https://deckofcardsapi.com/api/deck/${deck_id}/draw/?count=1`
			);
		})
		.then((res) => {
			console.log(res.data.cards[0].value, " of ", res.data.cards[0].suit);
		})
		.catch((err) => console.log(err));
}

runCardApp();

let deckId = null;

function getNewDeckAPI() {
	let url = `https://deckofcardsapi.com/api/deck/new/`;
	return get(url);
}

function getNewDeck() {
	return getNewDeckAPI().then((res) => {
		deckId = res.data.deck_id;
		console.log("New deck created. Deck ID:", deckId);
	});
}

function drawCardFromDeck() {
	if (!deckId) {
		console.log("No deck found. Fetching new deck.");
		return getNewDeck()
			.then(() =>
				get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`)
			)
			.then(() =>
				get(
					`https://deckofcardsapi.com/api/deck/${deckId}/shuffle/?remaining=true`
				)
			);
	} else {
		return get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`);
	}
}

function displayCard(data) {
	const cardInfo = document.getElementById("card-info");
	cardInfo.innerHTML = `<p>${data.cards[0].value} of ${data.cards[0].suit}</p>`;
}

document.getElementById("draw-card").addEventListener("click", () => {
	drawCardFromDeck()
		.then((res) => {
			displayCard(res.data);
		})
		.catch((err) => console.log(err));
});

export function addGradient(json: string) {
	fetch("/addGradient", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: json,
	});
}

export function removeGradient(name: string) {
	fetch("/removeGradient", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ gradient: name }),
	});
}

export async function getGradients() {
	const response = await fetch("/getGradients");
	const gradientArray = await response.json();
	return gradientArray;
}

export function editGradient(json: string) {
	fetch("/editGradient", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: json,
	});
}

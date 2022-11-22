export function addGradient(json) {
	fetch("/addGradient", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: json,
	});
}

export async function getGradients() {
	const response = await fetch("/getGradients");
	const gradientArray = await response.json();
	return gradientArray;
}

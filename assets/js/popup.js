const text = document.getElementById('notify-text');
const notify = document.getElementById('notify-button');
const reset = document.getElementById('notify-reset');
const counter = document.getElementById('notify-count');
const scanButton = document.getElementById('scan-button');
const tokensRemaining = document.getElementById('tokens-remaining');

chrome.storage.local.get(['notifyCount', 'tokensRemaining'], data => {
	let notifyValue = data.notifyCount || 0;
	let tokensValue = data.tokensRemaining || 1000;
	counter.innerHTML = notifyValue;
	tokensRemaining.innerHTML = tokensValue;
});

chrome.storage.onChanged.addListener((changes, namespace) => {
	if (changes.notifyCount) {
		let value = changes.notifyCount.newValue || 0;
		counter.innerHTML = value;
	}
	if (changes.tokensRemaining) {
		let value = changes.tokensRemaining.newValue || 0;
		tokensRemaining.innerHTML = value;
	}
});

reset.addEventListener('click', () => {
	chrome.storage.local.clear();
	text.value = '';
	counter.innerHTML = '0';
	tokensRemaining.innerHTML = '1000';
});

notify.addEventListener('click', () => {
	chrome.runtime.sendMessage('', {
		type: 'notification',
		message: text.value
	});
});

scanButton.addEventListener('click', () => {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {action: "scanText"});
	});
});

// Simulate token usage (remove this in production and implement actual token tracking)
function simulateTokenUsage() {
	chrome.storage.local.get(['tokensRemaining'], data => {
		let tokens = data.tokensRemaining || 1000;
		if (tokens > 0) {
			tokens -= 10; // Simulate using 10 tokens per scan
			chrome.storage.local.set({tokensRemaining: tokens});
		}
	});
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.type === 'scanResult') {
		simulateTokenUsage();
	}
});
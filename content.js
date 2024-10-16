chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "scanText") {
    const pageText = document.body.innerText;
    processTextWithAI(pageText);
  }
});

async function processTextWithAI(text) {
  // This is a mock AI processing function
  // In a real-world scenario, you would send this text to an AI service API
  const mockAIResponse = await mockAIProcessing(text);
  
  chrome.runtime.sendMessage({
    type: 'scanResult',
    message: mockAIResponse
  });
}

function mockAIProcessing(text) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const wordCount = text.split(/\s+/).length;
      const sentiment = Math.random() < 0.5 ? "positive" : "negative";
      resolve(`AI Scan Result: ${wordCount} words, Sentiment: ${sentiment}`);
    }, 1000); // Simulate a delay for AI processing
  });
}
//  Put all the javascript code here, that you want to execute in background.
console.log("Hello from your Browser extension! - Background script");

// OAuth Logic
let accessToken;

function getAuthToken() {
  browser.identity.getAuthToken({ 'interactive': true }, function(token) {
    if (chrome.runtime.lastError) {
      console.log(chrome.runtime.lastError);
      return;
    }
    // Token received
    accessToken = token;
    // Store the token or use it for API calls
    browser.storage.local.set({ 'accessToken': token });
  });
}

// Fetch stored token on extension load
browser.storage.local.get('accessToken', function(data) {
  accessToken = data.accessToken;
});

// Listen to some trigger to start OAuth
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getAuthToken") {
    getAuthToken();
  }
});

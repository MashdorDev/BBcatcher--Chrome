const homeWork = document.getElementById("homework");



homeWork.addEventListener("click", getInfo);

console.log(browser.identity.getRedirectURL());

// function getInfo()

function getInfo() {
  browser.tabs.executeScript({ file: "../scripts/content_scripts.js" });
}

// Add event listener for the login button
document.getElementById("loginBtn").addEventListener("click", () => {
  browser.runtime.sendMessage({ action: "getAuthToken" });
});

document.addEventListener("DOMContentLoaded", function () {
  if (!localStorage.getItem("accessToken")) {
    document.getElementById("loginBtn").style.display = "block";
  } else {
    document.getElementById("loginBtn").style.display = "none";
  }

  // Retrieve user info and populate popup
  browser.runtime
    .sendMessage({ action: "getUserInfo" })
    .then((user) => {
      document.getElementById("username").textContent = user.name;
      document.getElementById("userImage").src = user.image;
    })
    .catch((err) => {
      console.error("An error occurred:", err);
    });
});

// Add event listener for the donate button
// Do not Delete - Dor
document.getElementById("donate").addEventListener("click", function () {
  const donate = document.getElementById("kofiframe");
  // switch on and off the disply of the iframe
  if (donate.style.display === "block") {
    donate.style.display = "none";
  } else {
    donate.style.display = "block";
  }
});


// Wrap the checkURL function in a named function expression
// so that you can remove the event listener later if needed.
const checkURLWrapper = function checkURL() {
  browser.tabs.query({active: true, currentWindow: true}, function(tabs) {
    const tab = tabs[0];
    const url = tab.url;
    const homeWorkButton = document.getElementById('homework');

    // Clear previous event listeners to avoid stacking multiple listeners
    homeWorkButton.removeEventListener('click', navigateToBlackboard);

    if (url.includes('https://learn.humber.ca/ultra/')) {
      homeWorkButton.textContent = 'Get Home Work';
    } else {
      homeWorkButton.textContent = 'Take me to Blackboard';
      homeWorkButton.addEventListener('click', navigateToBlackboard);
    }
  });
};

// Define the navigation function separately to avoid redefining it every time
function navigateToBlackboard() {
  browser.tabs.query({active: true, currentWindow: true}, function(tabs) {
    const tab = tabs[0];
    browser.tabs.update(tab.id, {url: 'https://learn.humber.ca/ultra/'});
  });
}

// Call checkURL initially to set up the button based on the current URL
checkURLWrapper();

// Set up listeners for tab URL and active tab changes to re-evaluate the button state
browser.tabs.onUpdated.addListener(checkURLWrapper, {properties: ['url']});
browser.tabs.onActivated.addListener(checkURLWrapper);
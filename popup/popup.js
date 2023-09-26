document.getElementById("homework").addEventListener("click", getInfo);


// console.log(browser.identity.getRedirectURL());

// function getInfo()

function getInfo() {
    browser.tabs
  .executeScript({ file: "../scripts/content_script.js" })
}



// Add event listener for the login button
document.getElementById("loginBtn").addEventListener("click", () => {
  browser.runtime.sendMessage({ action: "getAuthToken" });
});

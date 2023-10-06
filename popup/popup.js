document.getElementById("homework").addEventListener("click", getInfo);

console.log(browser.identity.getRedirectURL());

// function getInfo()

function getInfo() {
  browser.tabs.executeScript({ file: "../scripts/content_script.js" });
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
  } else{
    donate.style.display = "block";
  }
});


browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "ADD_TO_CALENDAR") {
    handleAddToCalendar(message, sendResponse);
  } else if (message.action === "getAuthToken") {
    getAccessToken()
      .then(tokenObj => {
        console.log("Token object received: ", tokenObj);
        const actualToken = tokenObj.access_token; // Extract the actual token string
        console.log("Token received: ", actualToken);
        localStorage.setItem('accessToken', tokenObj); // Save the access token to local storage
        return actualToken;
      })
      .then(getUserInfo)
      .then(notifyUser)
      .catch(logError);
  } else if(message.action === "getUserInfo"){
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    console.log("User info found in local storage: ", userInfo);

    if (userInfo) {
      sendResponse({ name: userInfo.name, image: userInfo.picture });
    }

  } else {
    console.error("No message type found");
  }
});

function notifyUser(user) {
  browser.notifications.create({
    "type": "basic",
    "title": "Google info",
    "message": `Hi ${user.name}`
  });}

function logError(error) {
  console.error(`Error: ${error}`);
}

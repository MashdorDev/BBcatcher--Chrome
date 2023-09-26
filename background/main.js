
// // Helper function to initialize Google API
// async function initializeGoogleApi() {
//   return new Promise((resolve, reject) => {
//     const script = document.createElement("script");
//     script.src = "https://apis.google.com/js/client.js";
//     script.onload = () => {
//       gapi.load("client:auth2", () => {
//         gapi.client.init({
//           clientId: "597587515735-9gfojisq4ih1o5mi1cj9a8h0dpqu70a7.apps.googleusercontent.com",
//           scope: "https://www.googleapis.com/auth/calendar"
//         })
//         .then(resolve)
//         .catch(reject);
//       });
//     };
//     script.onerror = () => reject(new Error("Failed to load Google API script"));
//     document.head.appendChild(script);
//   });
// }

// // Function to get Access Token
// async function getAccessToken() {
//   return new Promise((resolve, reject) => {
//     browser.identity.getAuthToken({ 'interactive': true }, function(token) {
//       if (browser.runtime.lastError) {
//         reject(browser.runtime.lastError);
//       } else {
//         resolve(token);
//       }
//     });
//   });
// }

// // Function to get User Info
// async function getUserInfo(accessToken) {
//   console.log("Access Token:", accessToken);
//   // Your logic to get user info goes here. It could be an API call using the access token.
// }

// // Function to handle Get User Info
// async function handleGetUserInfo(message, sendResponse) {
//   try {
//     const accessToken = await getAccessToken();
//     const userInfo = await getUserInfo(accessToken);
//     sendResponse({ status: "OK", userInfo });
//   } catch (error) {
//     sendResponse({ status: "ERROR", error });
//     logError(error);
//   }
// }

// // Helper function to add individual event to Google Calendar
// async function addEventToCalendar(event) {
//   return gapi.client.calendar.events.insert({
//     calendarId: "primary",
//     resource: event
//   }).then(response => response.result);
// }

// // Main function to send events to Google Calendar
// async function sendEventsToGoogleCalendar(dueDates) {
//   await initializeGoogleApi();
//   for (const dueDate of dueDates) {
//     const event = {
//       summary: dueDate.dueName,
//       description: `${dueDate.courseName} (${dueDate.courseCode})`,
//       start: { dateTime: new Date(dueDate.dueDate).toISOString(), timeZone: "America/Toronto" },
//       end: { dateTime: new Date(dueDate.dueDate).toISOString(), timeZone: "America/Toronto" }
//     };
//     try {
//       const result = await addEventToCalendar(event);
//       console.log(`Event created: ${result.htmlLink}`);
//     } catch (error) {
//       console.error("Error adding event to calendar:", error);
//     }
//   }
// }

// async function notifyUser(user) {
//   try {
//     await browser.notifications.create({
//       type: "basic",
//       title: "Google info",
//       message: `Hi ${user.name}`
//     });
//   } catch (error) {
//     console.error("Notification Error:", error);
//   }
// }

// function logError(error) {
//   console.error(`Error: ${error}`);
//   browser.notifications.create({
//     type: "basic",
//     title: "An error occurred",
//     message: `Error: ${error}`
//   });
// }

// async function handleBrowserActionClick() {
//   try {
//     const accessToken = await getAccessToken();
//     const userInfo = await getUserInfo(accessToken);
//     await notifyUser(userInfo);
//   } catch (error) {
//     logError(error);
//   }
// }

// async function handleAddToCalendar(message, sendResponse) {
//   try {
//     await sendEventsToGoogleCalendar(message.data);
//     sendResponse({ status: "OK" });
//   } catch (error) {
//     sendResponse({ status: "ERROR", error });
//     logError(error);
//   }
// }

// browser.browserAction.onClicked.addListener(handleBrowserActionClick);

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "ADD_TO_CALENDAR") {
    handleAddToCalendar(message, sendResponse);
  } else if (message.action === "getAuthToken") {
    getAccessToken()
      .then(tokenObj => {
        console.log("Token object received: ", tokenObj);
        const actualToken = tokenObj.access_token; // Extract the actual token string
        console.log("Token received: ", actualToken);
        return actualToken;
      })
      .then(getUserInfo)
      .then(notifyUser)
      .catch(logError);
  } else {
    console.error("No message type found");
  }
});


// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

/*global getAccessToken*/

function notifyUser(user) {
  browser.notifications.create({
    "type": "basic",
    "title": "Google info",
    "message": `Hi ${user.name}`
  });}

function logError(error) {
  console.error(`Error: ${error}`);
}

/**
When the button's clicked:
- get an access token using the identity API
- use it to get the user's info
- show a notification containing some of it
*/

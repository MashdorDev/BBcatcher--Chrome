// Helper function to initialize Google API
async function initializeGoogleApi() {
  return new Promise((resolve, reject) => {
    // Create a script element to load the Google API JavaScript client
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/client.js";

    // Listen for the script load event
    script.onload = () => {
      // Initialize the Google API client
      gapi.load("client:auth2", () => {
        gapi.client
          .init({
            clientId: "YOUR_CLIENT_ID_HERE",
            scope: "https://www.googleapis.com/auth/calendar",
          })
          .then(() => {
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
    };

    // Handle any errors that occur during script loading
    script.onerror = (error) => {
      reject(new Error("Failed to load Google API script"));
    };

    // Add the script element to the document to start loading the script
    document.head.appendChild(script);
  });
}

// Helper function to add individual event to Google Calendar
async function addEventToCalendar(event) {
  return new Promise((resolve, reject) => {
    gapi.client.calendar.events
      .insert({
        calendarId: "primary",
        resource: event,
      })
      .then((response) => {
        resolve(response.result);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

// Main function to send events to Google Calendar
async function sendEventsToGoogleCalendar(dueDates) {
  await initializeGoogleApi();

  for (const dueDate of dueDates) {
    const event = {
      summary: dueDate.dueName,
      description: `${dueDate.courseName} (${dueDate.courseCode})`,
      start: {
        dateTime: new Date(dueDate.dueDate).toISOString(),
        timeZone: "America/Toronto",
      },
      end: {
        dateTime: new Date(dueDate.dueDate).toISOString(),
        timeZone: "America/Toronto",
      },
    };

    try {
      const result = await addEventToCalendar(event);
      console.log(`Event created: ${result.htmlLink}`);
    } catch (error) {
      console.error("Error adding event to calendar:", error);
    }
  }
}

// Existing functions
async function notifyUser(user) {
  try {
    await browser.notifications.create({
      type: "basic",
      title: "Google info",
      message: `Hi ${user.name}`,
    });
  } catch (error) {
    console.error("Notification Error:", error);
  }
}

function logError(error) {
  console.error(`Error: ${error}`);
  browser.notifications.create({
    type: "basic",
    title: "An error occurred",
    message: `Error: ${error}`,
  });
}

async function handleBrowserActionClick() {
  try {
    const accessToken = await getAccessToken();
    const userInfo = await getUserInfo(accessToken);
    await notifyUser(userInfo);
  } catch (error) {
    logError(error);
  }
}

async function handleAddToCalendar(message, sendResponse) {
  try {
    await sendEventsToGoogleCalendar(message.data);
    sendResponse({ status: "OK" });
  } catch (error) {
    sendResponse({ status: "ERROR", error });
    logError(error);
  }
}

// Event listeners
browser.browserAction.onClicked.addListener(handleBrowserActionClick);

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Listener Fired");
  if (message.type === "ADD_TO_CALENDAR") {
    handleAddToCalendar(message, sendResponse);
  }
});

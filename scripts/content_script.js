const BLACKBOARD_URL = "https://learn.humber.ca/ultra/calendar";

// Main function to execute the script
async function main() {
  if (window.location.href !== BLACKBOARD_URL) {
    navigateToBlackboard();
    return;
  }

  lockScreen();

  try {
    await clickDeadline();
    const dueDates = await fetchAndFormatDueDates();
    unlockScreen();
    console.log(dueDates);
    chrome.runtime.sendMessage({type: 'ADD_TO_CALENDAR', data: dueDates});
  } catch (error) {
    console.error("Error in main:", error);
    unlockScreen();
  }
}

// Navigate to the Blackboard calendar URL
function navigateToBlackboard() {
  window.location.href = BLACKBOARD_URL;
}

// Click the deadline element on the Blackboard calendar
async function clickDeadline() {
  const deadlineElement = document.getElementById("bb-calendar1-deadline");
  if (!deadlineElement) {
    throw new Error("Deadline element not found.");
  }
  deadlineElement.click();
}

// Fetch and format due dates from the Blackboard calendar
async function fetchAndFormatDueDates() {
  await scrollToBottom();
  const dueDates = await formatInfo();
  return dueDates;
}

// Lock the screen while processing
function lockScreen() {
  // Your existing lockScreen code here

  const lockScreen = document.createElement("div");
  lockScreen.id = "lockScreen";
  lockScreen.style.position = "fixed";
  lockScreen.style.top = "0";
  lockScreen.style.left = "0";
  lockScreen.style.width = "100%";
  lockScreen.style.height = "100%";
  lockScreen.style.backgroundColor = "rgba(0,0,0,0.5)";

  const lockScreenText = document.createElement("div");
  lockScreenText.id = "lockScreenText";
  lockScreenText.style.position = "absolute";
  lockScreenText.style.top = "60%";
  lockScreenText.style.left = "50%";
  lockScreenText.style.transform = "translate(-50%, 50%)";
  lockScreenText.style.color = "white";
  lockScreenText.style.fontSize = "30px";
  lockScreenText.style.fontWeight = "bold";
  lockScreenText.innerText = "Loading...";

let figure = document.createElement("figure");
let dot1 = document.createElement("div");
let dot2 = document.createElement("div");
let dot3 = document.createElement("div");
let dot4 = document.createElement("div");
let dot5 = document.createElement("div");

dot1.classList.add("dot", "white");
dot2.classList.add("dot");
dot3.classList.add("dot");
dot4.classList.add("dot");
dot5.classList.add("dot");

figure.appendChild(dot1);
figure.appendChild(dot2);
figure.appendChild(dot3);
figure.appendChild(dot4);
figure.appendChild(dot5);

lockScreen.appendChild(figure);


lockScreen.appendChild(lockScreenText);
document.body.appendChild(lockScreen);
  console.log(lockScreen);
}

// Unlock the screen after processing
function unlockScreen() {

  const lockScreen = document.getElementById("lockScreen");
  lockScreen.style.fade
  lockScreen.remove();
}

// Scroll to the bottom of the Blackboard calendar to load all items
async function scrollToBottom() {

  return new Promise((resolve, reject) => {
    var startTime, endTime;
    let previousList = 0;

    function start() {
      startTime = new Date();
      console.log("startTime");
    }

    function end() {
      endTime = new Date();
      var timeDiff = endTime - startTime; //in ms
      // strip the ms
      timeDiff /= 1000;

      // get seconds
      var seconds = Math.round(timeDiff);
      console.log(seconds + " seconds");
      return seconds;
    }

    start();

    const scrollWindow = window.setInterval(function () {
      console.log("%cScrolling", "color: green; font-size: 20px");
      const deadlineContainer =
        document.getElementById("deadlineContainer").childNodes[0].childNodes[3]
          .childNodes[1];

      deadlineContainer.scrollTop =
        deadlineContainer.childNodes[1].childNodes[length - 1].offsetTop;
      let NumScroll = deadlineContainer.childNodes[1].childNodes.length;
      scrollingElement =
        deadlineContainer.childNodes[1].childNodes[NumScroll - 2].offsetTop;
      deadlineContainer.scrollTop = scrollingElement;

      console.log(end() >= 5, "currentList > previousList");
      if (end() > 5) {
        console.log("%cDone scrolling", "color: green; font-size: 20px");
        clearInterval(scrollWindow);
        console.log("%cDeleted interval", "color: green; font-size: 20px");
        resolve();
      }
    }, 500);
  });
}

// Format the information about due dates
async function formatInfo() {
  const items = document.getElementsByClassName("deadlines");
  if (!items || items.length === 0) {
    throw new Error("No deadlines found.");
  }

  let itemsArray = items[0].children[0].children[0].children;
  itemsArray = Array.from(itemsArray).filter((item) => item.childElementCount === 2);

  const dueDates = [];

  for (const item of itemsArray) {
    const elements = Array.from(item.children[1].children[0].children);
    for (const element of elements) {
      const infoElements = element.children[1].children;
      const baseURL = "https://learn.humber.ca/ultra/courses/";
      const courseCode = infoElements[1].lastElementChild.href.split("/")[5];

      const dueObject = {
        courseName: infoElements[1].innerText.split(":")[3],
        courseCode: infoElements[1].innerText.split("∙")[1].split(": ")[0],
        dueName: infoElements[0].innerText.split(",")[0],
        dueDate: infoElements[1].innerText.split(":")[1].split(",")[0],
        dueTime: infoElements[1].innerText.split("∙")[0].split(","),
        courseLink: `${baseURL}${courseCode}/outline`,
      };

      dueDates.push(dueObject);
    }
  }

  return dueDates;
}

// Entry point
main().catch((error) => {
  console.error("Error in script:", error);
});
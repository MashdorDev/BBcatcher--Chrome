// Put all the javascript code here, that you want to execute after page load.

console.log("Hello from your Chrome extension! - Content script");
currentUrl = window.location.href;

if (currentUrl == "https://learn.humber.ca/ultra/calendar") {
  console.log("inside if statement");
  main();
}else{
  console.log("inside else statement");
  window.location.href = "https://learn.humber.ca/ultra/calendar" ;


}


// let working = true;

//  intervalID = setTimeout(main, 4000);
// while (working) {
//   console.log("inside while loop");
//   main();
// }
// main();

async function main() {
    console.log("inside main");
    document.getElementById("bb-calendar1-deadline").click();
    console.log(document.getElementById("bb-calendar1-deadline"));
    const items = document.getElementsByClassName("due-item-block");
    let resolvedItems;
    if (!items) {
      console.log(
        "%cno items",
        "color: red; background: yellow; font-size: 30px"
      );
      main();
    } else {
      lockScreen();
      const resolvedItems = await getInfo();
      console.log("Line 28");
      const formattedInfo = await formatInfo(resolvedItems);
      console.log(formattedInfo, "formattedInfo");
      unlockScreen();
      delete intervalID;
      working = false;
    }
}

function unlockScreen() {
  const lockScreen = document.getElementById("lockScreen");
  lockScreen.style.fade
  lockScreen.remove();
}

function lockScreen() {
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

function getInfo() {
  return new Promise(async (resolve, reject) => {
    const items = await scrollToBottom();
    console.log("%cdone getting Info", "color: green; font-size: 20px");
    resolve(items);
  });
}

function scrollToBottom() {
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

function formatInfo(items) {
  return new Promise((resolve, reject) => {
    const items = document.getElementsByClassName("deadlines");
    let itemsArray = items[0].children[0].children[0].children;
    itemsArray = Array.from(itemsArray).filter(
      (item) => item.childElementCount == 2
    );

    let dueDates = [];
    const newArray = itemsArray.map((item, i) => {
      item = [...item.children[1].children[0].children];

      item.map((item, i) => {
        item = item.children[1].children;

        baseURL = "https://learn.humber.ca/ultra/courses/";
        courseCode = item[1].lastElementChild.href.split("/")[5];

        let dueObject = {
          courseName: item[1].innerText.split(":")[3],
          courseCode: item[1].innerText.split("∙")[1].split(": ")[0],
          dueName: item[0].innerText.split(",")[0],
          dueDate: item[1].innerText.split(":")[1].split(",")[0],
          dueTime: item[1].innerText.split("∙")[0].split(","),
          courseLink: baseURL + courseCode + "/outline",
        };

        dueDates.push(dueObject);
      });
    });
    resolve(dueDates);
  });
}


console.log("end of code");
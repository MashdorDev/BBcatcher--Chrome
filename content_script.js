// Put all the javascript code here, that you want to execute after page load.

console.log("Hello from your Chrome extension! - Content script");
currentUrl = window.location.href;

if (currentUrl !== "https://learn.humber.ca/ultra/calendar") {
  window.location.href = "https://learn.humber.ca/ultra/calendar";
} else {
  console.log("inside else");
  main();
}

const intervalID = setTimeout(main, 4000);

async function main() {
  document.getElementById("bb-calendar1-deadline").click();
  const items = document.getElementsByClassName("due-item-block");
  let resolvedItems;

  if (!items) {
    console.log(
      "%cno items",
      "color: red; background: yellow; font-size: 30px"
    );
    main();
  } else {
    const resolvedItems = await getInfo();
    console.log("Line 28         ");
    const formattedInfo = await formatInfo(resolvedItems);
    console.log(formattedInfo, "formattedInfo");
  }
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
    const scrollWindow = window.setInterval(function () {
      const deadlineContainer =
        document.getElementById("deadlineContainer").childNodes[0].childNodes[3]
          .childNodes[1];

      deadlineContainer.scrollTop =
        deadlineContainer.childNodes[1].childNodes[length - 1].offsetTop;
      let NumScroll = deadlineContainer.childNodes[1].childNodes.length;
      scrollingElement =
        deadlineContainer.childNodes[1].childNodes[NumScroll - 2].offsetTop;
      deadlineContainer.scrollTop = scrollingElement;
      if (
        deadlineContainer.childNodes[1].childNodes[41].nodeName == "#comment"
      ) {
        console.log("%cDone scrolling", "color: green; font-size: 20px");
        clearInterval(scrollWindow);
        console.log("%cdeleted interval", "color: green; font-size: 20px");

        // const items = document.getElementsByClassName("due-item-block");
        // console.log(items, "items");
        resolve();
      }
    }, 1000);

    // console.log(document.getElementById("deadlineContainer").childNodes[0]);
    // const items = document.getElementsByClassName("due-item-block");
    // if (document.getElementById("deadlineContainer").childNodes[0].childNodes[3]
    // .childNodes[1].childNodes[1].childNodes[41].nodeName == "#comment"
    // ) {
    //   resolve(items);
    // }
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

document.getElementById("homework").addEventListener("click", getInfo);


// function getInfo()

function getInfo() {
    console.log("Hello from getinfo");


    browser.tabs
  .executeScript({ file: "../scripts/content_script.js" })
}


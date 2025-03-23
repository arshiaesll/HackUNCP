//grabs page text
const pageText = document.body.innerText;

//send a message to the background script to summarize
chrome.runtime.sendMessage({
  type: "summarizePage",
  text: pageText
});

//listens for summary result
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "summaryResult") {
    displaySummary(request.summary);
  }
});

//displays summary in a side box
function displaySummary(summary) {
  let summaryBox = document.getElementById("ai-summary-box");
  if (!summaryBox) {
    summaryBox = document.createElement("div");
    summaryBox.id = "ai-summary-box";
    
    summaryBox.style.position = "fixed";
    summaryBox.style.right = "0px";
    summaryBox.style.top = "100px";
    summaryBox.style.width = "300px";
    summaryBox.style.border = "1px solid #ccc";
    summaryBox.style.background = "#fff";
    summaryBox.style.padding = "10px";
    summaryBox.style.zIndex = "9999";
    
    document.body.appendChild(summaryBox);
  }
  
  //updates text
  summaryBox.innerText = summary;
}
/** event listener for scrolling
 * resends partial text to background to summarize */ 

let currentSection = "";
window.addEventListener("scroll", () => {
  const section = findSectionInView();
  if (section !== currentSection) {
    currentSection = section;
    chrome.runtime.sendMessage({
      type: "summarizePage",
      text: section
    });
  }
});

function findSectionInView() {
  return document.body.innerText;
}
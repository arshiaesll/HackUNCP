//Listen for messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "summarizePage") {
      //Call an external API or local function to summarize text
      getSummary(request.text)
        .then(summary => {
          //Send the summary back to the content script
          chrome.tabs.sendMessage(sender.tab.id, {
            type: "summaryResult",
            summary: summary
          });
        })
        .catch(err => console.error(err));
    }
  });
  
  //Example function that might call an external API
  async function getSummary(text) {
    //e.g., fetch("https://example.com/api/summarize", { method: "POST", ... })
    return "This is the (mock) summary of the text.";
  }
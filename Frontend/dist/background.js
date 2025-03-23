chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "PAGE_HTML") {
      const receivedHtml = request.payload;
      console.log("Received HTML from content script:", receivedHtml);

      //need something like 
      // fetch("https://whatever", {
      //   method: "POST",
      //   body: JSON.stringify({ html: receivedHtml }),
      //   headers: { "Content-Type": "application/json" }
      // });
    }
  });
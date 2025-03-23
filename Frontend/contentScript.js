/*
dont know if we actually need but 
get entire html as text:
gets all elements head and body then prints
*/ 
const fullHTML = document.documentElement.outerHTML;
console.log(fullHTML);
// logs all paragraph elements 
const allparagraphs = document.getElementsByTagName("p")
console.log(allparagraphs)
//finds all things like ex headers
const mainheading = document.querySelector("h1");
if (mainheading){
    console.log(mainheading.innerText)
}

/*sends the entire html to the chrome extensions 
fetching the entire HTML sends string (htmlData) as a message to the extension with chrome.runtime.sendMessage. can capture this message code to process/store HTML.
*/

const htmlData = document.documentElement.outerHTML;
chrome.runtime.sendMessage({ type: "PAGE_HTML", payload: htmlData });
chrome.action.onClicked.addListener(tab =>
  {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: addFurigana
    });
});

const KNOWN_READING = "knownReading";
const KNOWN_MEANING = "knownMeaning";
const KNOWN_ALL = "knownAll";
const REMOVE_READING = "removeReading";
const REMOVE_MEANING = "removeMeaning";
const REMOVE_ALL = "removeAll";
const EXPORT_DICTIONARY = "exportDictionary";

chrome.contextMenus.create({
  title: "Hide furigana (known reading)",
  contexts: ['selection'],
  id: KNOWN_READING
});

chrome.contextMenus.create({
  title: "Hide translation (known meaning)",
  contexts: ['selection'],
  id: KNOWN_MEANING
});

chrome.contextMenus.create({
  title: "Hide furigana and translation (known reading and meaning)",
  contexts: ['selection'],
  id: KNOWN_ALL
});

chrome.contextMenus.create({
  title: "Show furigana (unknown reading)",
  contexts: ['selection'],
  id: REMOVE_READING
});

chrome.contextMenus.create({
  title: "Show translation (unknown meaning)",
  contexts: ['selection'],
  id: REMOVE_MEANING
});

chrome.contextMenus.create({
  title: "Show furigana and translation (unknown reading and meaning)",
  contexts: ['selection'],
  id: REMOVE_ALL
});

chrome.contextMenus.create({
  title: "Export dictionary",
  contexts: ['all'],
  id: EXPORT_DICTIONARY
});

function onClickHandler(info, tab) {
  if (info.menuItemId === KNOWN_READING) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: 
        function() {
          getElementAndApply(addReadingToDictionary);
        }
    });
  }
  else if (info.menuItemId === KNOWN_MEANING) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: 
        function() {
          getElementAndApply(addMeaningToDictionary);
        }
    });
  }
  else if (info.menuItemId === KNOWN_ALL) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: 
        function() {
          getElementAndApply(addWordToDictionary);
        }
    });
  }
  else if (info.menuItemId === REMOVE_READING) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: 
        function() {
          getElementAndApply(removeReadingFromDictionary);
        }
    });
  }
  else if (info.menuItemId === REMOVE_MEANING) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: 
        function() {
          getElementAndApply(removeMeaningFromDictionary);
        }
    });
  }
  else if (info.menuItemId === REMOVE_ALL) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: 
        function() {
          getElementAndApply(removeWordFromDictionary);
        }
    });
  }
  else if (info.menuItemId === EXPORT_DICTIONARY) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: 
        function() {
          exportDictionary();
        }
    });
  }
}

chrome.contextMenus.onClicked.addListener(onClickHandler);
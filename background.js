chrome.action.onClicked.addListener(tab =>
  {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: addFurigana
    });
});

var dictionary = {};

// Save the dictionary to chrome.storage
function saveDictionary() {
    chrome.storage.local.set({'dictionary': dictionary}, function() {
        console.log('Dictionary saved');
    });
}

// Retrieve the dictionary from chrome.storage
function getDictionary() {
    chrome.storage.local.get('dictionary', function(result) {
        dictionary = result.dictionary || {};
        console.log('Dictionary retrieved:', dictionary);
    });
}

// Check if a word is in the dictionary
function isWordInDictionary(word) {
    return !!dictionary[word];
}

function addWordToDictionary(word) {
    // Your code to add the word to the dictionary
   //chrome.storage.local.get("dictionary", function(items) {
   //    var dictionary = items.dictionary || [];
   //    dictionary.push(word);
   //    chrome.storage.local.set({"dictionary": dictionary});
   //});
    console.log(word);
}

const CONTEXT_MENU_ID = "ADD_TO_DICTIONARY";

chrome.contextMenus.create({
  title: "Add to dictionary",
  contexts: ['all'],
  id: CONTEXT_MENU_ID
});

function onClickHandler(info, tab) {
  if (info.menuItemId === CONTEXT_MENU_ID) {
    console.log("Word " + info.selectionText + " was clicked.");
    addWordToDictionary(info.selectionText);
  }
}

chrome.contextMenus.onClicked.addListener(onClickHandler);

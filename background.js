chrome.action.onClicked.addListener(tab =>
  {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: addFurigana
    });
});

//var dictionary = {};
//
//// Save the dictionary to chrome.storage
//function saveDictionary() {
//    chrome.storage.local.set({'dictionary': dictionary}, function() {
//        console.log('Dictionary saved');
//    });
//}
//
//// Retrieve the dictionary from chrome.storage
//function getDictionary() {
//    chrome.storage.local.get('dictionary', function(result) {
//        dictionary = result.dictionary || {};
//        console.log('Dictionary retrieved:', dictionary);
//    });
//}
//
//// Check if a word is in the dictionary
//function isWordInDictionary(word) {
//    return !!dictionary[word];
//}


const KNOWN_READING = "knownReading";
const KNOWN_MEANING = "knownMeaning";

chrome.contextMenus.create({
  title: "Hide furigana",
  contexts: ['all'],
  id: KNOWN_READING
});

chrome.contextMenus.create({
  title: "Hide translation",
  contexts: ['all'],
  id: KNOWN_MEANING
});

function onClickHandler(info, tab) {
  if (info.menuItemId === KNOWN_READING) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: 
        function() {
            function addWordToDictionary(word) {
              // Your code to add the word to the dictionary
              //chrome.storage.local.get("dictionary", function(items) {
              //    var dictionary = items.dictionary || [];
              //    dictionary.push(word);
              //    chrome.storage.local.set({"dictionary": dictionary});
              //});
              console.log(word);
            }

            var element = document.getSelection();
            var anchorElement = element.anchorNode.parentElement;
            //check if element is of class japanese
            if(anchorElement.classList.contains("japanese"))
            {
                //get the word
                var word = anchorElement.textContent;
                //add word to dictionary
                addWordToDictionary(word);
            }

            console.log(element);
        }
    });
  }
}

chrome.contextMenus.onClicked.addListener(onClickHandler);
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

chrome.contextMenus.create({
  title: "Hide furigana (known reading)",
  contexts: ['all'],
  id: KNOWN_READING
});

chrome.contextMenus.create({
  title: "Hide translation (known meaning)",
  contexts: ['all'],
  id: KNOWN_MEANING
});

chrome.contextMenus.create({
  title: "Hide furigana and translation (known reading and meaning)",
  contexts: ['all'],
  id: KNOWN_ALL
});

chrome.contextMenus.create({
  title: "Show furigana (unknown reading)",
  contexts: ['all'],
  id: REMOVE_READING
});

chrome.contextMenus.create({
  title: "Show translation (unknown meaning)",
  contexts: ['all'],
  id: REMOVE_MEANING
});

chrome.contextMenus.create({
  title: "Show furigana and translation (unknown reading and meaning)",
  contexts: ['all'],
  id: REMOVE_ALL
});

function onClickHandler(info, tab) {
  if (info.menuItemId === KNOWN_READING) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: 
        function() {
            function addWordToDictionary(word) {
              //add word to dictionary
              readingDictionary[word] = true;
              //save dictionary
              saveDictionary();
              
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
        }
    });
  }
  else if (info.menuItemId === KNOWN_MEANING) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: 
        function() {
            function addWordToDictionary(word) {
              //add word to dictionary
              meaningDictionary[word] = true;
              //save dictionary
              saveDictionary();
              
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
        }
    });
  }
  else if (info.menuItemId === KNOWN_ALL) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: 
        function() {
            function addWordToDictionary(word) {
              //add word to dictionary
              meaningDictionary[word] = true;
              readingDictionary[word] = true;
              //save dictionary
              saveDictionary();
              
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
        }
    });
  }
  else if (info.menuItemId === REMOVE_READING) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: 
        function() {
            function removeWordFromDictionary(word) {
              //remove word from dictionary
              readingDictionary[word] = false;
              //save dictionary
              saveDictionary();
              
              console.log(word);
            }

            var element = document.getSelection();
            var anchorElement = element.anchorNode.parentElement;
            //check if element is of class japanese
            if(anchorElement.classList.contains("japanese"))
            {
                //get the word
                var word = anchorElement.textContent;
                //remove word from dictionary
                removeWordFromDictionary(word);
            }
        }
    });
  }
  else if (info.menuItemId === REMOVE_MEANING) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: 
        function() {
            function removeWordFromDictionary(word) {
              //remove word from dictionary
              meaningDictionary[word] = false;
              //save dictionary
              saveDictionary();
              
              console.log(word);
            }

            var element = document.getSelection();
            var anchorElement = element.anchorNode.parentElement;
            //check if element is of class japanese
            if(anchorElement.classList.contains("japanese"))
            {
                //get the word
                var word = anchorElement.textContent;
                //remove word from dictionary
                removeWordFromDictionary(word);
            }
        }
    });
  }
  else if (info.menuItemId === REMOVE_ALL) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: 
        function() {
            function removeWordFromDictionary(word) {
              //remove word from dictionary
              meaningDictionary[word] = false;
              readingDictionary[word] = false;
              //save dictionary
              saveDictionary();
              
              console.log(word);
            }

            var element = document.getSelection();
            var anchorElement = element.anchorNode.parentElement;
            //check if element is of class japanese
            if(anchorElement.classList.contains("japanese"))
            {
                //get the word
                var word = anchorElement.textContent;
                //remove word from dictionary
                removeWordFromDictionary(word);
            }
        }
    });
  }
}

chrome.contextMenus.onClicked.addListener(onClickHandler);
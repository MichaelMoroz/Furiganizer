function convertKatakanaToHiragana(str) {
    return str.replace(/[\u30a1-\u30f6]/g, function(match) {
        var chr = match.charCodeAt(0) - 0x60;
        return String.fromCharCode(chr);
    });
}

function getColor(r,g,b)
{
    return "rgb(" + r + "," + g + "," + b + ")";
}

// Create a new instance of the tokenizer builder
const builder = kuromoji.builder({ dicPath: chrome.runtime.getURL("kuromoji/dict")});

var wordMap = new Map();

function initializeTranslation(word)
{
    //the word database is stored in jmdict-eng-common-3.3.1.json
    //the format is as follows:
    //"words": [
    //{"id":"1000110","kanji":[{"common":true,"text":"ＣＤプレーヤー","tags":[]},{"common":false,"text":"ＣＤプレイヤー","tags":[]}],"kana":[{"common":true,"text":"シーディープレーヤー","tags":[],"appliesToKanji":["ＣＤプレーヤー"]},{"common":false,"text":"シーディープレイヤー","tags":[],"appliesToKanji":["ＣＤプレイヤー"]}],"sense":[{"partOfSpeech":["n"],"appliesToKanji":["*"],"appliesToKana":["*"],"related":[],"antonym":[],"field":[],"dialect":[],"misc":[],"info":[],"languageSource":[],"gloss":[{"lang":"eng","gender":null,"type":null,"text":"CD player"}]}]},

    //load the word database
    var JSON_URL = chrome.runtime.getURL("jmdict-eng-common-3.3.1.json");
    var request = new XMLHttpRequest();
    request.open("GET", JSON_URL, false);
    request.send(null);
    var wordDatabase = JSON.parse(request.responseText);
    var wordList = wordDatabase.words;

    //create a map from japanese word to english word
    for (var i = 0; i < wordList.length; i++)
    {
        var word = wordList[i];
        var kanji = word.kanji;
        var kana = word.kana;
        var sense = word.sense;
        var englishWord = sense[0].gloss[0].text;

        //remove anything inside parentheses in the english word
        englishWord = englishWord.replace(/\(.*?\)/g, '');

        //add the english word to the map
        for (var j = 0; j < kanji.length; j++)
        {
            wordMap.set(kanji[j].text, englishWord);
        }
        for (var j = 0; j < kana.length; j++)
        {
            wordMap.set(kana[j].text, englishWord);
        }
    }
}

function getTranslation(word)
{
    if(wordMap.size == 0)
    {
        initializeTranslation(word);
    }
    return wordMap.get(word);
}

//load the user dictionary
var meaningDictionary = {};
var readingDictionary = {};

// Save the dictionary to chrome.storage
function saveDictionary() {
    chrome.storage.local.set({'meaningDictionary': meaningDictionary, 'readingDictionary': readingDictionary}, function() {
        console.log('Dictionary saved');
    });
}

// Retrieve the dictionary from chrome.storage
function getDictionary() {
    chrome.storage.local.get(['meaningDictionary', 'readingDictionary'], function(result) {
        meaningDictionary = result.meaningDictionary || {};
        readingDictionary = result.readingDictionary || {};
        console.log('Dictionary retrieved:', meaningDictionary, readingDictionary);
    });
}

// Check if you know the meaning of a word
function isMeaningKnown(word) {
    return !!meaningDictionary[word];
}

// Check if you know the reading of a word
function isReadingKnown(word) {
    return !!readingDictionary[word];
}


function adReadingToDictionary(word) {
    //add word to dictionary
    readingDictionary[word] = true;
    //save dictionary
    saveDictionary();
    
    console.log(word);
  }
  
  function addMeaningToDictionary(word) {
    //add word to dictionary
    meaningDictionary[word] = true;
    //save dictionary
    saveDictionary();
  
    console.log(word);
  }
  
  function addWordToDictionary(word) {  
    //add word to dictionary
    meaningDictionary[word] = true;
    readingDictionary[word] = true;
    //save dictionary
    saveDictionary();
  
    console.log(word);
  }
  
  function removeReadingFromDictionary(word) {
    //remove word from dictionary
    readingDictionary[word] = false;
    //save dictionary
    saveDictionary();
  
    console.log(word);
  }
  
  function removeMeaningFromDictionary(word) {
    //remove word from dictionary
    meaningDictionary[word] = false;
    //save dictionary
    saveDictionary();
  
    console.log(word);
  }
  
  function removeWordFromDictionary(word) {
    //remove word from dictionary
    meaningDictionary[word] = false;
    readingDictionary[word] = false;
    //save dictionary
    saveDictionary();
    
    console.log(word);
  }
  
  function getElementAndApply(applyWordFunction) {
    var element = document.getSelection();
    var anchorElement = element.anchorNode.parentElement;
    //check if element is of class japanese
    if(anchorElement.classList.contains("japanese"))
    {
        //get the word
        var word = anchorElement.textContent;
        //add word to dictionary
        applyWordFunction(word);
    }
  }

//function to save the dictionary to a json file
function exportDictionary() {
    //combine the dictionaries into a single json file
    var dictionary = {
        "meaningDictionary": meaningDictionary,
        "readingDictionary": readingDictionary
    };
    //convert the json file to a string
    var dictionaryString = JSON.stringify(dictionary);
    //download a file with the dictionary
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(dictionaryString));
    element.setAttribute('download', "dictionary.json");
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

//function to load the dictionary from a json file
function importDictionary() {
    //create an input element
    var element = document.createElement('input');
    element.setAttribute('type', 'file');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    //add an event listener to the input element
    element.addEventListener('change', function() {
        //get the file
        var file = element.files[0];
        //create a file reader
        var reader = new FileReader();
        //add an event listener to the file reader
        reader.addEventListener('load', function() {
            //get the dictionary from the file
            var dictionary = JSON.parse(reader.result);
            //set the dictionaries
            meaningDictionary = dictionary.meaningDictionary;
            readingDictionary = dictionary.readingDictionary;
            //save the dictionaries
            saveDictionary();
        });
        //read the file
        reader.readAsText(file);
    });
}

//export the unknown words as an anki deck
function exportUnknownWords() {
    //get the unknown words
    var unknownWords = getUnknownWords();
    //create the anki deck
    var ankiDeck = createAnkiDeck(unknownWords);
    //download the anki deck
    downloadAnkiDeck(ankiDeck);
}

//get the unknown words
function getUnknownWords() {
    //get the unknown words and their translations from the meaning and reading dictionaries which are false
    var unknownWords = {};
    for(var word in meaningDictionary) {
        if(!meaningDictionary[word]) {
            unknownWords[word] = getTranslation(word);
        }
    }
    for(var word in readingDictionary) {
        if(!readingDictionary[word]) {
            unknownWords[word] = getTranslation(word);
        }
    }
    //return the unknown words
    return unknownWords;
}

var thistokenizer;
builder.build(function(err, tokenizer) {
    thistokenizer = tokenizer;
});

//create an anki deck csv file from the unknown words
function createAnkiDeck(unknownWords) {
    //create the anki deck
    var ankiDeck = "";
    for(var word in unknownWords) {
        //add the word, translation, reading we get from kuromoji and japanese tag to the anki deck
        ankiDeck += word + "," + unknownWords[word] + " (" + convertKatakanaToHiragana(getReading(word)) + ") ,japanese \r\n";
    }
    //return the anki deck
    return ankiDeck;
}

//get reading of word
function getReading(word) {
    //get the reading of the word using kuromoji
    var reading = thistokenizer.tokenize(word)[0].reading;
    //return the reading
    return reading;
}

//download the anki deck
function downloadAnkiDeck(ankiDeck) {
    //download a file with the anki deck
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(ankiDeck));
    element.setAttribute('download', "ankiDeck.csv");
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

//load the dictionary
getDictionary();
//saveDictionary();

var japanesePOS = ["名詞", "形容詞", "動詞", "副詞", "助詞", "助動詞", "接続詞", "感動詞"];

var textElements = document.querySelectorAll("p, span, h1, h2, h3");
builder.build(function (err, _tokenizer) {
    for (var i = 0; i < textElements.length; i++) {
        var textElement = textElements[i];
        var text = textElement.textContent;
        var tokens = _tokenizer.tokenize(text);
        var textIndex = 0;
        var newText = "";
        var hasJapanese = false;
        for (var j = 0; j < tokens.length; j++) {
            var token = tokens[j];
            var surfaceForm = token.surface_form;

            //check if token is japanese 
            if (japanesePOS.indexOf(token.pos) === -1 || token.reading == null)
            {
                newText += surfaceForm;
                textIndex += surfaceForm.length;
                continue;
            }
            hasJapanese = true;

            var index = text.indexOf(surfaceForm, textIndex);
            if (index !== -1) {
                var tokenElement = document.createElement("span");
                tokenElement.classList.add("token");
                tokenElement.classList.add("japanese");
                tokenElement.textContent = surfaceForm;
                var furigana = token.reading;
                textIndex = index + surfaceForm.length;
                newElement = "";
                if(furigana != null && furigana != surfaceForm) 
                {
                    furiganaHira = convertKatakanaToHiragana(furigana);
                    if(furiganaHira != surfaceForm)
                    {
                        //show or hide furigana and translation depending on if the user knows the word
                        //create ruby element
                        var ruby = document.createElement("ruby");
                        ruby.appendChild(tokenElement);
                        //creat furigana text above the japanese text
                        var rt = document.createElement("rt");
                        rt.textContent = isReadingKnown(surfaceForm)?"":furiganaHira;
                        ruby.appendChild(rt);
                        //create another ruby element to add the translation text
                        var ruby2 = document.createElement("ruby");
                        ruby2.appendChild(ruby);
                        //create translation text below the japanese text
                        var transl = document.createElement("rt");

                        //get the translation from the the Gisho API
                        var translation = isMeaningKnown(surfaceForm)?"":getTranslation(surfaceForm);
                        if(translation != null)
                        {
                            transl.textContent = translation;
                        }
                        else
                        {
                            transl.textContent = ""; //no translation found
                        }

                        //make the size of the translation text smaller
                        transl.style.fontSize = "0.35em";
                        //add the translation text to the ruby element
                        ruby2.appendChild(transl);


                        //insert ruby element in the text at the index
                        newElement += ruby2.outerHTML;
                    }
                    else
                    {
                        newElement += surfaceForm;
                    }
                } 
                else
                {
                    newElement += surfaceForm;
                }
                
                //loop through the japanese POS types and colors and add the color to the element if it matches the pos type
                var posColors = ["#000000", "#FF7B54", "#FFB26B", "#FFD56F", "#939B62", "#1F8A70", "#BFDB38", "#FC7300"];
                for(var k = 0; k < japanesePOS.length; k++)
                {
                    if(token.pos == japanesePOS[k])
                    {
                        //add color to the element(except first POS) and also add the tag specifying that it is japanese
                        if(k != 0)
                            newElement = "<span class='japanese' style='color: " + posColors[k] + "'>" + newElement + "</span>";
                        else
                            newElement = "<span class='japanese'>" + newElement + "</span>";
                        break;
                    }
                }

                newText += newElement;
            }
        }

        if(hasJapanese) textElement.innerHTML = newText;
    }
});
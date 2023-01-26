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


var japanesePOS = ["名詞", "形容詞", "動詞", "副詞", "助詞", "助動詞", "接続詞", "感動詞"];

var textElements = document.querySelectorAll("p, span, h1, h2, h3");
kuromoji.builder({ dicPath: chrome.runtime.getURL("kuromoji/dict")}).build(function (err, _tokenizer) {
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
                        //create ruby element
                        var ruby = document.createElement("ruby");
                        ruby.appendChild(tokenElement);
                        //creat furigana text above the japanese text
                        var rt = document.createElement("rt");
                        rt.textContent = furiganaHira + "";
                        ruby.appendChild(rt);
                        //create another ruby element to add the translation text
                        var ruby2 = document.createElement("ruby");
                        ruby2.appendChild(ruby);
                        //create translation text below the japanese text
                        var transl = document.createElement("rt");
                        transl.textContent = "test";
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

var DIC_URL = chrome.runtime.getURL("/node_modules/kuromoji/dict/"); 

console.log(DIC_URL);
var tokenizer = null;

//document.addEventListener("DOMContentLoaded", function() {
var textElements = document.querySelectorAll("p, span, h1, h2, h3");

console.log("here1");

kuromoji.builder({ dicPath: DIC_URL }).build(function (err, _tokenizer) {

    console.log("here2");
    for (var i = 0; i < textElements.length; i++) {

        console.log("here3");
        var textElement = textElements[i];
        var text = textElement.textContent;
        console.log(text);
        var tokens = _tokenizer.tokenize(text);
        var textIndex = 0;
        for (var j = 0; j < tokens.length; j++) {
            var token = tokens[j];
            var surfaceForm = token.surface_form;
            var index = text.indexOf(surfaceForm, textIndex);
            if (index !== -1) {
                var tokenElement = document.createElement("span");
                tokenElement.classList.add("token");
                tokenElement.textContent = surfaceForm;
                // Add furigana
                var furigana = token.readings[0];
                var ruby = document.createElement("ruby");
                ruby.appendChild(tokenElement);
                var rt = document.createElement("rt");
                rt.textContent = furigana;
                ruby.appendChild(rt);
                textElement.replaceChild(ruby, textElement.childNodes[index]);
                textIndex = index + surfaceForm.length;
            }
        }
    }
});
//});
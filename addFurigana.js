
var DIC_URL = chrome.runtime.getURL("node_modules/kuromoji/dict"); 

console.log(DIC_URL);
var tokenizer = null;

//document.addEventListener("DOMContentLoaded", function() {
var textElements = document.querySelectorAll("p, span, h1, h2, h3");

kuromoji.builder({ dicPath: DIC_URL }).build(function (err, _tokenizer) {
    for (var i = 0; i < textElements.length; i++) {
        var textElement = textElements[i];
        var text = textElement.textContent;
        var tokens = _tokenizer.tokenize(text);
        var textIndex = 0;
        var newText = "";
        for (var j = 0; j < tokens.length; j++) {
            var token = tokens[j];
            var surfaceForm = token.surface_form;
            var index = text.indexOf(surfaceForm, textIndex);
            if (index !== -1) {
                var tokenElement = document.createElement("span");
                tokenElement.classList.add("token");
                tokenElement.textContent = surfaceForm;
                var furigana = token.reading;
                textIndex = index + surfaceForm.length;
                if(furigana != null && furigana != surfaceForm && token.pos == "名詞") 
                {
                    //create ruby element
                    var ruby = document.createElement("ruby");
                    ruby.appendChild(tokenElement);
                    var rt = document.createElement("rt");
                    rt.textContent = furigana;
                    ruby.appendChild(rt);
                    //insert ruby element in the text at the index
                    newText += ruby.outerHTML;
                } 
                else
                {
                    newText += surfaceForm;
                }
            }
        }
        textElement.innerHTML = newText;
    }
});
//});
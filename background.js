let dim = false;

// Listen for predefined keyboard shortcuts (see manifest.json)
chrome.commands.onCommand.addListener(function (command) {
    // var elements = document.getElementsByTagName("*");
    if (command === "dim") {
        if (dim || document.body.style.backgroundColor == "rgb(160, 160, 160)") {
            changeBackgroundColor("rgb(255, 255, 255)");
            dim = false;
        } else {
            changeBackgroundColor("rgb(160, 160, 160)");
            dim = true;
        }
    }
});

function changeBackgroundColor(currentColor) {
    var script;

    // check current background color passed into function
    if (currentColor === "rgb(160, 160, 160)") {
        // get each element on the page and change its background color to dim
        // then lighten any text elements that are too dark
        script = `(function() {
            var nodes = document.querySelectorAll('*');
            for(var i=0; i<nodes.length; i++) {
                if (nodes[i].tagName !== "HTML" 
                    && (nodes[i].tagName!= "button")
                    && (nodes[i].style.color != "#feffee") 
                    && (nodes[i].style.fontColor!="#feffee")) {

                        var fontColor = window.getComputedStyle(nodes[i], null).getPropertyValue("color");
                        var rgbOnly = fontColor.slice(0, -1).split("(")[1].split(",");
                        var rgbSum = rgbOnly.reduce((a, b) => Number(a) + Number(b));

                        nodes[i].style.backgroundColor = "rgb(160, 160, 160)";

                        // deal with fonts that are too dark
                        if (rgbSum < 300) {
                            nodes[i].style.color = "#fff";
                        }
                }                  
            }
        })()`;
    } else if (currentColor === "rgb(255, 255, 255)") {
        // get each element on the page and lighten it
        // then darken any text elements that are too light
        script = `(function() {
            var nodes = document.querySelectorAll('*');
            for(var i=0; i<nodes.length; i++) {
                if (nodes[i].tagName !== "HTML" 
                    && (nodes[i].tagName!= "button")
                    && (nodes[i].style.color != "#feffee") 
                    && (nodes[i].style.fontColor!="#feffee")) {
                        
                        var fontColor = window.getComputedStyle(nodes[i], null).getPropertyValue("color");
                        var rgbOnly = fontColor.slice(0, -1).split("(")[1].split(",");
                        var rgbSum = rgbOnly.reduce((a, b) => Number(a) + Number(b));

                        nodes[i].style.backgroundColor = "rgb(255, 255, 255)";
                        
                        // deal with fonts that are too light
                        if (rgbSum > 500) {
                            nodes[i].style.color = "#000";
                        }                    

                    }
                }
        })()`;
    } else {
        script = 'document.body.style.backgroundColor="' + currentColor + '";';
    }

    chrome.tabs.executeScript({
        code: script
    });
}

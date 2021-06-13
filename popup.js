document.getElementById('go').addEventListener('click',
    go);
    
var input = document.getElementById("value");
input.select();
input.addEventListener("keyup", function(event) {
if (event.keyCode === 13) {
    event.preventDefault();
    document.getElementById("go").click();
}
});
    
function go() {
    value = document.getElementById("value").value;
    
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        try {
        chrome.tabs.sendMessage(tabs[0].id, {action:"resize", value:value}, function(response){
            window.close();
            return true;
        });
        }
        catch(err) {}
    });
}

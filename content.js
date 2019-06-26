chrome.runtime.sendMessage({message: "go"}, function(response) {
    console.log('Response is: ' + response.message );
});



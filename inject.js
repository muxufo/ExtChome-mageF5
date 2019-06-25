if( extension_status == 'on' ) {
    chrome.runtime.sendMessage({greeting: "hello"}, function(response) {

    });

}
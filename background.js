function getNowDate() {
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + '-' + today.getMinutes() + '-' + today.getSeconds();
    return date + '--' + time;
}

var screenshot = {
    content: document.createElement("canvas"),
    data: '',

    init: function () {
        console.log('init SCREE');
        this.initEvents();
    },
    saveScreenshot: function () {
        var image = new Image();
        image.onload = function () {
            var canvas = screenshot.content;
            canvas.width = image.width;
            canvas.height = image.height;
            var context = canvas.getContext("2d");
            context.drawImage(image, 0, 0);

            // save the image
            var link = document.createElement('a');

            var fileName = getNowDate();

            link.download =  fileName +".png";
            link.href = screenshot.content.toDataURL();
            link.click();
            screenshot.data = '';
        };
        image.src = screenshot.data;
    },
    initEvents: function () {
        console.log('init event addlistener screen');
        chrome.runtime.onMessage.addListener(
            function (request, sender, sendResponse) {
                if (request.greeting == "hello") {
                    chrome.tabs.captureVisibleTab(null, {format: "png"}, function (data) {
                        screenshot.data = data;
                        screenshot.saveScreenshot();

                    });

                }
            });
    }
};



// chrome extension keepAlive

var toggle = false;
var status = 'off';
var the_tab_id = '';

function set_status() {
    toggle = !toggle;
    status = 'off';
    if (toggle) {
        status = 'on';
    }
}

function toggle_extension(tab) {
    // Set icon
    // chrome.browserAction.setIcon({path: 'images/icons/money.png', tabId: tab.id});
    // Pass variable & execute script
    chrome.tabs.executeScript({code: 'var extension_status = "' + status + '"'});
    chrome.tabs.executeScript({file: 'inject.js'});
    // Set the tab id
    the_tab_id = tab.id;
}

function my_listener(tabId, changeInfo, tab) {
    // If updated tab matches this one
    if (changeInfo.status == "complete" && tabId == the_tab_id && status == 'on') {
        toggle_extension(tab);
        screenshot.init();

        // chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        //     chrome.tabs.reload(tabs[0].id, {bypassCache: true})
        // });
    }
}

chrome.browserAction.onClicked.addListener(function (tab) {
    set_status();
    console.log('set_status');
    toggle_extension(tab);
    console.log('toggle_extension');
    screenshot.init();
    console.log('init screenshots');

});

function reloadPage(){
    console.log('Reloading page...');
    chrome.tabs.query({active: true, currentWindow: true}, function (arrayOfTabs) {
        console.log('in the query');
        console.log('---------------');
        chrome.tabs.reload(arrayOfTabs[0].id, {bypassCache: true});
    });
}


chrome.tabs.onUpdated.addListener(my_listener);
screenshot.init();
console.log('listener added');

setInterval(function() {
    reloadPage()
}, 900000);


/*
1 sec = 1000ms
10 sec = 10000ms
100 sec = 100000ms
900 sec = 900000ms
 */



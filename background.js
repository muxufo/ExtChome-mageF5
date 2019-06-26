function getNowDate() {
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + '-' + today.getMinutes() + '-' + today.getSeconds();
    return date + '--' + time;
}

var screenshot = {
    content: document.createElement("canvas"),
    data: '',

    init: function () {
        console.log('init SCREE');
        this.takeScreenshot();
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

            link.download = fileName + ".png";
            link.href = screenshot.content.toDataURL();
            link.click();
            screenshot.data = '';
        };
        image.src = screenshot.data;
    },
    takeScreenshot: function () {
        chrome.tabs.captureVisibleTab(null, {format: "png"}, function (data) {
            screenshot.data = data;
            screenshot.saveScreenshot();

        });


    }
};

var countdown = {
    remain: -1,
    initValue: -1
};

chrome.runtime.onConnect.addListener(function (port) {
    console.assert(port.name === "letmeiiiiin");
    port.postMessage({textValue: countdown.initValue});
});

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
    }
}

chrome.browserAction.onClicked.addListener(function (tab) {
    set_status();
    console.log('set_status');
    toggle_extension(tab);
    console.log('toggle_extension');
});

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.message === "init") {
            countdown.initValue = request.coutndown;
            countdown.remain = countdown.initValue;
            reloadStatus.setOn();
            sendResponse({message: "success"});
        }

        if (request.message === "stop") {
            reloadStatus.setOff();
            sendResponse({message: "success"});
        }
    }
);


function reloadPage() {
    if (reloadStatus.status === true) {
        if (countdown.remain >= 0) {
            countdown.remain--;
            if (countdown.remain === 0) {
                screenshot.init();
                countdown.remain = countdown.initValue;
            }
        }

        chrome.tabs.query({active: true}, function (arrayOfTabs) {
            var time = Date.now();
            chrome.browsingData.removeCache({"since": time}, function () {
            });
            chrome.tabs.reload(arrayOfTabs[0].id, {bypassCache: true});

        });
    }


}

var reloadStatus = {
    setOn: function () {
        this.status = true;
    },
    setOff: function () {
        this.status = false;
    },
};

setInterval(function () {
    reloadPage()
}, 5000);


/*
1 sec = 1000 ms
10 sec = 10000 ms
59 sec = 59000 ms
100 sec = 100000 ms
900 sec = 900000 ms
 */




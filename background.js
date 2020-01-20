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

const slackAllmessagesUrl = 'https://hooks.slack.com/services/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';
const slackNewStockOnlyUrl = 'https://hooks.slack.com/services/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';


var countdown = {
    remain: -1,
    initValue: -1
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
    if (changeInfo.status === "complete" && tabId === the_tab_id && status === 'on') {
        toggle_extension(tab);
    }
}

chrome.browserAction.onClicked.addListener(function (tab) {
    set_status();
    console.log('set_status');
    toggle_extension(tab);
    console.log('toggle_extension');
});


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

            //Get html of desired section
            chrome.tabs.executeScript(arrayOfTabs[0].id, {
                code: 'document.querySelector(".navigationPage").innerHTML'
            }, displayHtml);

            var time = Date.now();
            chrome.browsingData.removeCache({"since": time}, function () {
            });
            chrome.tabs.reload(arrayOfTabs[0].id, {bypassCache: true});

        });
    }
}

chrome.storage.onChanged.addListener(function (changes, namespace) {
    for (var key in changes) {
        var storageChange = changes[key];
        console.log('Storage key "%s" in namespace "%s" changed. ' +
            'Old value was "%s", new value is "%s".',
            key,
            namespace,
            storageChange.oldValue,
            storageChange.newValue);
    }
});


function displayHtml(html) {
    var newDoc = document.implementation.createHTMLDocument('test');
    var body = newDoc.createElement('content');
    body.innerHTML = html[0];

    newDoc.body.append(body);

    var ordinateurStock = getStockQuantity('ordinateur', newDoc);
    var pieceStock = getStockQuantity('pieces', newDoc);
    var peripheriquesStock = getStockQuantity('peripheriques', newDoc);
    var imageetsonStock = getStockQuantity('imageetson', newDoc);
    var mobiliteStock = getStockQuantity('mobilite', newDoc);
    var reseauxStock = getStockQuantity('reseaux', newDoc);

    chrome.storage.sync.get(["ordinateur_stock", "pieces_stock", "peripheriques_stock", "imageetson_stock", "mobilite_stock", "reseaux_stock"], function (data) {

        // Just checking the first one cause I set them all at the same time so if this one is undefined, all are
        if (data.ordinateur_stock === undefined) {

            setLocalStorage("ordinateur_stock", ordinateurStock);
            setLocalStorage("pieces_stock", pieceStock);
            setLocalStorage("peripheriques_stock", peripheriquesStock);
            setLocalStorage("imageetson_stock", imageetsonStock);
            setLocalStorage("mobilite_stock", mobiliteStock);
            setLocalStorage("reseaux_stock", reseauxStock);

            console.log('set storage success');
        } else {

            var options = {
                type: "list",
                title: "Informations des stocks",
                message: "Il y a du changement dans les stocks",
                iconUrl: "/images/icons/ldlc128.png",
                items: []
            };

            if (data.ordinateur_stock < ordinateurStock) {
                options.items.push({
                    title: "Ordinateurs",
                    message: `On est passé de ${data.ordinateur_stock} à ${ordinateurStock} articles`
                });
            }

            if (data.pieces_stock < pieceStock) {
                options.items.push({
                    title: "Pièces",
                    message: `On est passé de ${data.pieces_stock} à ${pieceStock} articles`
                });
            }

            if (data.peripheriques_stock < peripheriquesStock) {
                options.items.push({
                    title: "Périphériques",
                    message: `On est passé de ${data.peripheriques_stock} à ${peripheriquesStock} articles`
                });
            }
            if (data.imageetson_stock < imageetsonStock) {
                options.items.push({
                    title: "Image et son",
                    message: `On est passé de ${data.imageetson_stock} à ${imageetsonStock} articles`
                });
            }
            if (data.mobilite_stock < mobiliteStock) {
                options.items.push({
                    title: "Mobilité",
                    message: `On est passé de ${data.mobilite_stock} à ${mobiliteStock} articles`
                });
            }
            if (data.reseaux_stock < reseauxStock) {
                options.items.push({
                    title: "Réseaux",
                    message: `On est passé de ${data.reseaux_stock} à ${reseauxStock} articles`
                });
            }

            setLocalStorage("ordinateur_stock", ordinateurStock);
            setLocalStorage("pieces_stock", pieceStock);
            setLocalStorage("peripheriques_stock", peripheriquesStock);
            setLocalStorage("imageetson_stock", imageetsonStock);
            setLocalStorage("mobilite_stock", mobiliteStock);
            setLocalStorage("reseaux_stock", reseauxStock);


            var stockInStorage = `Ordi: ${data.ordinateur_stock} \n Pieces: ${data.pieces_stock} \n Peripheriques: ${data.peripheriques_stock} \n Image et son: ${data.imageetson_stock} \n Mobilite: ${data.mobilite_stock} \n Reseaux: ${data.reseaux_stock}`;

            sendSlackMessage(stockInStorage, slackAllmessagesUrl);

            if (options.items.length > 0) {
                // Send the notif
                chrome.notifications.create('', options);
                console.log(options);

                var textToSend = "";
                for (let i = 0; i < options.items.length; i++) {
                    textToSend += `${options.items[i].title} : ${options.items[i].message} \n`;
                }

                sendSlackMessage(textToSend, slackNewStockOnlyUrl);
            } else {
                sendSlackMessage("Pas de changement de stock", slackAllmessagesUrl);

                console.log("Pas de changement de stock")
            }

        }

    });

    newDoc.body.remove();
}

// function sendEmail(options) {
//     let api_key = '0fa83c48a38f87fdeca7dee19175fbf4-0a4b0c40-29e7039d';
//     let domain = 'sandbox62a8000983bd4f279cdabaeed49c1dbf.mailgun.org';
//
//     var emailText = [];
//
//     for (let i = 0; i < options.items.length; i++) {
//         emailText.push(options.items[i].title + " : " + options.items[i].message + '\n');
//     }
//
//     emailText.join("");
//
//     console.log(emailText);
//
//     $.ajax('https://api.mailgun.net/v3',
//         {
//             type: "POST",
//             username: 'api',
//             password: api_key,
//             data: {
//                 from: 'CDA <mailgun@sandbox62a8000983bd4f279cdabaeed49c1dbf.mailgun.org>',
//                 // to: 'nicolas.crelier@gmail.com',
//                 to: 'claudelrom90000@aim.com',
//                 subject: 'Stock fdp',
//                 text: emailText
//             },
//             success: function (a, b, c) {
//                 console.log('mail sent: ', b);
//                 sendSlackMessage("Envoie mail succes", slackAllmessages);
//             }.bind(this),
//             error: function (xhr, status, errText) {
//                 console.log('mail sent failed: ', xhr.responseText);
//                 sendSlackMessage(xhr.responseText, slackAllmessages);
//             }
//         });
// }

function setLocalStorage(keyName, value) {
    chrome.storage.sync.set({[keyName]: value}, function () {
        console.log("Value is set to" + value);
    });
}

function sendSlackMessage(textToSend, url) {

    $.ajax({
        data: 'payload=' + JSON.stringify({
            "text": textToSend
        }),
        dataType: 'json',
        processData: false,
        type: 'POST',
        url: url
    });
}

function getStockQuantity(elementId, newDoc) {
    return newDoc.getElementById(elementId).getElementsByClassName("class_css")[0].innerText;
}

var reloadStatus = {
    setOn: function () {
        this.status = true;
    },
    setOff: function () {
        this.status = false;
    },
    status: false
};

/*
1 sec = 1000 ms
10 sec = 10000 ms
59 sec = 59000 ms
100 sec = 100000 ms
900 sec = 900000 ms
10 min = 600000 ms
 */


let refreshTimeInMs = -1;
let nextRefreshInSec = -1;

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.message === "init") {
            refreshTimeInMs = request.refreshValue;
            nextRefreshInSec = refreshTimeInMs / 1000;
            startTimer();
            countdown.initValue = request.coutndown;
            countdown.remain = countdown.initValue;
            reloadStatus.setOn();
            reloadPage();
            sendResponse({message: "success"});
        }

        if (request.message === "stop") {
            reloadStatus.setOff();
            sendResponse({message: "success"});
        }
    }
);

chrome.runtime.onConnect.addListener(function (port) {
    console.assert(port.name === "letmeiiiiin");
    port.postMessage({textValue: countdown.initValue, refreshValue: refreshTimeInMs, reloadStatus: reloadStatus.status});
});

setInterval(function () {

    if (reloadStatus.status === true) {
        if (nextRefreshInSec !== 0) {

            const msg = `Prochain refresh dans ${nextRefreshInSec} secondes`;
            chrome.storage.sync.set({nextRefresh: msg}, function () {
            });
            nextRefreshInSec--;
        }

        if (nextRefreshInSec === 0) {
            nextRefreshInSec = refreshTimeInMs / 1000;
        }
    }


}, 1000);

function startTimer() {
    setInterval(function () {
        reloadPage()
    }, refreshTimeInMs);
}




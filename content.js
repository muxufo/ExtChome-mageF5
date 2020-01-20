var isStarted = false;
document.addEventListener("DOMContentLoaded", function (event) {

    jQuery('#start-button').on('click', function () {
        isStarted = true;
        var valueText = jQuery('#text-time').val();
        var refreshValueToSend = jQuery('#refreshTimeValue').val();

        // Seconds to ms
        refreshValueToSend = refreshValueToSend * 1000;
        chrome.runtime.sendMessage({message: "init", coutndown: valueText, refreshValue: refreshValueToSend}, function (response) {
        });
    });


    jQuery('#stop-reload').on('click', function () {
        isStarted = false;
        jQuery('#nextRefresh').text("");
        chrome.runtime.sendMessage({message: "stop"}, function (response) {
        });
    });

    var port = chrome.runtime.connect({name: "letmeiiiiin"});
    port.onMessage.addListener(function (msg) {
        if (msg.refreshValue !== -1){
            var valueRefreshToDisplayFromBackground = msg.refreshValue / 1000;
            jQuery('#refreshTimeValue').val(valueRefreshToDisplayFromBackground);
        }

        if (msg.reloadStatus === true){
            isStarted = true;
            chrome.storage.sync.get(["nextRefresh"], function (data) {
                if (data.nextRefresh !== undefined) {
                    jQuery("#nextRefresh").text(data.nextRefresh);
                }
            });
        }

        console.log(msg);
        var valueText = msg.textValue;
        console.log('valueText: ' + valueText);
        jQuery('#text-time').val(valueText);
    });
});


setInterval(function () {

    if (isStarted === true){
        chrome.storage.sync.get(["nextRefresh"], function (data) {

            if (data.nextRefresh !== undefined) {
                jQuery("#nextRefresh").text(data.nextRefresh);
            }
        });
    }
}, 100);
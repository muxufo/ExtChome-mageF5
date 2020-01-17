document.addEventListener("DOMContentLoaded", function(event) {

    jQuery('#start-button').on('click', function () {
        var valueText = jQuery('#text-time').val();
        chrome.runtime.sendMessage({message: "init", coutndown: valueText}, function (response) {});
    });


    jQuery('#stop-reload').on('click', function () {
        chrome.runtime.sendMessage({message: "stop"}, function (response) {
        });
    });

    var port = chrome.runtime.connect({name: "letmeiiiiin"});
    port.onMessage.addListener(function (msg) {
        console.log(msg);
        var valueText = msg.textValue;
        console.log('valueText: ' + valueText);
        jQuery('#text-time').val(valueText);

    });
});

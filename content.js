$('#start-button').on('click', function () {
    var valueText = $('#text-time').val();

    chrome.runtime.sendMessage({message: "init", coutndown: valueText}, function (response) {

    });
});

var port = chrome.runtime.connect({name: "letmeiiiiin"});
port.onMessage.addListener(function (msg) {
    console.log(msg);
    var valueText = msg.textValue;
    console.log('valueText: ' + valueText);
    $('#text-time').val(valueText);

});


//
// chrome.runtime.onMessage.addListener(
//     function(message, sender, sendResponse) {
// console.log(message);
//         if (message.update === "updateNumber"){
//             sendResponse({message: "success"});
//
//         }
//
//     });
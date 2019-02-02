// Cordova Scann

function Scan(){

  // // Start a scan. Scanning will continue until something is detected or
  // // `QRScanner.cancelScan()` is called.
  // QRScanner.scan(displayContents);

  // function displayContents(err, text){
  //   if(err){
  //     // an error occurred, or the scan was canceled (error code `6`)
  //   } else {
  //     // The scan completed, display the contents of the QR code:
  //     alert(text);
  //   }
  // }

  // // Make the webview transparent so the video preview is visible behind it.
  // QRScanner.show();
  // // Be sure to make any opaque HTML elements transparent here to avoid
  // // covering the video.


  cordova.plugins.barcodeScanner.scan(
      function (result) {
          if(!result.cancelled){
            app.router.navigate({ url: '/page-loader-component/eve/' + result.text + '/about-me/1/?start=0&end=30#top' });
          }
          // alert("We got a barcode\n" +
          //       "Result: " + result.text + "\n" +
          //       "Format: " + result.format + "\n" +
          //       "Cancelled: " + result.cancelled);
      },
      function (error) {
          alert("Scanning failed: " + error);
      },
      {
          preferFrontCamera : false, // iOS and Android
          showFlipCameraButton : false, // iOS and Android
          showTorchButton : true, // iOS and Android
          torchOn: false, // Android, launch with the torch switched on (if available)
          saveHistory: true, // Android, save scan history (default false)
          prompt : "Scan the product you want to know more", // Android
          resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
          formats : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
          orientation : "portrait", // Android only (portrait|landscape), default unset so it rotates with the device
          disableAnimations : true, // iOS
          disableSuccessBeep: false // iOS and Android
      }
  );
}

// Dom7
var $$ = Dom7;

// Theme
var theme = 'auto';
if (document.location.search.indexOf('theme=') >= 0) {
  theme = document.location.search.split('theme=')[1].split('&')[0];
}

// Init App
var app = new Framework7({
  id: 'io.framework7.mobileux',
  root: '#mobileux',
  theme: theme,
  data: function () {
    return {
      user: {
        firstName: 'John',
        lastName: 'Doe',
      },
    };
  },
  methods: {
    helloWorld: function () {
      app.dialog.alert('Hello World!');
    },
  },
  routes: routes,
  view: {
    pushState: true,
  },
  toolbar: {
    hideOnPageScroll: true,
  },
  onAjaxStart: function (xhr) { app.preloader.show(); },
  onAjaxComplete: function (xhr) {  setTimeout(function () {
    app.preloader.hide();
  }, 3000);} 
});

/* show hide app loader */
app.preloader.show();
$(window).on('load', function(){
     app.preloader.hide();
})

/* page inside iframe just for demo app */
if (self !== top) {
     $('body').addClass('max-demo-frame')
 }



/* messanger app */

$$(document).on('page:init', '.page[data-name="chat"]', function (e) {  
// Init Messages
var messages = app.messages.create({
  el: '.messages',

  // First message rule
  firstMessageRule: function (message, previousMessage, nextMessage) {
    // Skip if title
    if (message.isTitle) return false;
    /* if:
      - there is no previous message
      - or previous message type (send/received) is different
      - or previous message sender name is different
    */
    if (!previousMessage || previousMessage.type !== message.type || previousMessage.name !== message.name) return true;
    return false;
  },
  // Last message rule
  lastMessageRule: function (message, previousMessage, nextMessage) {
    // Skip if title
    if (message.isTitle) return false;
    /* if:
      - there is no next message
      - or next message type (send/received) is different
      - or next message sender name is different
    */
    if (!nextMessage || nextMessage.type !== message.type || nextMessage.name !== message.name) return true;
    return false;
  },
  // Last message rule
  tailMessageRule: function (message, previousMessage, nextMessage) {
    // Skip if title
    if (message.isTitle) return false;
      /* if (bascially same as lastMessageRule):
      - there is no next message
      - or next message type (send/received) is different
      - or next message sender name is different
    */
    if (!nextMessage || nextMessage.type !== message.type || nextMessage.name !== message.name) return true;
    return false;
  }
});

// Init Messagebar
var messagebar = app.messagebar.create({
  el: '.messagebar'
});

// Response flag
var responseInProgress = false;

// Send Message
$$('.send-link').on('click', function () {
  var text = messagebar.getValue().replace(/\n/g, '<br>').trim();
  // return if empty message
  if (!text.length) return;

  // Clear area
  messagebar.clear();

  // Return focus to area
  messagebar.focus();

  // Add message to messages
  messages.addMessage({
    text: text,
  });

  if (responseInProgress) return;
  // Receive dummy message
  receiveMessage();
});

// Dummy response
var answers = [
  'Yes!',
  'No',
  'Hm...',
  'I am not sure',
  'And what about you?',
  'May be ;)',
  'Lorem ipsum dolor sit amet, consectetur',
  'What?',
  'Are you sure?',
  'Of course',
  'Need to think about it',
  'Amazing!!!'
]
var people = [
  {
    name: 'John Doe',
    avatar: 'img/user1.png'
  },
  {
    name: 'Alizee',
    avatar: 'img/user2.png'
  }
];
function receiveMessage() {
  responseInProgress = true;
  setTimeout(function () {
    // Get random answer and random person
    var answer = answers[Math.floor(Math.random() * answers.length)];
    var person = people[Math.floor(Math.random() * people.length)];

    // Show typing indicator
    messages.showTyping({
      header: person.name + ' is typing',
      avatar: person.avatar
    });

    setTimeout(function () {
      // Add received dummy message
      messages.addMessage({
        text: answer,
        type: 'received',
        name: person.name,
        avatar: person.avatar
      });
      // Hide typing indicator
      messages.hideTyping();
      responseInProgress = false;
    }, 4000);
  }, 1000);
}

});

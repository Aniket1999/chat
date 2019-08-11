
var socket = io();

function scrollToBottom() 
{
    var messages = jQuery('#messages');
    var newMessage = messages.children('li:last-child');
    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();
    
    if(clientHeight+scrollTop+newMessageHeight+lastMessageHeight >= scrollHeight) {
        messages.scrollTop(scrollHeight);
    }
}


socket.on('connect',() =>{
    var params = jQuery.deparam(window.location.search);
    socket.emit('join',params, function(err) {
        if (err) {
            alert(err);
            window.location.href = '/';
        }
        else {
            console.log('No error');
        }
    });
});
socket.on('disconnect',() => {
    console.log('Disconnected from user');
});

socket.on('updateUserList',function(users) {
    var ol = jQuery('<ul class="plus"></ul>');
    users.forEach(function (user) {
        ol.append(jQuery('<li></li>').text(user));
    });
    jQuery('#users').html(ol);
});


let position;

socket.on('newMessage', (message) => {
    let urlParams = new URLSearchParams(window.location.search);
    let name = urlParams.get('name');
    console.log(name);
    console.log(message.from);
    if(name == message.from){
      position = 'margin-left: auto;';
    } else {
      position = 'margin-right: auto;margin-left:75px;'
    }
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = jQuery('#message-template').html();
    var html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: formattedTime,
        position: position
    });
    jQuery('#messages').append(html);
    scrollToBottom();
}); 

socket.on('newAdminMessage', (message) => {
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = jQuery('#admin-message-template').html();
    var html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: formattedTime
    });
    jQuery('#messages').append(html);
    scrollToBottom();
}); 

socket.on('newAdminLMessage', (message) => {
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = jQuery('#adminl-message-template').html();
    var html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: formattedTime
    });
    jQuery('#messages').append(html);
    scrollToBottom();
}); 

socket.on('newLocationMessage',(message) => {
    if(name == message.from){
      position = 'margin-left: auto;';
    }
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = jQuery('#location-message-template').html();
    var html = Mustache.render(template, {
        from: message.from,
        url: message.url,
        createdAt: formattedTime,
        position: position
    });
    jQuery('#messages').append(html);
    scrollToBottom();
})

socket.on('newImgMessage', (message) => {
    if(name == message.from){
      position = 'margin-left: auto;';
    }
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = jQuery('#img-message-template').html();
    var html = Mustache.render(template, {
        image: message.image,
        from: message.from,
        createdAt: formattedTime,
        position: position
    });
    jQuery('#messages').append(html);
    scrollToBottom();
}); 

socket.on('newVidMessage', (message) => {
    if(name == message.from){
      position = 'margin-left: auto;';
    }
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = jQuery('#vid-message-template').html();
    var html = Mustache.render(template, {
        vid: message.vid,
        from: message.from,
        createdAt: formattedTime,
        position: position
    });
    jQuery('#messages').append(html);
    scrollToBottom();
}); 

socket.on('newAttMessage', (message) => {
    if(name == message.from){
      position = 'margin-left: auto;';
    }
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = jQuery('#att-message-template').html();
    var html = Mustache.render(template, {
        att: message.att,
        from: message.from,
        createdAt: formattedTime,
        position: position
    });
    jQuery('#messages').append(html);
    scrollToBottom();
}); 

// socket.on('user image', image);

jQuery('#message-form').on('submit',(e) => {
    e.preventDefault();

    var messageTextbox = jQuery('[name=message]');
    socket.emit('createMessage',{
        text:messageTextbox.val()
    },()=>{
        messageTextbox.val('')
    });
});

var locationButton = jQuery('#send-location');
locationButton.on('click', () => {
    if(!navigator.geolocation) {
        return alert('Geolocation not supported by your browser.')
    }

    locationButton.attr('disabled','disabled').text('Sending Location...');

    navigator.geolocation.getCurrentPosition((position) => {
        locationButton.removeAttr('disabled').text('Send location');
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    }, () => {
        locationButton.removeAttr('disabled').text('Send location');
        alert('Unable to fetch Location. ');
    });
});

  $('#imagefile').bind('change', function(e){
      var data = e.originalEvent.target.files[0];
      var reader = new FileReader();
      reader.onload = function(evt){
        // image('',evt.target.result);
        socket.emit('createImgMessage', {img: evt.target.result});
      };
      reader.readAsDataURL(data);
    });

  $('#videofile').bind('change', function(e){
      var data = e.originalEvent.target.files[0];
      var reader = new FileReader();
      reader.onload = function(evt){
        // image('',evt.target.result);
        socket.emit('createVidMessage', {vid: evt.target.result});
      };
      reader.readAsDataURL(data);
    });

$('#attfile').bind('change', function(e){
      var data = e.originalEvent.target.files[0];
      var reader = new FileReader();
      reader.onload = function(evt){
        // image('',evt.target.result);
        socket.emit('createAttMessage', {att: evt.target.result});
      };
      reader.readAsDataURL(data);
    });

    $(function(){
      setTimeout(function(){
        $('.emojionearea-editor').keypress(function(e){   
          if(e.which == 13 && e.shiftKey) {
            
          } else if (e.which == 13) {
            var messageTextbox = $('.emojionearea-editor');
            socket.emit('createMessage',{
                text:messageTextbox.html()
            },()=>{
                messageTextbox.html('')
            });
          }
        });
      }, 2000);
    });
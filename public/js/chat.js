const socket = io()

// Elements
const $messageForm       = document.querySelector('#messageForm')
const $messageFormInput  = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button') 
const $sendLocation      = document.querySelector('#send-location')
const $messages          = document.querySelector('#messages')


// Templates
const messageTemplate    = document.querySelector('#message-template').innerHTML
const linkTemplate       = document.querySelector('#link-template').innerHTML
const sidebarTemplate    = document.querySelector('#sidebar-template').innerHTML


//Options ignorequeryPrefix - helps to remove question mark in prefix in query string key value pair
// ?name=dhruv&room=loda help to remove starting question mark
const username =  Qs.parse(location.search,{ignoreQueryPrefix:true}).username
const room     =  Qs.parse(location.search,{ignoreQueryPrefix:true}).room

const autoscroll = ()=>{
    //  New message element
    const $newMessage = $messages.lastElementChild

    // Height of the last message or we can say $newMessage
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin
    // console.log(newMessageMargin)
    
    // Visible Height
    const visibleHeight    = $messages.offsetHeight

    // Height of messages container
    const containerHeight  = $messages.scrollHeight

    // How far have I scrolled
    const scrollOffset     = $messages.scrollTop + visibleHeight

    if(containerHeight - newMessageHeight <= scrollOffset){
        $messages.scrollTop = $messages.scrollHeight 

    }


}


// for messages 
socket.on('message',(msg)=>{
    console.log(msg)
    const html = Mustache.render(messageTemplate,{
        username:msg.username,
        msg:msg.text ,
        createdAt:moment(msg.createdAt).format('h:mm A')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})

// for Sending Location
socket.on('LocationEmitServer',(location)=>{
    console.log(location)
    const html = Mustache.render(linkTemplate,{
        username:location.username,
        location:location.url,
        createdAt:moment(location.createdAt).format('h:mm A')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})

socket.on('roomData',({room,users})=>{
    // console.log(room)
    // console.log(users)
    const html = Mustache.render(sidebarTemplate,{
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html

})


$messageForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    
    // disable
    $messageFormButton.setAttribute('disabled','disabled')
    
    const message = document.querySelector('input').value 
    // const message = e.target.elements.message.value
    
    socket.emit('sendMessage',message,(error)=>{
        // enable 
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus() 

        if(error){
            return alert('Gali Mat De Baklode :)')
        } 
        console.log('Message is delievered')
    })
})

$sendLocation.addEventListener('click',()=>{
    // navigator.geolocation
    $sendLocation.setAttribute('disabled','disabled')
    if(!navigator.geolocation){
        return alert('Geolocation is not supported by your browser')
    }

    navigator.geolocation.getCurrentPosition((position)=>{
        $sendLocation.removeAttribute('disabled')
        // console.log(position.coords.latitude,position.coords.longitude)
        
        socket.emit('sendLocation',{latitude:position.coords.latitude,longitude:position.coords.longitude},()=>{
            console.log('Location Shared')
        })
    })

})

socket.emit('join',{username,room},(error)=>{
    if(error){
        alert(error)
        location.href = '/'
    }

})

// peerjs --port 3001
const socket = io()
const videoGrid = document.getElementById('video-grid')
const myPeer = new Peer();

const myVideo = document.createElement('video')
myVideo.muted = true
let myVideoStream
const peers = {}
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    myVideoStream = stream
    addVideoStream(myVideo, stream)

    myPeer.on('call', call => {
        call.answer(stream)

        const video = document.createElement('video')

        call.on('stream', userVideoStream =>{
            addVideoStream(video, userVideoStream)
        })
    })
    socket.on('user-connected', userId => {
        alert("New user!");
        connectToNewUser(userId, stream)
    })

    let text = $('input')

    $('html').keydown(function(e) {
        let value = text.val();
        if(e.which == 13 && text.val().length !== 0) {
            console.log(value)
            socket.emit('message', value);
            text.val('')
        }
    });

    socket.on('createMessage', message => {
        $('.messages').append(`<li class="message"><b>user</b><br/>${message}</li>`)
        scrollToBottom()
    })
})

socket.on('user-disconnected', userId =>{
    if (peers[userId])
        peers[userId].close()
})

myPeer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id)
})

function connectToNewUser(userId, stream) {
    const call = myPeer.call(userId, stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
    })
    call.on('close', ()=>{
        video.remove()
    })

    peers[userId] = call
}


function addVideoStream(video, stream) {
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    videoGrid.append(video)
}

const scrollToBottom = () => {
    let d = $('.main__chat__window');
    d.scrollTop(d.prop("scrollHeight"));
}

function muteUnmute() {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if (enabled) {
        myVideoStream.getAudioTracks()[0].enabled = false;
        setUnmuteButton();
    } else {
        setMuteButton();
        myVideoStream.getAudioTracks()[0].enabled = true
    }
}

function setUnmuteButton() {
    const html = `
    <i class="unmute fas fa-microphone-slash"></i>
    <span>Unmute</span>
    `

    document.querySelector('.main__mute__button').innerHTML = html
}

function setMuteButton() {
    const html = `
    <i class="fas fa-microphone"></i>
    <span>Mute</span>
    `

    document.querySelector('.main__mute__button').innerHTML = html;
}

function playStopVideo() {
    let enabled = myVideoStream.getVideoTracks()[0].enabled;
    if(enabled) {
        myVideoStream.getVideoTracks()[0].enabled = false;
        setPlayVideo()
    } else {
        setStopVideo()
        myVideoStream.getVideoTracks()[0].enabled = true;
    }
}

function setPlayVideo() {
    const html = `
    <i class="fas fa-video-slash"></i>
    <span>Play Video</span>
    `

    document.querySelector('.main__video__button').innerHTML = html;
}

function setStopVideo() {
    const html = `
    <i class="fas fa-video"></i>
    <span>Stop Video</span>
    `

    document.querySelector('.main__video__button').innerHTML = html
}
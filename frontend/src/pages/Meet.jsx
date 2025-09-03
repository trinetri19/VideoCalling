import react, { useEffect } from 'react'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useRef, useState } from 'react';
import { io } from "socket.io-client";
import './meet.css'
import { IconButton } from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';


import CallEndIcon from '@mui/icons-material/CallEnd';
import { useNavigate } from 'react-router-dom';


const server_url = "http://localhost:8080";

var connections = {}

const peerConfigConnections = {
    "iceServers": [
        { "urls": "stun:stun.l.google.com:19302" }
    ]
}
const Meet = () => {
    let routeTo = useNavigate();
    let socketRef = useRef();
    let socketIdRef = useRef();
    let localVideoRef = useRef();

    let [videoAvailabel, setVideoAvailabel] = useState(true);
    let [audioAvailabel, setAudioAvailabel] = useState(true);

    let [video, setVideo] = useState([]);
    let [audio, setAudio] = useState();


    let [askForUsername, setAskForUsername] = useState(true);
    let [username, setUsername] = useState("");
    const videoRef = useRef([]);
    let [videos, setVideos] = useState([]);



    // if(isChrome() === false){

    // }
    const getPermissions = async () => {
        try {
            const videoPermission = await navigator.mediaDevices.getUserMedia({ video: true })
            if (videoPermission) {
                setVideoAvailabel(true);
            } else {
                setVideoAvailabel(false);
                console.log(`false`)
            }
            const audioPermission = await navigator.mediaDevices.getUserMedia({ audio: true });

            if (audioPermission) {
                setAudioAvailabel(true);
            } else {
                setAudioAvailabel(false);
            }

            if (videoAvailabel || audioAvailabel) {
                const userMediaStream = await navigator.mediaDevices.getUserMedia({ video: videoAvailabel, audio: audioAvailabel })

                if (userMediaStream) {
                    window.localStream = userMediaStream;
                    if (localVideoRef.current) {
                        localVideoRef.current.srcObject = userMediaStream;
                    }
                }
            }
        } catch (err) {
            console.log(`error is here`, err)
        }
    }

    useEffect(() => {
        getPermissions();
    }, [])

    let getUserMediaSuccess = (stream) => {
        try {
            window.localStream.getTracks().forEach(track => track.stop());
        } catch (e) { console.log(e) }

        window.localStream = stream;
        localVideoRef.current.srcObject = stream;

        for (let id in connections) {
            if (id === socketIdRef.current) continue;

            connections[id].addStream(window.localStream)

            connections[id].createOffer().then((description) => {
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit("signal", id, JSON.stringify({ "sdp": connections[id].localDescription }))
                    }).catch(e => console.log(e))
            })
        }
        stream.getTracks().forEach(track => track.onended = () => {
            setVideo(false);
            setAudio(false);
            try {
                let tracks = localVideoRef.current.srcObject.getTracks()

                tracks.forEach(track => track.stop())
            } catch (e) { console.log(e) }

            let blackSilence = ([black(...args), silence()])
            window.localStream = blackSilence();
            localVideoRef.current.srcObject = window.localStream;



            for (let id in connections) {
                connections[id].addStream(window.localStream)
                connections[id].createOffer().then((description) => {
                    connections[id].setLocalDescription(description).then(() => {
                        socketRef.current.emit("signal", id, JSON.stringify({ "sdp": connections[id].localDescription }))
                    }).catch(e => console.log(e))
                })
            }
        })
    }

    let silence = () => {
        let ctx = new AudioContext()
        let oscillator = ctx.createOscillator();
        let dst = oscillator.connect(ctx.createMediaStreamDestination());

        oscillator.start();
        ctx.resume()
        return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false })
    }
    let black = ({ width = 640, height = 480 } = {}) => {
        let canvas = Object.assign(document.createElement("canvas"), { width, height });
        canvas.getContext('2d').fillRect(0, 0, width, height);
        let stream = canvas.captureStream();
        return Object.assign(stream.getVideoTracks()[0], { enabled: false })
    }
    let getUserMedia = () => {
        if ((video && videoAvailabel) || (audio && audioAvailabel)) {
            navigator.mediaDevices.getUserMedia({ video: video, audio: audio }).then(getUserMediaSuccess).then((stream) => { }).catch((e) => console.log(`error ${e}`))
        } else {
            try {
                let tracks = localVideoRef.current.srcObject.getTracks();
                tracks.forEach(track => track.stop())
            }
            catch (e) {
                console.log(`error in get user media ${e}`)
            }
        }
    }
    useEffect(() => {
        if (video !== undefined && audio !== undefined) {
            getUserMedia();
        }
    }, [audio, video])
    let gotMessageFromServer = (fromId, message) => {
        var signal = JSON.parse(message)
        console.log(signal, `signal`)
        if (fromId !== socketIdRef.current) {

            if (signal.sdp) {
                connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(() => {
                    if (signal.sdp.type === "offer") {
                        connections[fromId].createAnswer().then((description) => {
                            connections[fromId].setLocalDescription(description).then(() => {
                                socketRef.current.emit("signal", fromId, JSON.stringify({ "sdp": connections[fromId].localDescription }))
                            }).catch(e => console.log(e))
                        }).catch(e => console.log(e))
                    }
                }).catch(e => console.log(e))
            }

            if (signal.ice) {
                connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(e => console.log(`signal ${e}`))
            }
        }
    }

    let connectToSocketServer = () => {
        if (socketRef.current) return;
        socketRef.current = io(server_url, { secure: false })

        socketRef.current.on('signal', gotMessageFromServer)
        console.log(1);
        socketRef.current.on("connect", () => {
            socketRef.current.emit("join-call", window.location.href)
            socketIdRef.current = socketRef.current.id
            // socketRef.current.on("chat-message",addMessage)

            socketRef.current.on("user-left", (id) => {
                setVideo((videos) => videos.filter((video) => video.socketId !== id))
            })

            socketRef.current.on("user-joined", (id, clients) => {

                clients.forEach((socketListId) => {
                    connections[socketListId] = new RTCPeerConnection(peerConfigConnections)

                    connections[socketListId].onicecandidate = (event) => {
                        console.log(event.candidate, `event `)
                        if (event.candidate != null) {
                            socketRef.current.emit("signal", socketListId, JSON.stringify({ 'ice': event.candidate }))
                        }
                    }

                    connections[socketListId].onaddstream = (event) => {
                        let videosExists = videoRef.current.find(video => video.socketId === socketListId);
                        if (videosExists) {
                            setVideo(video => {
                                const updateVideos = videos.map(video =>
                                    video.socketId === socketListId ? { ...video, stream: event.stream } : video
                                )
                                videoRef.current = updateVideos;
                                return updateVideos;
                            })
                        } else {
                            let newVideo = {
                                socketId: socketListId,
                                stream: event.stream,
                                autoPlay: true,
                                playsinline: true
                            }
                            setVideos(videos => {
                                const updatedVideos = [...videos, newVideo];
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            })
                        }
                    }

                    if (window.localStream !== undefined && window.localStream !== null) {
                        connections[socketListId].addStream(window.localStream);
                    } else {
                        //    let blackSilence = ([black(...args),silence()])
                        //    window.localStream = blackSilence();
                        //    connections[socketListId].addStream(window.localStream);
                        let audioTrack = silence();
                        let videoTrack = black();
                        window.localStream = new MediaStream([videoTrack, audioTrack]);
                        connections[socketListId].addStream(window.localStream);
                    }
                })

                if (id === socketIdRef.current) {
                    for (let id2 in connections) {
                        if (id2 === socketIdRef.current) continue

                        try {
                            connections[id2].addStream(window.localStream)
                        } catch (e) {

                        }
                        connections[id2].createOffer().then((description) => {
                            connections[id2].setLocalDescription(description).then(() => {
                                socketRef.current.emit("signal", id2, JSON.stringify({ "sdp": connections[id2].localDescription }))
                            }).catch(e => console.log(e))
                        })
                    }
                }
            })
        })
    }
    let getMedia = () => {
        setVideo(videoAvailabel);
        setAudio(audioAvailabel);
        if (!socketRef.current) {
            connectToSocketServer();
        }
    }
    let connect = () => {
        setAskForUsername(false);
        getMedia();
    }
    let handleVideo = () => {
        setVideo(!video);
    }
    let handleAudio = () => {
        setAudio(!audio);
    }


    let handleEndCall = () => {
        try {
            let tracks = localVideoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop())
        } catch (e) { }
        routeTo('/VC/home');
    }
    return (
        <div className="mainD">
            {
                askForUsername === true ?
                    <div className="lobby">
                        <h1>Set up your mic and camera</h1>
                        <div className='txt'>
                            <TextField id="standard-basic" label="Enter Username" value={username} onChange={e => setUsername(e.target.value)} variant="standard" /></div>

                        <div className='self-video'>
                            <video ref={localVideoRef} autoPlay muted></video>
                        </div>

                        <div className='btndiv'>
                           
                            <IconButton size="small" className='icon' onClick={handleVideo}>
                                {(video === true) ? <VideocamIcon sx={{ fontSize: 40 }}></VideocamIcon> : <VideocamOffIcon sx={{ fontSize: 40 }}></VideocamOffIcon>}
                            </IconButton>

                            <IconButton size="small" className='icon' onClick={handleAudio}>
                                {(audio === true) ? <MicIcon sx={{ fontSize: 40 }}></MicIcon> : <MicOffIcon sx={{ fontSize: 40 }}></MicOffIcon>}
                            </IconButton>

                            <Button id="connectBtn" variant="outlined" size="small" onClick={connect}>Connect</Button>
                        </div>
                        <h1>Give this meeting code to your friends to join you.</h1>
                    </div>
                    :
                    <div className='videoCon'>
                        <div className='afterJoinself' >
                             <p>{username}</p>
                            <video ref={localVideoRef} autoPlay muted></video> 
                           
                        </div>
                        <div className="videoBtn">

                            <IconButton size="small" className='icon' onClick={handleVideo}>
                                {(video === true) ? <VideocamIcon sx={{ fontSize: 40 }}></VideocamIcon> : <VideocamOffIcon sx={{ fontSize: 40 }}></VideocamOffIcon>}
                            </IconButton>

                            <IconButton size="small" className='icon' onClick={handleAudio}>
                                {(audio === true) ? <MicIcon sx={{ fontSize: 40 }}></MicIcon> : <MicOffIcon sx={{ fontSize: 40 }}></MicOffIcon>}
                            </IconButton>
                            <IconButton className='icon'>

                                <CallEndIcon sx={{ fontSize: 50 }} color="action" onClick={handleEndCall} />
                            </IconButton>
                        </div>
                        <div className='allVideo'>
                            {videos.map((video) => (
                                <div key={video.socketId}>
                                    <video
                                        data-socket={video.socketId}
                                        ref={ref => {
                                            if (ref && video.stream) {
                                                ref.srcObject = video.stream
                                            }
                                        }
                                        }
                                        autoPlay></video>
                                        <p>{username}</p>
                                </div>
                            ))}
                        </div>
                    </div>
            }
        </div>
    )
}

export default Meet;
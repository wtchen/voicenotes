var audioCtx = null;
var recorder = null;
var lstream = null;

var Controls = React.createClass({displayName: "Controls",
    getInitialState: function() {
        return {isRecording: false};
    },
    handleClick: function(e) {
        if (this.state.isRecording) {
            recorder.stop();
            recorder.exportWAV(function(blob) {
                var URL = window.URL || window.webkitURL;
                var url = URL.createObjectURL(blob);
                var link = document.createElement('a');
                link.href = url;
                link.download = new Date().toISOString() + '.wav';
                link.innerHTML = link.download + "<br/>";
                document.getElementById("myGallery").appendChild(link);
                var audio = document.querySelector("audio");
                audio.src = url;
            });
            lstream.stop();
            audioCtx = null;
            recorder = null;
            lstream = null;
            this.setState({isRecording: false});
            toastr.info("Recording stopped");
            document.getElementById("recBtn").innerHTML = "<span class=\"glyphicon glyphicon-record\"/>";
        }
        else {
            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
                navigator.mozGetUserMedia || navigator.msGetUserMedia;
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            var URL = window.URL || window.webkitURL;
            if (navigator.getUserMedia && window.AudioContext) {
                navigator.getUserMedia({video: true, audio: true}, function(stream) {
                    lstream = stream;
                    audioCtx = new window.AudioContext;
                    recorder = new Recorder(audioCtx.createMediaStreamSource(stream),
                        {workerPath: "javascripts/libraries/recorderWorker.js"});
                    recorder.record();
                }, function(err) {
                    console.log(err);
                });
                document.getElementById("recBtn").innerHTML = "<span class=\"glyphicon glyphicon-stop\"/>";
                toastr.info("Now recording...");
                this.setState({isRecording: true});
            }
            else {
                if (toastr) toastr.error("Your browser isn't supported.");
                else alert("Your browser isn't supported.");
            }
        }
    },
    render: function() {
        return (
            React.createElement("div", {className: "recording-widget"}, 
                React.createElement("table", null, 
                    React.createElement("tr", null, 
                        React.createElement("td", null, React.createElement("audio", {controls: true})), 
                        React.createElement("td", null, 
                            React.createElement("div", {className: "btn btn-default", id: "recBtn", onClick: this.handleClick}, 
                                React.createElement("span", {className: "glyphicon glyphicon-record"})
                            )
                        )
                    )
                )
            )
        );
    }
});

React.render(React.createElement(Controls, null), document.getElementById("myAudioControls"));

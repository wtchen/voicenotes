var lstream = null;

var Controls = React.createClass({displayName: "Controls",
    getInitialState: function() {
        return {isRecording: false, previewing: false};
    },
    handleClick: function(e) {
        if (this.state.isRecording) {
            this.setState({isRecording: false});
            if (this.state.previewing) {
                var video = document.querySelector("video");
                video.src = "";
                lstream.stop();
                lstream = null;
            }
            toastr.info("Recording stopped");
            document.getElementById("recBtn").innerHTML = "<span class=\"glyphicon glyphicon-record\"/>";
        }
        else {
            if (!this.state.previewing) {
                navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
                    navigator.mozGetUserMedia || navigator.msGetUserMedia;
                var URL = window.URL || window.webkitURL;
                if (navigator.getUserMedia) {
                    navigator.getUserMedia({video: true, audio: true}, function(stream) {
                        lstream = stream;
                        var video = document.querySelector("video");
                        video.src = URL.createObjectURL(stream);
                    }, function(err) {
                        console.log(err);
                    });
                    this.setState({previewing: true});
                }
                else {
                    if (toastr) toastr.error("Your browser isn't supported.");
                    else alert("Your browser isn't supported.");
                }
            }
            if (navigator.getUserMedia) {
                this.setState({isRecording: true});
                document.getElementById("recBtn").innerHTML = "<span class=\"glyphicon glyphicon-stop\"/>";
                toastr.info("Now recording...");
            }
        }
        console.log("state: " + JSON.stringify(this.state));
    },
    render: function() {
        return (
            React.createElement("div", {className: "recording-widget"}, 
                React.createElement("table", null, 
                    React.createElement("tr", null, 
                        React.createElement("td", null, React.createElement("video", {width: 400, height: 300, autoPlay: true})), 
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

import React from "react";
import video1 from "../../media/video/GA PSA BR_v2.mp4";
// import video2 from "./video/vd2.ogv";
// import video3 from "./video/vd3.webm";

const Video = () => {
    return (
        <div className="w-full">
            <video
                src={video1}
                controls
                className="w-full h-auto rounded-lg shadow-lg"
                preload="metadata"
                autoplay="true"
            >
                Your browser does not support the video tag.
            </video>
        </div>
    );
};

export default Video;
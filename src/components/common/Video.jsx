import React, { useRef, useEffect } from "react";

const video1 = "/video/GA PSA BR_v2.mp4";
// import video2 from "./video/vd2.ogv";
// import video3 from "./video/vd3.webm";

const Video = () => {
    const videoRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        // Video is in viewport, play it
                        videoRef.current?.play();
                    } else {
                        // Video is out of viewport, pause it
                        videoRef.current?.pause();
                    }
                });
            },
            {
                threshold: 0.25, // Trigger when 25% of video is visible
            }
        );

        if (videoRef.current) {
            observer.observe(videoRef.current);
        }

        return () => {
            if (videoRef.current) {
                observer.unobserve(videoRef.current);
            }
        };
    }, []);

    return (
        <div className="w-full">
            <video
                ref={videoRef}
                src={video1}
                controls
                autoplay
                muted
                className="w-full h-auto rounded-lg shadow-lg"
                preload="metadata"
            >
                Your browser does not support the video tag.
            </video>
        </div>
    );
};

export default Video;
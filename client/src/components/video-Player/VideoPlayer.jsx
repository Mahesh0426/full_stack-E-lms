import React from "react";
import ReactPlayer from "react-player";

const VideoPlayer = (props) => {
  const { width = "100%", height = "100%", url } = props;
  return (
    <div>
      <ReactPlayer width={"100%"} height={"100%"} url={url} />
    </div>
  );
};

export default VideoPlayer;
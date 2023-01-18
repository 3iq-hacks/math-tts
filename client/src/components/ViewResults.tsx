import React from "react";
import ReactAudioPlayer from "react-audio-player";

interface Props {
    audioURL: string
}

const ViewResults: React.FC<Props> = ({ audioURL }) => {
    return (
        <div
            style={{
                justifyContent: "center",
                alignItems: "center",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <img
                src="https://media.tenor.com/MjdDlyCEARcAAAAC/math-dance.gif"
                alt=""
                width="200px"
                style={{ borderRadius: "10px" }}
            />
            <p style={{ padding: "10px" }}>Let's listen to some math!</p>
            <ReactAudioPlayer src={`${audioURL}`} controls />
        </div>
    );
};

export default ViewResults;
import React from "react";
import './bouncer.css';

const DotsLoader = (props) => {
    return (
        <div className="bouncing-loader">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    );
};

export default DotsLoader;
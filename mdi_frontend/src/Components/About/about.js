

import "./about.css"


const About = () => {
    return(
        <div style={{width:"100%",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
            <div className="card_about">
                <div>
                    <header style={{fontSize:"18px",color:"#007d79"}}><b>About</b></header><br/>
                </div>
                <div>
                    <div>
                        <header style={{fontSize:"15px",color:"#007d79"}}><b>Brief Description</b></header>
                    </div>
                    <ul style={{fontSize:"15px"}}>
                        <li>Most of the people in a country consume medical drugs without any knowledge on whether it is genuine or approved by government. </li>
                        <li>RxMisInfoCheck application helps people to know whether the medical drug is approved or not. </li>
                        <li>RxMisInfoCheck has browser extension as well. </li>
                        <li>Please add it to your browser for faster results. </li>
                        <li>Always check with doctor based on result.</li>
                    </ul>
                </div> <br />
                <div>
                    <div>
                        <header style={{fontSize:"15px",color:"#007d79"}}><b>Tools/Technology</b></header>
                    </div>
                    <ul>
                        <li>Python (Flask)</li>
                        <li>ReactJs</li>
                        <li>Redis</li>
                        <li>Azure</li>
                        <li>Docker</li>
                        <li>Browser extension</li>
                        <li>Tamper monkey</li>
                    </ul>
                </div> <br/>
                <div>
                    <div>
                        <header style={{fontSize:"15px",color:"#007d79"}}><b>Links</b></header>
                    </div>
                    <ul>
                        <li><a href="https://bit.ly/3UnBcSN" target="_blank" rel="noreferrer" style={{textDecoration:"none"}}>Browser extension</a></li>
                    </ul>
                </div>
            </div>
            {/* <div className="card_about">
                <div>
                    <header style={{fontSize:"18px",color:"#007d79"}}><b>Demo</b></header><br/>
                </div>
                <div>
                    
                </div>
            </div> */}
        </div>
    );
}

export default About;
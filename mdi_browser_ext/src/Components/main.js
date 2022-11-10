
import React, { Fragment } from 'react';
import './main.css';
import { useState } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../constants';
import BouncingDotsLoader from './bouncer';



const Main = (props) =>{

    const [result, setResult] = useState("");
    const [isResult, setIsResult] = useState("");
    const [isBrandNameChecked, setBrandName] = useState(false);
    const [isNDCcode, setNDCcode] = useState(false);
    const [isLoader, setloader] = useState(false);
    const [notAvailableMessage, setNotAvailableMessage] = useState("");
    const [userInput, setUserInput] = useState("");
    const handleUserInput = event => {
        setUserInput(event.target.value);
    }
    


    const handleSubmit = (event) => {
        event.preventDefault();
        setloader(true);

        if (isNDCcode === false && isBrandNameChecked === false){
            console.warn('Please select the search criteria', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            return
        }
        
        let type = null
        if(isNDCcode){
            type = "ndc"
        } else {
            type = "brandName"
        }

        setIsResult("");
        setNotAvailableMessage("");
        setBrandName(false);
        setNDCcode(false);

        axios.get(`${BACKEND_URL}${userInput}?type=${type}`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                "Access-Control-Allow-Origin": "*",
                'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token',
                'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
                "Access-Control-Allow-Credentials":"*",
            }
        })
        .then((res) => {
            if(res.status === 200){
                setUserInput("");
                if(res.data.response.flag === true){
                    setIsResult(res.data.response.flag);
                    setResult(res.data.response.message);
                } else {
                    console.warn(res.data.response.message);
                }
            }
            setloader(false);
        })
        .catch((error) => {
            if(error.response.status === 404 || error.response.status === 500){
                console.error(error.response.data.response.server_message);
                setNotAvailableMessage(
                    <div>
                        <div className='notAvailable'>
                            <label>{userInput} - {error.response.data.response.message}</label>
                        </div>
                    </div>
                );
                setIsResult(false);
                setUserInput("");
            }
            setloader(false);
        })
        
    }

    let loader = undefined
    if(isLoader === true){
        loader = <BouncingDotsLoader/> 
    }
    else {
        loader = <span></span>
    }


    return (
        <Fragment>

            <div style={{display:"flex",flexDirection:"column",flexWrap:"wrap"}}>
                <div style={{display:"flex",flexDirection:"row",justifyContent:"center",flexWrap:"wrap"}}>
                    {/* This below div is for the search of the medical drug  */}
                    <div className='upper_div_main'>  
                        <div className='card'>
                            <form onSubmit={handleSubmit}>
                                <div style={{padding:"10px",}}>
                                    <header style={{fontSize:"18px",color:"#007d79"}}><b>Medical Drug Search</b></header>
                                </div>
                                <br/>

                                <div style={{position:"relative"}}>
                                    <input type="text" className='input' placeholder='' name="userInput" value={userInput} autoComplete="off" onChange={handleUserInput} required autoFocus  />
                                    <label className='placeholder' htmlFor="userInput">Enter medical drug details</label>
                                </div>
                                <br/>
                                <div>
                                    <p style={{fontSize:"15px"}}>Select the search criteria</p>
                                    <label className="container">Brand Name
                                        <input type="radio" name="radio" checked={isBrandNameChecked} onChange={()=>{setBrandName(true); setNDCcode(false)}} />
                                        <span className="checkmark"></span>
                                    </label> <br/><br/>
                                    <label className="container">NDC Code
                                        <input type="radio" name="radio" checked={isNDCcode} onChange={()=>{setNDCcode(true); setBrandName(false)}} />
                                        <span className="checkmark"></span>
                                    </label>
                                </div>
                                <br/><br/>
                                <button type='submit'>Submit</button>
                            </form>

                            <div style={{display:"flex",marginTop:"30px",flexWrap:"wrap"}}>
                                {loader}
                            </div>
                        
                            <div style={{display:"flex",flexWrap:"wrap"}}>
                                {
                                    isResult ? 
                                    <div>
                                        <header style={{fontSize:"15px",color:"#007d79"}}><b>Medical drug details</b></header><br/>
                                        <div>
                                            <label><b>Generic Name</b></label><br/>
                                            <label>{result.results[0]['generic_name']}</label>
                                        </div><br/>

                                        <div>
                                            <label><b>Brand Name</b></label><br/>
                                            <label>{result.results[0]['brand_name']}</label>
                                        </div><br/>

                                        <div>
                                            <label><b>Manufacturer Name</b></label><br/>
                                            <label>{result.results[0]['labeler_name']}</label>
                                        </div><br/>

                                        <div>
                                            <label><b>Product NDC</b></label><br/>
                                            <label>{result.results[0]['product_ndc']}</label>
                                        </div><br/>
                                        <label><b>Note - </b><br/> For more details visit - 
                                            <a href="https://bit.ly/3sWc4pR" target="_blank" rel="noreferrer" style={{textDecoration:"none",color:"dodgerblue",marginLeft:"2px"}}>
                                                Click here
                                            </a>
                                        </label>
                                    </div>
                                    : <span>{notAvailableMessage}</span>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}


export default Main;
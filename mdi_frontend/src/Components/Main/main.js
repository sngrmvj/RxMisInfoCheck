
import React, { Fragment } from 'react';
import './main.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MedicalDetailsComponent from '../MedicalDetails/medical_details';
import NotFoundComponent from '../NotFoundComponent/not_found_component';
import DotsLoader from '../Bouncer/bouncer';
import { BACKEND_URL } from '../../constants';


const toast_error_options = {
    position: "top-right",autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
}
const toast_warn_options = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
}




const Main = (props) =>{

    const [result, setResult] = useState("");
    const [isResult, setIsResult] = useState("");
    const [isBrandNameChecked, setBrandName] = useState(false);
    const [isNDCcode, setNDCcode] = useState(false);
    const [notAvailableMessage, setNotAvailableMessage] = useState("");
    const [isLoader, setloader] = useState(false);
    const [displayNDCcodes, setNDCCodes] = useState(["0280-1200","0777-3105"]);
    const [displayBrandNames, setBrandNames] = useState(["Aleve","Prozac"]);
    const [userInput, setUserInput] = useState("");
    const handleUserInput = event => {
        setUserInput(event.target.value);
    }


    useEffect(() => {
        axios.get(`${BACKEND_URL}recentlyUsed`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                "Access-Control-Allow-Origin": "*",
                'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token',
                'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
                "Access-Control-Allow-Credentials":"*",
            }
        })
        .then((result) => {
            if (result.data.flag === true){
                setNDCCodes(result.data.response.ndc);
                setBrandNames(result.data.response.names);
            } 
            else {
                toast.warn(result.data.response);
            }
        })
        .catch((error) =>{
            toast.error(error.response.data.response.server_message, toast_error_options);
        })
    }, [isResult]);


    const handleSubmit = (event) => {
        event.preventDefault();
        setloader(true);

        if (isNDCcode === false && isBrandNameChecked === false){
            toast.warn('Please select the search criteria', {
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
                    toast.warn(res.data.response.message, toast_warn_options);
                }

            }
            setloader(false);
        })
        .catch((error) => {
            if(error.response.status === 404 || error.response.status === 500){
                toast.error(error.response.data.response.server_message, toast_error_options);
                let errorMessages = [false];
                errorMessages.push(error.response.data.response.message)
                setNotAvailableMessage(
                    <NotFoundComponent medicalResult={errorMessages} />
                );
                setIsResult(false);
                setUserInput("");
            }
            setloader(false);
        })
    }

    let loader = undefined
    if(isLoader === true){
        loader = <DotsLoader/> 
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
                                    </label>
                                    <label className="container" style={{marginLeft:"50px"}}>NDC Code
                                        <input type="radio" name="radio" checked={isNDCcode} onChange={()=>{setNDCcode(true); setBrandName(false)}} />
                                        <span className="checkmark"></span>
                                    </label>
                                </div>
                                <br/><br/>
                                <button type='submit'>Submit</button>
                            </form>
                        </div>
                    </div>
                    {/* This below div is for the Recently searched  */}
                    <div className='card'>
                        <div>
                            <header style={{fontSize:"18px",color:"#007d79"}}><b>Recently Searched</b></header><br/>
                        </div>
                        <div>
                            <header style={{fontSize:"15px",color:"#007d79"}}><b>Brand Names</b></header>
                            <div style={{display:"flex",flexDirection:"row",paddingTop:"5px",paddingBottom:"5px",flexWrap: "wrap"}}>
                                {
                                    displayBrandNames.map((brand_name, index) => {
                                        return <form onSubmit={handleSubmit} key={index} >
                                            <button 
                                                style={{padding:"5px",border:"2px solid #01b5af",borderRadius:"5px",marginRight:"10px", marginBottom:"10px",cursor:"pointer"}}
                                                onClick={() => {
                                                    setUserInput(brand_name); 
                                                    setBrandName(true); 
                                                    setNDCcode(false);
                                                }}
                                            >
                                                {brand_name}
                                            </button>
                                        </form>

                                    })
                                }
                            </div>
                        </div>
                        <div>
                            <header style={{fontSize:"15px",color:"#007d79"}}><b>NDC codes</b></header>
                            <div style={{display:"flex",flexDirection:"row",paddingTop:"5px",paddingBottom:"5px"}}>
                                {
                                    displayNDCcodes.map((ndc_code, index) => {
                                        return <form onSubmit={handleSubmit} key={index} >
                                            <button 
                                                style={{padding:"5px",border:"2px solid #01b5af",borderRadius:"5px",marginRight:"10px", cursor:"pointer"}}
                                                onClick={() => {
                                                    setUserInput(ndc_code); 
                                                    setBrandName(false); 
                                                    setNDCcode(true);
                                                }}
                                            >
                                                {ndc_code}
                                            </button>
                                        </form>
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{display:"flex",marginTop:"30px",justifyContent:"center",flexWrap:"wrap"}}>
                    {loader}
                </div>

                {/* This below div is for right side display of the result  */}
                <div style={{display:"flex",marginTop:"50px",justifyContent:"center",flexWrap:"wrap"}}>
                    {
                        isResult ? <MedicalDetailsComponent medicalResult={result} /> : <span>{notAvailableMessage}</span>
                    }
                </div>
            </div>


            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
        </Fragment>
    );
}


export default Main;
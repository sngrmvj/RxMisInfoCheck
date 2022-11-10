
import React, { Fragment } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useState } from 'react';
import axios from 'axios';
import BulkMedicalComponent from '../BulkDataDisplay/bulk_medical_display';
import NotFoundComponent from '../NotFoundComponent/not_found_component';
import DotsLoader from '../Bouncer/bouncer'; 
import './bulk_search.css';
import 'react-toastify/dist/ReactToastify.css';
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


const BulkSearch = (props) =>{

    const [result, setResult] = useState("");
    const [isResult, setIsResult] = useState("");
    const [isBrandNameChecked, setBrandName] = useState(false);
    const [isNDCcode, setNDCcode] = useState(false);
    const [userInput, setUserInput] = useState("");
    const [isLoader, setloader] = useState(false);
    const [listOfNDCCodes, setListOfNDCCodes] = useState([]);
    const [listOfBrandNames, setListOfBrandNames] = useState([]);
    const handleUserInput = event => {
        setUserInput(event.target.value);
    }

    const addToList = () => {
        if ((listOfNDCCodes.length + listOfBrandNames.length) < 5){
            if(isNDCcode === true){
                listOfNDCCodes.push(userInput)
                setListOfNDCCodes(listOfNDCCodes);
            } else if (isBrandNameChecked === true){
                listOfBrandNames.push(userInput)
                setListOfBrandNames(listOfBrandNames);
            } else {
                toast.warn("Please select the criteria of search")
            } 
        } else {
            toast.warn("We limited the search to 5 items",toast_warn_options);
        }
        
        setNDCcode(false);
        setBrandName(false);
        setUserInput("");  
    }

    const handleSubmit = () =>{

        setloader(true);
        
        if (listOfBrandNames.length > 0 || listOfBrandNames > 0){

            toast.info("Please wait while we fetch you the results.....");

            const body = JSON.stringify({
                "ndc" : listOfNDCCodes,
                "brand_name": listOfBrandNames
            })

            axios.put(`${BACKEND_URL}bulk/`, body, {
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
                setIsResult(true);
                setResult(res.data.response.message);
                setloader(false);
            })
            .catch((error) => {
                toast.error("Error in fetching the bulk data",toast_error_options);
                setloader(false);
            })

            // Setting the arrays to empty
            setListOfBrandNames([]);
            setListOfNDCCodes([]);
        } else {
            toast.warn("Kindly enter brand name or NDC code for the medical drug details")
        }
    }

    let loader = undefined
    if(isLoader === true){
        loader = <DotsLoader/> 
    }
    else {
        loader = <span></span>
    }



    return(
        <Fragment>
            <div>
                {/* This below div is for the search of the medical drug  */}
                <div className='upper_div_bulk'>  
                    <div className='card_bulk'>
                        <div style={{padding:"10px",}}>
                            <header style={{fontSize:"18px",color:"#007d79"}}><b>Medical drug bulk search</b></header>
                        </div>
                        <br/>

                        <div style={{position:"relative"}}>
                            <input type="text" className='input_bulk' placeholder='' name="userInput" value={userInput} autoComplete="off" onChange={handleUserInput} required autoFocus  />
                            <label className='placeholder_bulk' htmlFor="userInput">Enter medical drug details</label>
                        </div>
                        <br/>
                        <div>
                            <p>Select the search criteria</p>
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
                        <button className='button_bulk' onClick={addToList}>Add</button>
                    </div>
                    <div className='card_bulk' style={{marginLeft:"0.5px",height:"313px",scroll:"auto"}}>
                        <div>
                            <header style={{fontSize:"18px",color:"#007d79"}}><b>Added Items</b></header>
                        </div>
                        <br/>

                        <div>
                            <header style={{fontSize:"15px",color:"#007d79"}}><b>Brand names</b></header>
                            <div style={{display:"flex",flexDirection:"row",paddingTop:"5px",paddingBottom:"5px",flexWrap: "wrap"}}>
                                {
                                    listOfBrandNames.map((brand_name, index) => {
                                        return <label 
                                                key={index} 
                                                style={{padding:"5px",border:"1px solid #01b5af",borderRadius:"5px",marginRight:"10px", marginBottom:"10px",cursor:"auto"}}
                                            >
                                                {brand_name}
                                        </label>
                                    })
                                }
                            </div>
                        </div>
                        <br/>

                        <div>
                            <header style={{fontSize:"15px",color:"#007d79"}}><b>NDC codes</b></header>
                            <div style={{display:"flex",flexDirection:"row",paddingTop:"5px",paddingBottom:"5px",flexWrap: "wrap"}}>
                                {
                                    listOfNDCCodes.map((ndc_code, index) => {
                                        return <label 
                                                key={index} 
                                                style={{padding:"5px",border:"1px solid #01b5af",borderRadius:"5px",marginRight:"10px", marginBottom:"10px",cursor:"auto"}}
                                            >
                                                {ndc_code}
                                        </label>
                                    })
                                }
                            </div>
                        </div>

                        <br/>
                        <button className='button_bulk' type='submit' onClick={handleSubmit}>Submit</button>
                    </div>
                </div>

                <br/><br/><br/>

                <div style={{display:"flex",marginTop:"10px",justifyContent:"center",flexWrap:"wrap"}}>
                    {loader}
                </div>

            
                <br/><br/><br/>

                <div className='lower_div_bulk'>
                    {
                        isResult ? <div>
                            <div style={{display:"flex",flexWrap:"wrap",flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
                                <header style={{fontSize:"18px",color:"#007d79"}}><b>Results</b></header> <br/>
                            </div>
                            
                            <div style={{display:"flex",flexWrap:"wrap",flexDirection:"row",justifyContent:"center"}}>
                                {
                                    result.map((item, index) => {
                                        if(item[0]){
                                            return <BulkMedicalComponent key={index} medicalResult={item} />
                                        } else {
                                            return <NotFoundComponent key={index} medicalResult={item} />
                                        }
                                    })
                                }
                            </div> 
                        </div>:<span></span>
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


export default BulkSearch;
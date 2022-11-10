

import React from 'react';
import { useState } from 'react';
import './not_found_component.css';


const NotFoundComponent = (props) =>{

    const [result,setResult] = useState(props);
    console.log(result)

    return (
        <div style={{margin:"10px"}}>
            <div className='card_display_notFound' >
                <div style={{display:"flex",justifyContent:"center",alignItems:"center",marginLeft:"20px"}}>
                    <div className='notAvailable'>
                        <label>{result.medicalResult[1]}</label>
                    </div>
                </div> 
            </div>
        </div>

    );
}

export default NotFoundComponent;

import { useState} from 'react';
import './bulk_medical_display.css';

const BulkMedicalComponent = (props) => {

    const [result,setResult] = useState(props.medicalResult);

    return(
        <div style={{margin:"10px"}}>
            <div className='card_display_bulk'>
                <div>
                    <header style={{fontSize:"18px",color:"#007d79"}}><b>Medical drug details</b></header><br/>
                </div>
    
                <table>
                    <tr>
                        <td><b>Generic Name</b></td>
                        <td>{result[1].results[0].generic_name}</td>
                    </tr>
                    <tr>
                        <td><b>Brand Name</b></td>
                        <td>{result[1].results[0].brand_name}</td>
                    </tr>
                    <tr>
                        <td><b>Manufacturer Name</b></td>
                        <td>{result[1].results[0].labeler_name}</td>
                    </tr>
                    <tr>
                        <td><b>Product NDC</b></td>
                        <td>{result[1].results[0].product_ndc}</td>
                    </tr>
                    <tr>
                        <td><b>Ingredients</b></td>
                        <td>
                            {
                            `${result[1].results[0].active_ingredients[0].name}, Strength: ${result[1].results[0].active_ingredients[0].strength}`
                            }
                        </td>
                    </tr>
                </table>
                
                <br/><br/><br/>
                
                <div>
                    <header style={{fontSize:"18px",color:"#007d79"}}><b>Medical drug usage</b></header><br/>
                </div>
                <table>
                    <tr>
                        <td><b>Dosage Form</b></td>
                        <td>{result[1].results[0].dosage_form}</td>
                    </tr>
                    <tr>
                        <td><b>Product Type</b></td>
                        <td>{result[1].results[0].product_type}</td>
                    </tr>
                    <tr>
                        <td><b>Drug usage</b></td>
                        <td>{result[1].results[0].route.join(" ")}</td>
                    </tr>
                    <tr>
                        <td><b>Application Number</b></td>
                        <td>{result[1].results[0].application_number}</td>
                    </tr>
                </table>
            </div> 
        </div>
    );
}


export default BulkMedicalComponent;
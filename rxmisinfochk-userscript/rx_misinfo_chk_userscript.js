// ==UserScript==
// @name         RxMisInfoCheck Userscript
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  We shall use this when ever we come across a medical drug and to understand whether it is a genuine or government approved.
// @author       You
// @match        https://www.google.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// ==/UserScript==


(function() {
    'use strict';



    // Attributes
    var gotResult = undefined;
    var inputByUser = undefined;
    var apiResult = undefined;
    const BACKEND_URL = "https://medical-information-backend.calmplant-554ed655.centralus.azurecontainerapps.io/"


    // Your code here...
    var frag = document.createDocumentFragment(); // We have fragment as a main container as it renders into the body easily without any overload




    // ----------------------------------------------------- Main Division----------------------------------------------------

    // Fragment has two divisions Main Division, Main division has "Division" and "Second division"
    const mainDivision = document.createElement("div"); // Main Division

    // -----------------------------------------------------------------------------------------------------------------------




    // -----------------------------------------------------  Division----------------------------------------------------

    // Round div which appears on top right corner which holds round div and the image
    const division = document.createElement("div");
    division.style.cssText = 'bottom: 0;right:0;margin-right:100px;margin-bottom:690px;position: fixed;z-index: 1000000000000000';

    // Chat round div
    const chatDiv = document.createElement("div");
    chatDiv.style.cssText = 'position:absolute;border-radius:80px;width:60px;height:60px;background-color:#fff;border:2px solid goldenrod';

    // Chat Image and this belongs to chat Div
    const chatImage = document.createElement("img");
    chatImage.src = "https://cdn-icons-png.flaticon.com/64/3140/3140343.png"
    chatImage.style.cssText = 'cursor:pointer;margin-top:8px;margin-left:10px;width:40px;height:40px';
    chatImage.onclick = () =>{
        let displayBodyId = document.getElementById('displayBody');
        let viewBodyId = document.getElementById('viewDiv');
        if (displayBodyId.style.visibility === 'hidden' && viewBodyId.style.visibility === 'hidden'){
            displayBodyId.style.visibility = 'visible';
            viewBodyId.style.visibility = 'visible';
        } else {
            displayBodyId.style.visibility = 'hidden';
            viewBodyId.style.visibility = 'hidden';
        }
    };
    chatDiv.appendChild(chatImage);

    // -----------------------------------------------------------------------------------------------------------------------








    // -----------------------------------------------------Second  Division----------------------------------------------------

    // Second Division, It has the "displayBody" and "viewDiv"
    const secondMainDiv = document.createElement("div");
    secondMainDiv.style.cssText = 'top: 0;right:0;margin-right:110px;margin-top:100px;position: fixed;z-index: 1000000000000000';


    const displayBody = document.createElement("div");
    displayBody.id = 'displayBody';
    displayBody.style.cssText = 'visibility:hidden;flex-direction: column;padding: 20px;width: 300px;height: fit-oontent;display: flex;justify-content: center;border-top-left-radius: 10px;border-top-right-radius: 10px; background-color:#fff'

    const userHeader = document.createElement("header");
    userHeader.innerHTML = "Medical Drug search";
    userHeader.style.cssText = 'font-size:18px;color:#007d79';
    displayBody.appendChild(userHeader);

    const brake1 = document.createElement("br");
    displayBody.appendChild(brake1);

    const userInput = document.createElement("input");
    userInput.placeholder = 'Enter the medical drug details';
    userInput.id = "inputId"
    userInput.style.cssText = 'color:black;background-color:#fff;width: 250px;padding: 10px;box-sizing: border-box;outline: none;font-size: 15px;border: 2px solid #878d96;border-radius: 5px;';
    displayBody.appendChild(userInput);

    const brake2 = document.createElement("br");
    displayBody.appendChild(brake2);

    var radioHtml1 = '<span><input type="radio" id="radioHtml1" name="radioHTML"/> <label style="color:black;margin-top:-1px">Brand Name</label> </span>';
    const radioFragment = document.createElement('div');
    radioFragment.innerHTML =radioHtml1;
    displayBody.appendChild(radioFragment);

    const brake3 = document.createElement("br");
    displayBody.appendChild(brake3);

    var radioHtml2 = '<label style="color:black;margin-top:-1px"><input type="radio" id="radioHtml2" name="radioHTML" style="color:#fff;font-size:15px"/>NDC Code </label>';
    const radioFragment2 = document.createElement('div');
    radioFragment2.innerHTML =radioHtml2;
    displayBody.appendChild(radioFragment2);

    const brake4 = document.createElement("br");
    displayBody.appendChild(brake4);

    // ViewDiv gets displayed when the result comes. But this createElement is not getting created dynamically
    // So, it is separated
    // "viewDiv" content is in the the submitButton
    const viewDiv = document.createElement("div");
    viewDiv.id = 'viewDiv'
    viewDiv.style.cssText = 'visibility:hidden;flex-direction: column;padding: 20px;width: 300px;height: fit-oontent;display: flex;justify-content: center;border-bottom-left-radius: 10px;border-bottom-right-radius: 10px; background-color:#fff';


    const submitButton = document.createElement("button");
    submitButton.style.cssText = "border:2px solid #01b5af; width: 100px;background-color: #01b5af ; color: white; padding: 10px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; font-weight: bold; cursor: pointer; border-radius: 5px;";
    submitButton.innerHTML = 'Submit';
    submitButton.onclick = () => {

        let brandNameChecked = document.getElementById('radioHtml1').checked;
        let ndcCodeChecked = document.getElementById('radioHtml2').checked;

        const elementFailedDiv = document.getElementById("tempzFailedDiv");
        if (elementFailedDiv){
            elementFailedDiv.remove();
        }
        const elementSuccessDiv = document.getElementById("tempSuccessDiv");
        if (elementSuccessDiv){
            elementSuccessDiv.remove();
        }
        const noCriteriaDivElement = document.getElementById('noCriteriaSelectedDiv');
        if (noCriteriaDivElement){
            noCriteriaDivElement.remove();
        }

        if (brandNameChecked === true || ndcCodeChecked === true){

            var loader = "<span style='padding:10px;border-radius:5px;margin-top:10px;background-color: #e6e6e6'><label style='font-size:15px;color:black;'><b>Loading....</b></label></span>";
            const loaderDiv = document.createElement("div");
            loaderDiv.id = 'loaderDiv';
            loaderDiv.innerHTML = loader;
            viewDiv.appendChild(loaderDiv);

            const entered_text = document.getElementById("inputId");
            inputByUser = entered_text.value

            let options = {
                method: 'GET',
                headers: {
                    'Content-Type':
                    'application/json;charset=utf-8'
                },
            }

            let type = '';
            if (brandNameChecked === true){
                type = 'brand_name';
            } else {
                type = 'ndc';
            }
            let fetchResult = fetch(`${BACKEND_URL}${entered_text.value}?type=${type}`);
            fetchResult.then(res => res.json()).then( result => {
                const loaderId = document.getElementById("loaderDiv");
                loaderId.remove();
                const tempSuccessDiv = document.createElement("div");
                tempSuccessDiv.id = 'tempSuccessDiv'
                const tempzFailedDiv = document.createElement("div");
                tempzFailedDiv.id = 'tempzFailedDiv'
                if (result.response.flag === true){
                    let tempResults = result.response.message.results;
                    var successResultDiv = "<div style='color:black'>";
                    successResultDiv += "<header style='fontSize:15px;color:#007d79'><b>Medical drug details</b></header><br/>";
                    successResultDiv += "<div>";
                    successResultDiv += "<label><b>Generic Name</b></label><br/>";
                    successResultDiv += `<label>${tempResults[0].generic_name}</label>`;
                    successResultDiv += "</div><br/>";
                    successResultDiv += "<div>"
                    successResultDiv += "<label><b>Brand Name</b></label><br/>"
                    successResultDiv += `<label>${tempResults[0].brand_name}</label>`
                    successResultDiv += "</div><br/>"
                    successResultDiv += "<div>"
                    successResultDiv += "<label><b>Manufacturer Name</b></label><br/>"
                    successResultDiv += `<label>${tempResults[0].labeler_name}</label>`
                    successResultDiv += " </div><br/>"
                    successResultDiv += "<div>"
                    successResultDiv += "<label><b>Product NDC</b></label><br/>"
                    successResultDiv += `<label>${tempResults[0].product_ndc}</label>`
                    successResultDiv += "</div><br/>"
                    successResultDiv += "<label><b>Note - </b><br/> For more details visit - "
                    successResultDiv += "<a href='https://bit.ly/3sWc4pR' target='_blank' rel='noreferrer' style='textDecoration:none;color:dodgerblue;marginLeft:2px'>"
                    successResultDiv += "Click here"
                    successResultDiv += "</a>"
                    successResultDiv += "</label>"
                    successResultDiv += "</div>"
                    tempSuccessDiv.innerHTML = successResultDiv
                    viewDiv.appendChild(tempSuccessDiv);
                } else {
                    var failedResultDiv = "<div>";
                    failedResultDiv += "<div style='padding: 10px;border: 2px solid rgb(164, 0, 0);background-color: white;color: rgb(164, 0, 0);font-weight: bold;border-radius: 5px;'>";
                    failedResultDiv += `<label>${inputByUser} - ${result.response.message}</label>`;
                    failedResultDiv += "</div>";
                    failedResultDiv += "</div>";
                    tempzFailedDiv.innerHTML = failedResultDiv
                    viewDiv.appendChild(tempzFailedDiv);
                }
            })
        } else {
            let noCriteriaSelectedDiv = document.createElement('div');
            noCriteriaSelectedDiv.id = 'noCriteriaSelectedDiv';
            noCriteriaSelectedDiv.style.cssText = "padding:10px;border-radius:5px;margin-top:10px;background-color: orange";
            let labelForNoCriteria = document.createElement('div');
            labelForNoCriteria.innerText = "Please select atleast one criteria";
            labelForNoCriteria.style.cssText = 'color:white;font-weight:bold';
            noCriteriaSelectedDiv.appendChild(labelForNoCriteria);
            viewDiv.appendChild(noCriteriaSelectedDiv);
        }

        const getUserInputId = document.getElementById('inputId');
        getUserInputId.value = '';
        const getRadioInputId1 = document.getElementById('radioHtml1');
        getRadioInputId1.checked = false;
        const getRadioInputId2 = document.getElementById('radioHtml2');
        getRadioInputId2.checked = false;
    };
    displayBody.appendChild(submitButton);

    // -----------------------------------------------------------------------------------------------------------------------


    // -------------------------------------------------- Appendings ---------------------------------------------------------

    division.appendChild(chatDiv);
    secondMainDiv.appendChild(displayBody);
    secondMainDiv.appendChild(viewDiv);
    mainDivision.appendChild(secondMainDiv);
    mainDivision.appendChild(division);
    frag.appendChild(mainDivision);
    document.body.appendChild(frag);

    // -----------------------------------------------------------------------------------------------------------------------

})();
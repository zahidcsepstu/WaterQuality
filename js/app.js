const tempCUi = document.getElementById('tempinC'),
    tempFUi = document.getElementById('tempinF'),
    timeUi = document.getElementById('time'),
    turbidUi = document.getElementById('turbidity'),
    phUi = document.getElementById('phVal'),
    waterAlertUi = document.getElementById('water-alert'),
    drinkingResult = document.getElementById('drinkingResult'),
    aquaticResult = document.getElementById('aquaticResult'),
    agricultureResult = document.getElementById('agricultureResult'),
    waterAcidityUi = document.getElementById('waterAcidity')
    //processing returned object value. Keys name are random, so picking last key and return the value.
    processVal = (obj) => Number(obj[Object.keys(obj)[Object.keys(obj).length - 1]]);


const checkPropertyLimit =(lower,upper,val) =>{
    return !(val<lower || val>upper)
}

const setDangerUi = (val,upper,lower,elem) =>{
    if(val<lower || val >upper){
        elem.parentElement.className = 'properties bg-danger text-white'
        return false;
    }
    elem.parentElement.className = 'properties'
    return true;
}


const purposeSuitablity =(purpose,idealpHRange,idealTRange,pH,T,idealF=null,idealC=null,f=null,c=null)=>{
    
    const {lowerpH,upperpH} = idealpHRange;
    const {lowerT,upperT} = idealTRange;
    let txt;
    let html;
    if(idealF){
        const {lowerF,upperF} = idealF;
        const {lowerC,upperC} = idealC;
        if(checkPropertyLimit(lowerpH,upperpH,pH) && checkPropertyLimit(lowerT,upperT,T)  && checkPropertyLimit(lowerF,upperF,f) && checkPropertyLimit(lowerC,upperC,c)){
            txt = `Suitable for ${purpose}`;
            html = `<span class="text-success"> <i class="fas fa-check-circle"></i> ${txt}</span>`
            return html;
        }
    }else{
        if(checkPropertyLimit(lowerpH,upperpH,pH) && checkPropertyLimit(lowerT,upperT,T) ){
            txt = `Suitable for ${purpose}`;
            html = `<span class="text-success"> <i class="fas fa-check-circle"></i> ${txt}</span>`
            return html;
        }
    }
   
    txt = `Not Suitable for ${purpose}`;
    html = `<span class="text-danger"> <i class="fas fa-times-circle"></i> ${txt}</span>`
    return html

}


const setAcidityUi = (pH,ui) =>{
    let txt;

    if(pH>0 && pH<3) txt = 'Water is extremely acidic. Extremely acidic  pH range is between (0 - 3)'
    else if(pH>=3 && pH<4.5) txt = 'Water is acidic. Acidic  pH range (3 - 4.5)'
    else if(pH>=4.5 && pH<6.5) txt = 'Water is slightly acidic. Slightly acidic  pH range (4.5 - 6.5)'
    else if(pH>=6.5 && pH<7.5) txt = 'Water is neutral. Neutral pH range is (6.5 - 7.5)'
    else if(pH>=7.5 && pH<9.5) txt = 'Water is slightly basic. Slightly basic pH range is (7.5 - 9.5)'
    else if(pH>=9.5 && pH<11) txt = 'Water is basic. Basic pH range is (9.5 - 11)'
    else if(pH>=11 && pH<14) txt = 'Water is extremely basic. Extremely basic pH range is (11 - 14)'

    else txt = 'Water pH value is out of range'
    ui.textContent = txt;
}


const manipulateUi = ({ TempinC, TempinF, Time, Turbidity, pH }) => {
    const tempinC = processVal(TempinC),
        tempinF = processVal(TempinF),
        time = processVal(Time),
        turbidity = processVal(Turbidity),
        phVal = processVal(pH);
    
    tempCUi.textContent = tempinC +' °C';   
    tempFUi.textContent = tempinF+ ' °F';   
    timeUi.textContent = new Date(time).toLocaleTimeString();   
    turbidUi.textContent = turbidity;   
    phUi.textContent = phVal;  

    drinkingResult.innerHTML = purposeSuitablity('drinking',{lowerpH:6.5,upperpH:8},{lowerT:0,upperT:5},phVal,turbidity,{lowerF:50,upperF:104},{lowerC:10,upperC:40},tempinF,tempinC);
    aquaticResult.innerHTML = purposeSuitablity('aquatic organisms',{lowerpH:6,upperpH:9},{lowerT:0,upperT:25},phVal,turbidity);
    agricultureResult.innerHTML = purposeSuitablity('Agriculture purpose',{lowerpH:6.5,upperpH:8.5},{lowerT:0,upperT:200},phVal,turbidity);


    setDangerUi(turbidity,5,0,turbidUi);
    setDangerUi(phVal,8,6.5,phUi);
    setDangerUi(tempinC,40,10,tempCUi);
    setDangerUi(tempinF,104,50,tempFUi);

    setAcidityUi(phVal,waterAcidityUi);
    
}



const ref = firebase.database().ref();

ref.on('value', snapshot => {
    const val = snapshot.val();
    manipulateUi(val);
});
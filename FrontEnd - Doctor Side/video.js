
function temp(){

var TempList = document.querySelector('.TempShow');


function displayTemp(doc){
    


let TempDisplay = document.createElement('TempShow');

let temperature = document.createElement('span');

TempDisplay.setAttribute('data-id', doc.id);

temperature.textContent = doc.data().Temperature; 

TempDisplay.appendChild(temperature);

TempList.appendChild(TempDisplay);

TempDisplay.replaceChild(temperature,temperature);


//TempList.replaceChild(TempDisplay);

//TempList.replaceWith(TempDisplay)
// window.location.reload();

}


db.collection("Temperature").doc("milk")
  .onSnapshot(function(doc) {
       
      console.log("Current data: ", doc.data());
      
      displayTemp(doc)
      
    });

}

function oxygen(){

var TempList2 = document.querySelector('.TempShow2');

function displayTemp2(doc){

    let TempDisplay2 = document.createElement('TempShow2');
    
    let temperature2 = document.createElement('span');
    
    TempDisplay2.setAttribute('data-id', doc.id);
    
    temperature2.textContent = doc.data().Temperature; 
    
    TempDisplay2.appendChild(temperature2);
    
    TempList2.appendChild(TempDisplay2);
    
    //TempDisplay2.replaceChild(temperature,temperature);
    
    //TempList.replaceChild(TempDisplay);
    
    //TempList.replaceWith(TempDisplay)
    // window.location.reload();
    
    }


    db.collection("Temperature").doc("TempData")
  .onSnapshot(function(doc) {
       
      console.log("Current data: ", doc.data());
      
      displayTemp2(doc)
      
    });
}
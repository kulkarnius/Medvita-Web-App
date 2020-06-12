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




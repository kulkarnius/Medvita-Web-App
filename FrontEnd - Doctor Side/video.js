
function temp(){

var TempList = document.querySelector('.TempShow');


function displayTemp(doc){
    

  $('.TempShow').html('').append(doc.data().Temperature);

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

  $('.TempShow2').html('').append(doc.data().Temperature);
    
    }


    db.collection("Temperature").doc("TempData")
  .onSnapshot(function(doc) {
       
      console.log("Current data: ", doc.data());
      
      displayTemp2(doc)
      
    });
}

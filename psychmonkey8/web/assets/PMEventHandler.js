// This JavaScript library handles events
// assiciated with drag, drop, click, double click



function obsClick(ev) {
  console.log("obsClick: "+ev.target.className + " - " + ev.target.id);
  if (selectedObservations.indexOf(ev.target.id) == -1) {
    selectedObservations.push(ev.target.id);
  }
  else {
    selectedObservations.splice(selectedObservations.indexOf(ev.target.id), 1);
  }

  renderMenu(currentMenu);
  //alert(selectedObservations.length);
}

//whenver observation is double clicked
//empty space get inserted after
function onDoubleClickPosObservatoin(ev) {
  console.log("onDoubleClickObservatoin: "+ev.target.className + " - " + ev.target.id);
  for (i = 0; i < observationsArray.length; i++)
  {
    if (observationsArray[i][0] == ev.target.id)
    {
      var randId = "randId" + Math.floor((Math.random() * 100) + 101);
      //alert(randId);
      observationsArray.splice(i + 1, 0, [randId, "empty" + observationsArray[i][1]]);
      break;
    }
  }
  renderObservations();
}

function onDoubleClickFinding(ev) {
  console.log("onDoubleClickFinding: "+ev.target.className + " - " + ev.target.id);
  //alert(ev.target.id);
}

//whenver observation is double clicked
//empty space get inserted after
function onDoubleClickObservatoin(ev) {
  console.log("onDoubleClickObservatoin "+ev.target.id);
  for (i = 0; i < observationsArray.length; i++)
  {
    if (observationsArray[i][0] == ev.target.id)
    {
      var randId = "randId" + Math.floor((Math.random() * 100) + 101);
      //alert(randId);
      observationsArray.splice(i + 1, 0, [randId, "empty" + observationsArray[i][1]]);
      break;
    }
  }
  renderObservations();
}

//whenver observation in Finings is double clicked
//empty space get inserted after
function onDoubleClickObsFinding(ev) {
  console.log("onDoubleClickObservatoin "+ev.target.className);
  if (ev.target.className == "observation_finding_row")
  {
    for (i = 0; i < observationsFindingsArray.length; i++)
    {
      if (observationsFindingsArray[i][0] == ev.target.id)
      {
        var randId = "randId" + Math.floor((Math.random() * 100) + 201);
        //alert(randId);
        observationsFindingsArray.splice(i + 1, 0, [randId, "empty" + observationsFindingsArray[i][1]]);
        break;
      }
    }
  }

  else if (ev.target.className == "observation_finding_row_conf")
  {
    for (i = 0; i < observationsFindingsArrayConf.length; i++)
    {
      if (observationsFindingsArrayConf[i][0] == ev.target.id)
      {
        //alert(observationsFindingsArrayConf[i][1]);
        var randId = "randId" + Math.floor((Math.random() * 100) + 201);
        //alert(randId);
        observationsFindingsArrayConf.splice(i + 1, 0, [randId, "empty"]);
        break;
      }
    }
  }


  renderFindings();
}

function undefinedClick(ev) {
  
  var evnt = ev;
  if (singleClick) {
    //alert("Double Click "+ev.target.className);
    onDoubleClickObsFinding(ev)
    doubleClick = true;
  }
  else {
    singleClick = true;
    window.setTimeout(function ()
    {
      if (!doubleClick)
      {
        doubleClick = false;
        singleClick = false;
        //alert("Single Click "+ev.target.className);
        if (ev.target.className == "observation_finding_row_conf")
          unconfirmObsFinding(evnt);
        else if (ev.target.className == "observation_finding_row")
          confirmObsFinding(evnt);
      }
      else
      {
        singleClick = false;
        doubleClick = false;
      }
    }, 400);
  }
}

//deletes if empty row is clicked
function deleteEmptyPosObs(ev)
{
  //alert(ev.target.id);
  var posbleObsBody = document.getElementById("possibleObservationsBody");
  posbleObsBody.removeChild(ev.target);
  var menuIndex = indexArray.indexOf(currentMenu);
  var indexToDelete = indexArrayContents[menuIndex].indexOf(ev.id);
  indexArrayContents[menuIndex].splice(indexToDelete, 1);
}

//deletes if empty row is clicked
function deleteEmptyObs(ev)
{
  var indexToDelete = indexOf2D(observationsArray, 0, ev.target.id);
  observationsArray.splice(indexToDelete, 1);
  renderObservations();
}


//deletes if empty row is clicked
function deleteEmptyObsFind(ev)
{
  var indexToDelete = indexOf2D(observationsFindingsArray, 0, ev.target.id);

  if (indexToDelete != -1)
  {
    //alert(indexToDelete+" UNCONF");
    observationsFindingsArray.splice(indexToDelete, 1);
  }
  else
  {
    indexToDelete = indexOf2D(observationsFindingsArrayConf, 0, ev.target.id);
    //alert(indexToDelete+" CONF");
    observationsFindingsArrayConf.splice(indexToDelete, 1);
  }
  renderFindings();
}

//this function enables drag and drop in the page
function allowDrop(ev) {
  ev.preventDefault();
}

function noDrag(ev) {
  //alert("NO DRAG");
}
//this function is called whenever draggable elment is dragged 
function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

//sets flag to id of an element
//over which row is dragged
function dragOver(ev) {
  flag = ev.target.id;
  flagClass = ev.target.className;

  document.getElementById("debugmes3").innerHTML = flag + " " + ev.target.className;
}

//resets the flag
function dragOut(ev) {
  flag = "none";
  flagClass = "none";
}

//this function is called when dragged element dropped into column
function drop(ev) {
  //enables drag and drop function
  ev.preventDefault();
  //creation of instance of dragged element
  var data = ev.dataTransfer.getData("text");
  var positiveObs = true;
  var temp = document.getElementById(data);

  var menuIndex = indexArray.indexOf(currentMenu);
  var draggedObservationIndex = indexArrayContents[menuIndex].indexOf(temp.id);

  document.getElementById("debugmes1").innerHTML = temp.id;
  document.getElementById("debugmes2").innerHTML = temp.className;


  //if(temp.id.substr(temp.id.length-1,1)=="%")
  //	temp.id=temp.id.substr(0,temp.id.length-1);

  //Possible Observations --> Positive Observatios
  // || temp.className=="observationRow")
  //if((ev.target.id==="observationsBody" || ev.target.parentNode.id=="observationsBody") && (temp.className=="possibleObsRow" || temp.className=="observationRow"))
  if (ev.target.id == "observationsBody" && temp.className == "possibleObsRow")
  {
    //checkes if dragged element exists or not
    //alert(1);
    var exists = false;
    for (j = 0; j < observationsArray.length; j++)
    {
      if (observationsArray[j][0] == temp.id)
      {
        exists = true;
        break;
      }
    }
    //if does not exists, adds it
    if (!exists)
    {
      //Replaceing dragged obs with empty spot
      indexArrayContents[menuIndex][draggedObservationIndex] = "randId" + Math.floor((Math.random() * 100) + 1);
      observationsArray.push([temp.id, 'pos']);
    }

  }

  //MULTIPLE Possible Observations --> Positive Observatios
  else if ((ev.target.id === "observationsBody" || ev.target.parentNode.id === "observationsBody") && temp.className == "possibleObsRowSelected")
  {
    if (ev.target.id === "observationsBody")
    {

      for (i = 0; i < selectedObservations.length; i++)
      {
        var exists = false;
        for (j = 0; j < observationsArray.length; j++)
        {
          if (observationsArray[j][0] == selectedObservations[i])
          {
            exists = true;
            break;
          }
        }

        if (!exists)
        {
          var location = indexArrayContents[menuIndex].indexOf(selectedObservations[i]);
          indexArrayContents[menuIndex][location] = "randId" + Math.floor((Math.random() * 100) + 1);
          observationsArray.push([selectedObservations[i], 'pos']);
        }

      }
    }
    else if (flag != "none")
    {
      //alert("MULTIPLE");
      var location2 = -1;

      for (i = 0; i < observationsArray.length; i++)
      {
        if (observationsArray[i][0] == flag)
        {
          location2 = i;
          break;
        }
      }

      for (i = 0; i < selectedObservations.length; i++)
      {
        var exists = false;
        for (j = 0; j < observationsArray.length; j++)
        {
          if (observationsArray[j][0] == selectedObservations[i])
          {
            exists = true;
            break;
          }
        }

        if (!exists)
        {
          var location = indexArrayContents[menuIndex].indexOf(selectedObservations[i]);
          indexArrayContents[menuIndex][location] = "randId" + Math.floor((Math.random() * 100) + 1);
          observationsArray.splice(location2 + i, 0, [selectedObservations[i], 'pos']);
        }
      }

    }

    selectedObservations = [];
    //indexArrayContents[menuIndex][draggedObservationIndex]="randId"+Math.floor((Math.random() * 100) + 1);
    //observationsArray.push([temp.id,'pos']);
  }
  //Possible Observations/Observations --> Positive Observatios
  else if (ev.target.parentNode.id == "observationsBody" && (temp.className == "observationRow" || temp.className == "possibleObsRow") && flag != "none" && flag != temp.id)
  {
    //alert("temp.className: "+temp.className);
    var position = -1;
    //alert("flag: "+flag);
    //Replaceing dragged obs with empty spot
    if (temp.className == "possibleObsRow")
      indexArrayContents[menuIndex][draggedObservationIndex] = "randId" + Math.floor((Math.random() * 100) + 1);
    else
    {
      //searching and removing 
      for (i = 0; i < observationsArray.length; i++)
      {

        if (observationsArray[i][0] == temp.id)
        {
          //alert("To delete: "+observationsArray[i][0]);
          observationsArray.splice(i, 1);
          position = i;
          break;
        }
      }
    }

    //Searching & Inserting Dropped element temp
    for (i = 0; i < observationsArray.length; i++)
    {
      //alert(observationsArray[i][0]+"=="+flag);
      if (observationsArray[i][0] == flag)
      {
        if (flag.substr(0, 6) == "randId")
        {
          observationsArray.splice(i, 1);
          observationsArray.splice(i, 0, [temp.id, 'pos']);
        }
        else
        {
          if (i < position)
            observationsArray.splice(i, 0, [temp.id, 'pos']);
          else
            observationsArray.splice(i + 1, 0, [temp.id, 'pos']);
        }

        break;
      }
    }
  }


  //Possible Observations --> Negative Observatios
  else if (ev.target.id == "negativeObservationsBody" && temp.className == "possibleObsRow")
  {
    //checkes if dragged element exists or not
    var exists = false;
    for (j = 0; j < observationsArray.length; j++)
    {
      if (observationsArray[j][0] == temp.id)
      {
        exists = true;
        break;
      }
    }
    //if does not exists, adds it
    if (!exists)
    {
      //Replaceing dragged obs with empty spot
      indexArrayContents[menuIndex][draggedObservationIndex] = "randId" + Math.floor((Math.random() * 100) + 1);
      observationsArray.push([temp.id, 'neg']);
    }
  }
  //MULTIPLE Possible Observations --> Negative Observatios
  else if ((ev.target.id === "negativeObservationsBody" || ev.target.parentNode.id === "negativeObservationsBody") && temp.className == "possibleObsRowSelected")
  {
    if (ev.target.id === "negativeObservationsBody")
    {
      for (i = 0; i < selectedObservations.length; i++)
      {
        var exists = false;
        for (j = 0; j < observationsArray.length; j++)
        {
          if (observationsArray[j][0] == selectedObservations[i])
          {
            exists = true;
            break;
          }
        }

        if (!exists)
        {
          var location = indexArrayContents[menuIndex].indexOf(selectedObservations[i]);
          indexArrayContents[menuIndex][location] = "randId" + Math.floor((Math.random() * 100) + 1);
          observationsArray.push([selectedObservations[i], 'neg']);
        }

      }
    }
    else if (flag != "none")
    {
      var location2 = -1;

      for (i = 0; i < observationsArray.length; i++)
      {
        if (observationsArray[i][0] == flag)
        {
          location2 = i;
          break;
        }
      }

      for (i = 0; i < selectedObservations.length; i++)
      {
        var exists = false;
        for (j = 0; j < observationsArray.length; j++)
        {
          if (observationsArray[j][0] == selectedObservations[i])
          {
            exists = true;
            break;
          }
        }

        if (!exists)
        {
          var location = indexArrayContents[menuIndex].indexOf(selectedObservations[i]);
          indexArrayContents[menuIndex][location] = "randId" + Math.floor((Math.random() * 100) + 1);
          observationsArray.splice(location2 + i, 0, [selectedObservations[i], 'neg']);
        }
      }

    }

    selectedObservations = [];
  }

  //Rearrangement in Negative Observations || Positive Obs <-->  Negative Obs
  else if (ev.target.parentNode.id == "negativeObservationsBody" && (temp.className == "observationRow" || temp.className == "possibleObsRow") && flag != "none" && flag != temp.id)
  {
    //alert("Rearrangement in Negative Observations || Positive Obs <-->  Negative Obs");
    var position = -1;
    if (temp.className == "possibleObsRow")
      indexArrayContents[menuIndex][draggedObservationIndex] = "randId" + Math.floor((Math.random() * 100) + 1);
    else
    {
      //searching and removing from origin
      for (i = 0; i < observationsArray.length; i++)
      {

        if (observationsArray[i][0] == temp.id)
        {
          //alert("To delete: "+observationsArray[i][0]);
          observationsArray.splice(i, 1);
          position = i;
          break;
        }
      }
    }

    //Searching & Inserting Dropped element temp
    for (i = 0; i < observationsArray.length; i++)
    {
      //alert(observationsArray[i][0]+"=="+flag);
      if (observationsArray[i][0] == flag)
      {

        //If element is dropped into empty row, it gets replaced
        if (flag.substr(0, 6) == "randId")
        {
          var position = indexOf2D(observationsArray, 0, flag);
          observationsArray.splice(position, 1);
          observationsArray.splice(i, 0, [temp.id, 'neg']);
        }
        else
        {
          if (i < position)
            observationsArray.splice(i, 0, [temp.id, 'neg']);
          else
            observationsArray.splice(i + 1, 0, [temp.id, 'neg']);
        }
        break;
      }
    }
  }

  //Positive Obs <-->  Negative Obs
  else if ((ev.target.id == "observationsBody" || ev.target.parentNode.id == "observationsBody" || ev.target.id == "negativeObservationsBody" || ev.target.parentNode.id == "negativeObservationsBody") && (temp.className == "observationRow"))
  {
    //alert("Positive Obs <-->  Negative Obs");
    for (i = 0; i < observationsArray.length; i++)
    {
      if (observationsArray[i][0] === temp.id)
      {
        if (observationsArray[i][1] == 'pos')
        {
          observationsArray.splice(i, 1);
          if (ev.target.id == "observationsBody")
            observationsArray.push([temp.id, 'pos']);
          else
            observationsArray.push([temp.id, 'neg']);
        }
        else
        {
          observationsArray.splice(i, 1);
          if (ev.target.id == "observationsBody")
            observationsArray.push([temp.id, 'pos']);
          else
            observationsArray.push([temp.id, 'neg']);
        }


        break;
      }
    }

  }

  //Positive/Negative Observations --> Possible Observatios
  else if ((ev.target.id == "possibleObservationsBody" || ev.target.parentNode.id == "possibleObservationsBody") && (temp.className == "observationRow" || temp.className == "observation_finding_row"))
  {
    //indexArrayStates=[menuIndex][draggedObservatioIndex]=1;

    if (temp.className == "observationRow")
    {
      for (i = 0; i < observationsArray.length; i++)
      {
        if (observationsArray[i][0] == temp.id || observationsArray[i][0] == temp.parentNode.id)
        {
          //possibleObser
          observationsArray.splice(i, 1);

          if (flag != "none")
          {
            var indexInPosObs = indexArrayContents[menuIndex].indexOf(flag);
            //alert(indexInPosObs+" "+flag.substr(0,6));
            if (flag.substr(0, 6) == "randId")
              indexArrayContents[menuIndex].splice(indexInPosObs, 1);

            indexArrayContents[menuIndex].splice(indexInPosObs, 0, temp.id);
          }
          else
          {
            indexArrayContents[menuIndex].push(temp.id);
          }
        }
      }
    }
    else
    {
      //var indexInFindings=observationsFindingsArray.indexOf(temp.id);
      for (i = 0; i < observationsFindingsArray.length; i++)
      {
        if (observationsFindingsArray[i][0] == temp.id)
        {
          observationsFindingsArray.splice(i, 1);
          break;
        }
      }
      //
      if (flag != "none")
      {
        var indexInPosObs = indexArrayContents[menuIndex].indexOf(flag);
        if (flag.substr(0, 6) == "randId")
          indexArrayContents[menuIndex].splice(indexInPosObs, 1);

        indexArrayContents[menuIndex].splice(indexInPosObs, 0, temp.id);
      }
      else
      {
        indexArrayContents[menuIndex].push(temp.id);
      }
    }

    temp.className = "possibleObsRow";

  }
  //drag n drop for possible obs, remove later
  /*else if(temp.className=="possibleObsRow" && flag!="none")
   {
   temp.className="possibleObsRow";
   //removing dragged element from old location
   indexArrayContents[menuIndex].splice(draggedObservationIndex,1);
   //inserting dragged elementinto new location
   //getting new location
   var newLocation=indexArrayContents[menuIndex].indexOf(ev.target.id);
   //inserting into new location
   indexArrayContents[menuIndex].splice(newLocation,0,temp.id);
   }*/

  //Obsrvatoins --> Findings
  //Allow observations to be dragged and dropped into findings column, making them black font and floating to top when this is done.  They remain small letters.

  //Observations --> Findings (Body)
  if (temp.className == "observationRow" && (ev.target.id == "findingsBody" || ev.target.parentNode.id == "findingsBody") && flag == "none")
  {
    for (i = 0; i < observationsArray.length; i++)
    {
      if (observationsArray[i][0] == temp.id)
      {
        //determining the type of observation
        if (observationsArray[i][1] == 'pos')
          observationsFindingsArrayConf.push([temp.id, "pos"]);
        else
          observationsFindingsArrayConf.push([temp.id, "neg"]);

        //detele the item from observation	
        observationsArray.splice(i, 1);
        break;
      }
    }
  }

  //Observations --> Findings (Observations, Confirmed Obs, and anywhere else)
  else if (temp.className == "observationRow" && ev.target.parentNode.id == "findingsBody")
  {
    //alert(flag+" "+flagClass);
    var location = -1;

    //Observations --> Findings (Unconfirmed Observations)
    if (ev.target.className == "observation_finding_row" && indexOf2D(observationsFindingsArray, 0, temp.id) == -1 && flag != "none")
    {
      location = indexOf2D(observationsFindingsArray, 0, flag);

      var tempLocation = indexOf2D(observationsArray, 0, temp.id);
      //alert(observationsArray[tempLocation][1]);
      //inserting new element into observationsFindingsArray
      observationsFindingsArray.splice(location, 0, [temp.id, observationsArray[tempLocation][1]]);
      //removing the element from observationsArray
      observationsArray.splice(tempLocation, 1);
      //alert(location);
    }
    //Observations --> Findings (Confirmed Observations)
    else if (ev.target.className == "observation_finding_row_conf" && indexOf2D(observationsFindingsArrayConf, 0, temp.id) == -1 && flag != "none")
    {
      location = indexOf2D(observationsFindingsArray, 0, flag);
      var tempLocation = indexOf2D(observationsArray, 0, temp.id);

      //inserting new element into observationsFindingsArray
      observationsFindingsArrayConf.splice(location, 0, [temp.id, observationsArray[tempLocation][1]]);
      //removing the element from observationsArray
      observationsArray.splice(tempLocation, 1);
      //alert(location);
    }
    //Observations --> Findings (Anywhere)
    else
    {
      //alert(111);
      location = indexOf2D(observationsFindingsArrayConf, 0, flag);
      var tempLocation = indexOf2D(observationsFindingsArrayConf, 0, temp.id);
      //inserting new element into observationsFindingsArray
      observationsFindingsArrayConf.push([temp.id, observationsArray[tempLocation][1]]);
      //removing the element from observationsArray
      observationsArray.splice(tempLocation, 1);
      //alert(location);
    }
    getDiagnosis();
  }

  //Rearrange of Observations in Findings
  else if ((temp.className == "observation_finding_row" || temp.className == "observation_finding_row_conf") && ev.target.parentNode.id == "findingsBody")
  {
    //alert(flag+"--"+flagClass);
    var insertLocation = -1;
    var deleteLocation = -1;

    //Unconfirmed Obs --> Unconfirmed Obs
    if (temp.className == "observation_finding_row" && ev.target.className == "observation_finding_row" && flag != "none")
    {
      //alert("Rearrange within unconfirmed obs");

      insertLocation = indexOf2D(observationsFindingsArray, 0, flag);

      deleteLocation = indexOf2D(observationsFindingsArray, 0, temp.id);
      //alert("insertLocation:"+insertLocation+" deleteLocation:"+deleteLocation);


      if (insertLocation > deleteLocation)
      {
        observationsFindingsArray.splice(insertLocation + 1, 0, [temp.id, observationsFindingsArray[deleteLocation][1]]);
        observationsFindingsArray.splice(deleteLocation, 1);
      }
      else
      {
        observationsFindingsArray.splice(insertLocation, 0, [temp.id, observationsFindingsArray[deleteLocation][1]]);
        observationsFindingsArray.splice(deleteLocation + 1, 1);
      }
    }
    //Unconfirmed Obs --> Confirmed Obs
    else if (temp.className == "observation_finding_row" && ev.target.className == "observation_finding_row_conf" && flag != "none")
    {
      //alert("Rearrange within unconfirmed obs");

      insertLocation = indexOf2D(observationsFindingsArrayConf, 0, flag);

      deleteLocation = indexOf2D(observationsFindingsArray, 0, temp.id);
      //alert("CONF: insertLocation:"+insertLocation+" deleteLocation:"+deleteLocation);


      observationsFindingsArrayConf.splice(insertLocation, 0, [temp.id, observationsFindingsArray[deleteLocation][1]]);
      observationsFindingsArray.splice(deleteLocation, 1);


    }

    //Confirmed Obs --> Confirmed Obs
    if (temp.className == "observation_finding_row_conf" && (ev.target.className == "observation_finding_row_conf" || ev.target.className == "emptyObsRowDotted") && flag != "none")
    {
      //alert("Rearrange within unconfirmed obs");

      insertLocation = indexOf2D(observationsFindingsArrayConf, 0, flag);

      deleteLocation = indexOf2D(observationsFindingsArrayConf, 0, temp.id);
      //alert("insertLocation:"+insertLocation+" deleteLocation:"+deleteLocation);


      if (insertLocation > deleteLocation)
      {
        observationsFindingsArrayConf.splice(insertLocation + 1, 0, [temp.id, observationsFindingsArrayConf[deleteLocation][1]]);
        observationsFindingsArrayConf.splice(deleteLocation, 1);
      }
      else
      {
        observationsFindingsArrayConf.splice(insertLocation, 0, [temp.id, observationsFindingsArrayConf[deleteLocation][1]]);
        observationsFindingsArrayConf.splice(deleteLocation + 1, 1);
      }
    }
    //Confirmed Obs --> Unonfirmed Obs
    else if (temp.className == "observation_finding_row_conf" && (ev.target.className == "observation_finding_row" || ev.target.className == "emptyObsRowDotted") && flag != "none")
    {
      //alert("Rearrange within unconfirmed obs");

      insertLocation = indexOf2D(observationsFindingsArray, 0, flag);

      deleteLocation = indexOf2D(observationsFindingsArrayConf, 0, temp.id);
      //alert("CONF: insertLocation:"+insertLocation+" deleteLocation:"+deleteLocation);


      observationsFindingsArray.splice(insertLocation, 0, [temp.id, observationsFindingsArrayConf[deleteLocation][1]]);
      observationsFindingsArrayConf.splice(deleteLocation, 1);


    }

    getDiagnosis();
  }

  //Rearrange of Indexes in Findings
  //else if((temp.className=="index_finding_row" || temp.className=="observation_finding_row_conf") && ev.target.parentNode.id=="findingsBody")
  else if ((temp.className == "index_finding_row" || temp.className == "index_finding_row_conf") && ev.target.parentNode.id == "findingsBody")
  {
    //REPLACE AFTER BUG FIX!!!
    //temp.className=flagClass;

    //alert("Rearrange of Indexes in Findings\n"+flag+"--"+flagClass);
    var insertLocation = -1;
    var deleteLocation = -1;

    //Unconfirmed Index --> Unconfirmed Index
    if (temp.className == "index_finding_row" && ev.target.className == "index_finding_row" && flag != "none")
    {
      //alert("Rearrange within unconfirmed indexes "+indexFindingsArray.length);

      insertLocation = indexFindingsArray.indexOf(flag);
      deleteLocation = indexFindingsArray.indexOf(temp.id);
      //alert("insertLocation:"+insertLocation+" deleteLocation:"+deleteLocation);


      if (insertLocation > deleteLocation)
      {
        indexFindingsArray.splice(insertLocation + 1, 0, temp.id);
        indexFindingsArray.splice(deleteLocation, 1);
      }
      else
      {
        indexFindingsArray.splice(insertLocation, 0, temp.id);
        indexFindingsArray.splice(deleteLocation + 1, 1);
      }
    }
    //Unconfirmed Index --> Confirmed Index
    else if (temp.className == "index_finding_row" && ev.target.className == "index_finding_row_conf" && flag != "none")
    {
      insertLocation = indexFindingsArrayConf.indexOf(flag);
      deleteLocation = indexFindingsArray.indexOf(temp.id);

      indexFindingsArrayConf.splice(insertLocation, 0, temp.id);
      indexFindingsArray.splice(deleteLocation, 1);


    }
    //Confirmed Index --> Confirmed Index
    else if (temp.className == "index_finding_row_conf" && ev.target.className == "index_finding_row_conf")
    {
      insertLocation = indexFindingsArrayConf.indexOf(flag);
      deleteLocation = indexFindingsArrayConf.indexOf(temp.id);

      if (insertLocation > deleteLocation)
      {
        indexFindingsArrayConf.splice(insertLocation + 1, 0, temp.id);
        indexFindingsArrayConf.splice(deleteLocation, 1);
      }
      else
      {
        indexFindingsArrayConf.splice(insertLocation, 0, temp.id);
        indexFindingsArrayConf.splice(deleteLocation + 1, 1);
      }
    }
    //Confirmed Index --> Unonfirmed Index
    else if (temp.className == "index_finding_row_conf" && ev.target.className == "index_finding_row" && flag != "none")
    {
      insertLocation = indexFindingsArray.indexOf(flag);
      deleteLocation = indexFindingsArrayConf.indexOf(temp.id);

      indexFindingsArray.splice(insertLocation, 0, temp.id);
      indexFindingsArrayConf.splice(deleteLocation, 1);
    }

    //getDiagnosis();
  }

  ///Rearrange of Findings in Findings
  else if ((temp.className == "finding_row" || temp.className == "finding_row_confirmed") && ev.target.parentNode.id == "findingsBody")
  {
    var insertLocation = -1;
    var deleteLocation = -1;
    //alert(temp.className+" "+ev.target.className);
    //Unconfirmed Finding --> Unconfirmed Finding
    if (temp.className == "finding_row" && ev.target.className == "finding_row" && flag != "none")
    {

      insertLocation = findingsArray.indexOf(flag);
      deleteLocation = findingsArray.indexOf(temp.id);
      //alert("UF "+deleteLocation+" -->UF "+insertLocation);

      var str = "";

      for (i = 0; i < findingsArray.length; i++)
        str += findingsArray[i] + "-";


      if (insertLocation > deleteLocation)
      {
        findingsArray.splice(insertLocation + 1, 0, temp.id);
        findingsArray.splice(deleteLocation, 1);
      }
      else
      {
        findingsArray.splice(insertLocation, 0, temp.id);
        findingsArray.splice(deleteLocation + 1, 1);
      }

      str += "\n";

      for (i = 0; i < findingsArray.length; i++)
        str += findingsArray[i] + "-";

      //alert(str);

    }
    //Unconfirmed Finding --> Confirmed Finding
    else if (temp.className == "finding_row" && ev.target.className == "finding_row_confirmed" && flag != "none")
    {
      //alert("Rearrange within unconfirmed Findings");

      insertLocation = findingsArrayConf.indexOf(flag);

      deleteLocation = findingsArray.indexOf(temp.id);
      //alert("CONF: insertLocation:"+insertLocation+" deleteLocation:"+deleteLocation);

      findingsArrayConfirmed.splice(insertLocation, 0, temp.id);
      findingsArray.splice(deleteLocation, 1);


    }
    //Confirmed Finding --> Confirmed Finding
    else if (temp.className == "finding_row_confirmed" && ev.target.className == "finding_row_confirmed")
    {
      //alert("Confirmed Index --> Confirmed Index");
      insertLocation = findingsArrayConfirmed.indexOf(flag);

      deleteLocation = findingsArrayConfirmed.indexOf(temp.id);

      if (insertLocation > deleteLocation)
      {
        findingsArrayConfirmed.splice(insertLocation + 1, 0, temp.id);
        findingsArrayConfirmed.splice(deleteLocation, 1);
      }
      else
      {
        findingsArrayConfirmed.splice(insertLocation, 0, temp.id);
        findingsArrayConfirmed.splice(deleteLocation + 1, 1);
      }
    }
    //Confirmed Finding --> Unonfirmed Finding
    else if (temp.className == "finding_row_confirmed" && ev.target.className == "finding_row" && flag != "none")
    {
      //alert("Rearrange: Confirmed Index --> Unonfirmed Index");

      insertLocation = findingsArray.indexOf(flag);

      deleteLocation = findingsArrayConfirmed.indexOf(temp.id);

      findingsArray.splice(insertLocation, 0, temp.id);
      findingsArrayConfirmed.splice(deleteLocation, 1);
    }
  }

  //Observations --> Findings --Rearrange
  /*else if(ev.target.parentNode.id=="findingsBody" && temp.className=="observationRow" && flag!="none" && flag!=temp.id)
   {
   alert("Findings --> Findings --Rearrange");
   var position=-1;
   //	alert("flag: "+flag);
   //Replaceing dragged obs with empty spot
   if(temp.className=="possibleObsRow")
   indexArrayContents[menuIndex][draggedObservationIndex]="randId"+Math.floor((Math.random() * 100) + 1);
   else
   {
   //searching and removing 
   for(i=0;i<observationsArray.length;i++)
   {
   
   if(observationsArray[i][0]==temp.id)
   {
   //alert("To delete: "+observationsArray[i][0]);
   observationsArray.splice(i,1);
   position=i;
   break;
   }		
   }
   }
   
   //Searching & Inserting Dropped element temp
   for(i=0;i<observationsArray.length;i++)
   {
   //alert(observationsArray[i][0]+"=="+flag);
   if(observationsArray[i][0]==flag)
   {
   //alert(i);
   if(i<position)
   observationsArray.splice(i,0,[temp.id,'pos']);
   else
   observationsArray.splice(i+1,0,[temp.id,'pos']);
   break;
   }
   }
   }*/

  //Obsrvatoins in Findings --> Obsrvatoins
  //Allow observations to be dragged away from findings column and back to observations or possible observations column.
  else if ((ev.target.id == "observationsBody" || ev.target.parentNode.id == "observationsBody") && (temp.className == "observation_finding_row" || temp.className == "observation_finding_row_conf"))
  {
    //alert("Obsrvatoins in Findings --> Obsrvatoins");

    var found = false;

    for (i = 0; i < observationsArray.length; i++)
    {
      if (observationsArray[i][0] == temp.id)
        found = true;
    }

    if (!found)
    {

      //findingsArray.push(temp.id);
      observationsArray.push([temp.id, 'pos']);

      //detele the item from observation
      var itemIndex = -1;

      if (temp.className == "observation_finding_row")
      {
        for (i = 0; i < observationsFindingsArray.length; i++)
        {
          if (observationsFindingsArray[i][0] == temp.id)
          {
            itemIndex = i;
            observationsFindingsArray.splice(itemIndex, 1);
            //alert(itemIndex+" "+observationsArray.length);
            break;
          }
        }
      }
      else
      {
        for (i = 0; i < observationsFindingsArrayConf.length; i++)
        {
          if (observationsFindingsArrayConf[i][0] == temp.id)
          {
            itemIndex = i;
            observationsFindingsArrayConf.splice(itemIndex, 1);
            //alert(itemIndex+" "+observationsArray.length);
            break;
          }
        }
      }



    }
  }

  //Obsrvatoins in Findings -->Negative Obsrvatoins
  //Allow observations to be dragged away from findings column and back to observations or possible observations column.
  else if ((ev.target.id == "negativeObservationsBody" || ev.target.parentNode.id == "negativeObservationsBody") && (temp.className == "observation_finding_row" || temp.className == "observation_finding_row_conf"))
  {
    //alert("Obsrvatoins in Findings -->Negative Obsrvatoins");

    var found = false;

    for (i = 0; i < observationsArray.length; i++)
    {
      if (observationsArray[i][0] == temp.id)
        found = true;
    }

    if (!found)
    {
      //findingsArray.push(temp.id);
      observationsArray.push([temp.id, 'neg']);

      //detele the item from observation
      var itemIndex = -1;
      if (temp.className == "observation_finding_row")
      {
        for (i = 0; i < observationsFindingsArray.length; i++)
        {
          if (observationsFindingsArray[i][0] == temp.id)
          {
            itemIndex = i;
            observationsFindingsArray.splice(itemIndex, 1);
            //alert(itemIndex+" "+observationsArray.length);
            break;
          }
        }
      }
      else
      {
        for (i = 0; i < observationsFindingsArrayConf.length; i++)
        {
          if (observationsFindingsArrayConf[i][0] == temp.id)
          {
            itemIndex = i;
            observationsFindingsArrayConf.splice(itemIndex, 1);
            //alert(itemIndex+" "+observationsArray.length);
            break;
          }
        }
      }
    }
  }
  //Index --> Findings
  else if ((ev.target.id == "findingsBody" || ev.target.parentNode.id == "findingsBody") && (temp.className == "indexText" || temp.className == "indexTextSelected"))
  {

    //alert("Index --> Findings");
    if (indexFindingsArray.indexOf(temp.id) == -1 && indexFindingsArrayConf.indexOf(temp.id) == -1 && findingsArrayConfirmed.indexOf(temp.id) == -1 && findingsArray.indexOf(temp.id) == -1)
    {
      var id2 = "";
      if (temp.id.substr(temp.id.length - 1, 1) == "_")
        id2 = temp.id.substr(0, temp.id.length - 1);
      else
        id2 = temp.id;

      indexFindingsArrayConf.push(id2);
      //alert(id2);
      //whever index is draggen into findings
      //that index is "selected" or "clicked"
      document.getElementById(currentMenu + "_").className = "indexText";
      currentMenu = id2;
      document.getElementById(currentMenu + "_").className = "indexTextSelected";
      renderMenu(currentMenu);
      //renderFindings();
    }

    //renderFindings();
  }
  //Indexes in Findings --> Indexes
  else if ((ev.target.id == "indexBody" || ev.target.parentNode.id == "indexBody") && (temp.className == "index_finding_row" || temp.className == "index_finding_row_conf"))
  {
    //alert("Indexes in Findings --> Indexes");
    //finding location of dragged element in "findingsArray"
    var location = indexFindingsArrayConf.indexOf(temp.id);
    //alert(location);

    if (location != -1)
    {
      indexFindingsArrayConf.splice(location, 1);
    }
    else
    {
      location = indexFindingsArray.indexOf(temp.id);
      if (location != -1)
      {
        indexFindingsArray.splice(location, 1);
      }
      else
      {
        location = indexFindingsArrayConf.indexOf(temp.id);
        indexFindingsArrayConf.splice(location, 1);
      }
    }
  }

  renderMenu(currentMenu);
  renderObservations();

  getFindings();
  renderFindings();
  getDiagnosis();
}	
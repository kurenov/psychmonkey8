// JavaScript Document



function init() {
  //caching ontology xml for smooth UI experience
  //performing XML request via http
  var xmlhttp;
  if (window.XMLHttpRequest) {
    // code for IE7+, Firefox, Chrome, Opera, Safari
    xmlhttp = new XMLHttpRequest();
  }
  else {
    // code for IE6, IE5
    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
  }
  //if XML request fails, alerts user about error
  if (xmlhttp == null) {
    alert("XML connection error!");
  }

  //accessing ontology file
  xmlhttp.open("GET", "assets/psych20150901.xml", false);
  xmlhttp.send();
  xmlDoc = xmlhttp.responseXML;
  console.log(xmlDoc);

  //Spacer Adjust
  var spacerAdjust = 27;
  //setting "DEFAULT" index as an initial index (menu)
  var currentMenu = "DEFAULT";
  //Possible Observations "DEFAULT" index
  var indexArray = [];
  //stores Possible Observations for each index
  var indexArrayContents = [];
  //
  var menu = [];

  //stores multiple observations that are selected
  //single left click
  var selectedObservations = [];


  // array stores Unconfirmed Findings
  var findingsArray = [];
  // array stores Confirmed Findings
  var findingsArrayConfirmed = [];

  var indexFindingsArray = [];
  var indexFindingsArrayConf = [];
  var observationsFindingsArray = [];
  var observationsFindingsArrayConf = [];

  var diagnosisArray = [];
  var diagnosisArrayConfirmed = [];

  //Dynamic list of dragged observations
  //2D array which stores dragged observarion id and type (Positive or Negative) [i][0]=id, [i][1]='pos' or 'neg'
  var observationsArray = [];

  //whenever row 1 is dragged over row 2
  //flags get assigned id of the row	2
  var flag = flagClass = "";

  var singleClick = doubleClick = false;
  
  preloadDefaults();
}

//this function preloades xml file
function preloadDefaults()
{
  //Preloading DEFAULT index and
  //assiciated Possible Observations
  indexArray.push("DEFAULT");
  //indexArrayContents.push(['energyDecreased','functioningDecreased','sleepDecreased','sleepIncreased','worseOverall','agoraphobia','worry','anhedonia','isolating','sadness','tearfulness','elatedMood','irritability','racingThoughts','auditoryHallucinations','delusions','homocidalIdeation','suicidalIdeation']);
  indexArrayContents.push(['ableToEnjoy', 'anhedonia', 'betterOverall', 'chronicPain', 'cryingSpells', 'fatigue', 'functioningDecreased', 'hallucinations', 'homicidalIdeation', 'hopeless', 'labileEmotions', 'medCompliant', 'medSideEffects', 'nervous', 'racingThoughts', 'sadness', 'sleepDecreased', 'suicidalIdeation', 'stressIncreased', 'worthless']);

  //Preloading MENTALSTATUSEXAM index and
  //assiciated Possible Observations
  indexArray.push("MENTALSTATUSEXAM");
  indexArrayContents.push(['affectNormal', 'agitation', 'appearanceNormal', 'associationsNormal', 'attentionDecreased', 'bluntedAffect', 'cognitiveLimitations', 'disorganizedSpeech', 'dysphoria', 'hallucinations', 'labileEmotions', 'looseAssociations', 'memoryIntact', 'poorGrooming', 'poorHygiene', 'psychomotorAgitation', 'psychomotorRetardation', 'sadAffect', 'skinPicking', 'speechNormal', 'speechPressured', 'tangentialSpeech', 'tearful', 'thoughtsDisorganized']);

  //possibleObservationsArray=indexArrayContents[0];

  document.getElementById("DEFAULT_").className = "indexTextSelected";


  var classType, nmdInd, parentNode;
  var cloneableIndex = document.getElementById("cloneableIndex");
  var cloneableFinding = document.getElementById("cloneableFinding");
  var indexBody = document.getElementById("indexBody");
  var counter = 0;

  var result = xmlDoc.getElementsByTagName("ClassAssertion");

  for (i = 0; i < result.length; i++)
  {
    parentNode = result[i].getElementsByTagName("Class")[0].parentNode.nodeName;
    classType = result[i].getElementsByTagName("Class")[0].getAttribute("IRI");
    nmdInd = result[i].getElementsByTagName("NamedIndividual")[0].getAttribute("IRI");
    nmdInd = nmdInd.substr(1, nmdInd.length);

    if (classType == "#Finding" && parentNode == "ClassAssertion")
    {
      var clonedIndex = cloneableIndex.cloneNode(false);
      clonedIndex.id = nmdInd + "_";
      clonedIndex.innerHTML = splitString2(nmdInd, 1);
      indexBody.appendChild(clonedIndex);
      indexArray.push(nmdInd);
      //indexArrayContents[counter].push([counter]);
    }
  }

  //retrieving menu items for each index
  //creating states array for possible observations
  //1 means present, 0 means item was dragged into column3
  //since indexArray[0] is Default menu, we don't need to retrieve it
  for (i = 0; i < indexArray.length; i++)
  {
    //indexArray[0] is Default menu, we don't need to retrieve it
    //since we prealoaded it in preloadDefaults() function
    if (i > 1)
    {
      var index = indexArray[i];//.substr(0,indexArray[i].length);
      //alert(index);
      indexArrayContents[i] = retrieveMenu(index);

    }
  }

  renderMenu(currentMenu);

}

function resetForm()
{
  //sets defautl values and menu
  document.getElementById(currentMenu + "_").className = "indexText";
  currentMenu = "DEFAULT";
  indexArray = [];
  indexArrayContents = [];
  selectedObservations = [];
  findingsArray = [];
  findingsArrayConfirmed = [];
  indexFindingsArray = [];
  indexFindingsArrayConf = [];
  observationsFindingsArray = [];
  observationsFindingsArrayConf = [];
  diagnosisArray = [];
  diagnosisArrayConfirmed = [];
  plansArray = [];
  observationsArray = [];
  flag = flagClass = "";

  preloadDefaults()

  renderObservations();
  getFindings();
  getDiagnosis();
}

//this function runs whenever user selects index
function indexIsSelected(ev)
{
  index = ev.target.id;
  index2 = index.substr(0, index.length - 1);
  document.getElementById(currentMenu + "_").className = "indexText";
  document.getElementById(index).className = "indexTextSelected";
  selectedObservations = [];
  //getting preloaded menu from 2D array
  //alert(index);

  var location = indexArray.indexOf(index2);
  var menu = indexArrayContents[location];
  currentMenu = index2;
  //loading content of menu into possibleObservationsArray
  //possibleObservationsArray=menu;
  renderMenu(index2);

}
//caching ontology xml for smooth UI experience
//performing XML request via http
var xmlhttp;
if (window.XMLHttpRequest) {
  // code for IE7+, Firefox, Chrome, Opera, Safari
  xmlhttp = new XMLHttpRequest();
}
else {
  // code for IE6, IE5
  xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
}
//if XML request fails, alerts user about error
if (xmlhttp == null) {
  alert("XML connection error!");
}

//accessing ontology file
xmlhttp.open("GET", "assets/psych20150901.xml", false);
xmlhttp.send();
xmlDoc = xmlhttp.responseXML;
console.log(xmlDoc);

//Spacer Adjust
var spacerAdjust = 27;
//setting "DEFAULT" index as an initial index (menu)
var currentMenu = "DEFAULT";
//Possible Observations "DEFAULT" index
var indexArray = [];
//stores Possible Observations for each index
var indexArrayContents = [];
//
var menu = [];

//stores multiple observations that are selected
//single left click
var selectedObservations = [];


// array stores Unconfirmed Findings
var findingsArray = [];
// array stores Confirmed Findings
var findingsArrayConfirmed = [];

var indexFindingsArray = [];
var indexFindingsArrayConf = [];
var observationsFindingsArray = [];
var observationsFindingsArrayConf = [];

var diagnosisArray = [];
var diagnosisArrayConfirmed = [];

//Dynamic list of dragged observations
//2D array which stores dragged observarion id and type (Positive or Negative) [i][0]=id, [i][1]='pos' or 'neg'
var observationsArray = [];

//whenever row 1 is dragged over row 2
//flags get assigned id of the row	2
var flag = flagClass = "";

var singleClick = doubleClick = false;

//retievs current menu from xml file
//return menu as string array
function retrieveMenu(menuName)
{

  var menuArray = [];

  var objectProperty = namedIndividual0 = namedIndividual1 = classType = null;

  var result = xmlDoc.getElementsByTagName("ObjectPropertyAssertion");

  for (j = 0; j < result.length; j++)
  {
    //Getting value of "ObjectProperty" "NamedIndividual" in <ObjectPropertyAssertion>
    objectProperty = result[j].getElementsByTagName("ObjectProperty")[0].getAttribute("IRI");
    namedIndividual0 = result[j].getElementsByTagName("NamedIndividual")[0].getAttribute("IRI");
    namedIndividual1 = result[j].getElementsByTagName("NamedIndividual")[1].getAttribute("IRI");
    //stripping # sing from namedIndividual0
    namedIndividual0 = namedIndividual0.substr(1, namedIndividual0.length);
    //stripping # sing from namedIndividual1
    namedIndividual1 = namedIndividual1.substr(1, namedIndividual1.length);
    //&& namedIndividual0!=menuName
    if (namedIndividual1 === menuName && objectProperty === "#isObsSuggestingFinding" && namedIndividual0 != menuName)
    {
      if (menuArray.indexOf(namedIndividual0) == -1 && namedIndividual0.length > 0)
        menuArray.push(namedIndividual0);
    }
    // && namedIndividual1!=menuName
    else if (namedIndividual0 === menuName && objectProperty === "#isFindingSuggestedByObs" && namedIndividual0 != menuName)
    {
      if (menuArray.indexOf(namedIndividual1) == -1 && namedIndividual1.length > 0)
        menuArray.push(namedIndividual1);
    }
  }
  //sorts alphabetically retieved menu items from xml document
  menuArray = menuArray.sort();
  //avoid repetition in the array
  //menuArray=avoidRepetition(menuArray);
  //alert(menuArray.length);
  return menuArray;
}

//renders current possible observations assiciated with current index selected
function renderMenu(crrntrMenu)
{
  //getting index of current index
  var indexOfCurrentIndex = indexArray.indexOf(crrntrMenu);
  //retrieveing the array
  var menuArray = indexArrayContents[indexOfCurrentIndex];

  var posbleObsBody = document.getElementById("possibleObservationsBody");

  //preserving draggable object
  var clonableObs = document.getElementById("cloneableObs");
  var clonableEmptyObs = document.getElementById("cloneableEmptyPosObs");
  //deleting old menu
  while (posbleObsBody.firstChild)
    posbleObsBody.removeChild(posbleObsBody.firstChild);

  //alert(menuArray.length+" "+menuArray[menuArray.length-1]);
  var dynamicSpacerHeight = 0;
  var sizeOfMenu = menuArray.length;

  if ((menuArray.length + indexOfCurrentIndex) < 27)
  {
    if (indexOfCurrentIndex == 1)
      dynamicSpacerHeight = 0;
    else if (indexOfCurrentIndex == 2)
      dynamicSpacerHeight = 0;
    else if (indexOfCurrentIndex > 2)
      dynamicSpacerHeight = (indexOfCurrentIndex + 1) * spacerAdjust - (sizeOfMenu + 1) * 8;
  }
  else
  {
    dynamicSpacerHeight = (28 - menuArray.length - indexOfCurrentIndex);
    if (dynamicSpacerHeight < 0)
      dynamicSpacerHeight = 0;
    else
      dynamicSpacerHeight *= spacerAdjust;
  }

  if (dynamicSpacerHeight < 0)
    dynamicSpacerHeight = 0;

  var spacerDiv = document.createElement("DIV");
  spacerDiv.className = "spacer";
  spacerDiv.style.height = dynamicSpacerHeight + "px";
  posbleObsBody.appendChild(spacerDiv);

  for (i = 0; i < menuArray.length; i++)
  {

    //if(indexArrayStates[indexArray.indexOf(currentMenu)][i]==1)
    if (menuArray[i].substr(0, 6) != "randId")
    {
      var clonedObervation = clonableObs.cloneNode(false);
      clonedObervation.className = "possibleObsRow";
      var tempId = menuArray[i];
      clonedObervation.id = tempId;
      clonedObervation.innerHTML = splitString2(tempId, 2);
      if (selectedObservations.indexOf(tempId) != -1)
        clonedObervation.className = "possibleObsRowSelected";
      //adding new cloned menu idem (Possible Observation) into PossibleObservations column
      posbleObsBody.appendChild(clonedObervation);
    }

    else
    {
      var emptyObservation = clonableEmptyObs.cloneNode(false);
      //emptyObservation.id="randId"+Math.floor((Math.random() * 100) + 1);
      emptyObservation.id = menuArray[i];
      emptyObservation.innerHTML = " ";
      //adding new cloned menu idem (Possible Observation) into PossibleObservations column
      posbleObsBody.appendChild(emptyObservation);
    }
    //alert(i);
  }
}

function renderObservations()
{

  //getting instance of "observationsBody" element
  var positiveObservationsBody = document.getElementById("observationsBody");

  //removing all child element of "observationsBody"
  while (observationsBody.firstChild)
    observationsBody.removeChild(observationsBody.firstChild);


  //getting instance of "negativeObservationsBody" element
  var negativeObservationsBody = document.getElementById("negativeObservationsBody");

  //removing all child element of "negativeObservationsBody"
  while (negativeObservationsBody.firstChild)
    negativeObservationsBody.removeChild(negativeObservationsBody.firstChild);

  //alert("observationsArray.length="+observationsArray.length);
  //rendering observations
  for (i = 0; i < observationsArray.length; i++)
  {
    //cloning new "cloneableObs"
    var clonedDiv = document.getElementById("cloneableObs").cloneNode(false);
    clonedDiv.id = observationsArray[i][0];
    clonedDiv.innerHTML = splitString2(observationsArray[i][0], 2);

    if (observationsArray[i][1] == 'pos')
    {
      clonedDiv.className = "observationRow";
      positiveObservationsBody.appendChild(clonedDiv);
    }
    else if (observationsArray[i][1] == 'emptypos')
    {
      var emptyDiv = document.getElementById("cloneableEmptyObs").cloneNode(false);
      //emptyDiv.id="emptypos"+Math.floor((Math.random() * 100) + 101);
      emptyDiv.id = observationsArray[i][0];
      positiveObservationsBody.appendChild(emptyDiv);
    }
    else if (observationsArray[i][1] == 'neg')
    {
      clonedDiv.className = "observationRow";
      clonedDiv.innerHTML = "NO " + clonedDiv.innerHTML;
      negativeObservationsBody.appendChild(clonedDiv);
    }
    else if (observationsArray[i][1] == 'emptyneg')
    {
      var emptyDiv = document.getElementById("cloneableEmptyObs").cloneNode(false);
      //emptyDiv.id="emptyneg"+Math.floor((Math.random() * 100) + 101);
      emptyDiv.id = observationsArray[i][0];
      negativeObservationsBody.appendChild(emptyDiv);
    }
  }
}

function getFindings()
{
  //initializing variables
  var objectProperty = namedIndividual0 = namedIndividual1 = classType = parentNode = null;
  var tempObs;

  findingsArray = [];

  for (i = 0; i < observationsArray.length; i++)
  {
    var classIsFinding = false;
    var tempObs = observationsArray[i][0];

    if (tempObs.substr(tempObs.length - 2, 2) == "_%" || tempObs.substr(tempObs.length - 2, 2) == "%_")
      tempObs = tempObs.substr(0, tempObs.length - 2);

    if (tempObs.substr(tempObs.length - 1, 1) == "_" || tempObs.substr(tempObs.length - 1, 1) == "%")
      tempObs = tempObs.substr(0, tempObs.length - 1);


    /*if(observationsArray[i][0].substr(observationsArray[i][0].length-1,1)=="%")
     tempObs=observationsArray[i][0].substr(0,observationsArray[i][0].length-1);
     else
     tempObs=observationsArray[i][0];
     */

    var result = xmlDoc.getElementsByTagName('ClassAssertion');

    for (j = 0; j < result.length; j++)
    {
      //Getting value of "NamedIndividual" in <ClassAssertion>
      parentNode = result[j].getElementsByTagName("Class")[0].parentNode.nodeName;
      namedIndividual0 = result[j].getElementsByTagName("NamedIndividual")[0].getAttribute("IRI");
      namedIndividual0 = namedIndividual0.substr(1, namedIndividual0.length - 1);

      //Getting value of "Class" in <ClassAssertion>
      classType = result[j].getElementsByTagName("Class")[0].getAttribute("IRI");
      classType = classType.substr(1, classType.length);

      if (namedIndividual0.toUpperCase() == tempObs.toUpperCase() && classType.toUpperCase() === "FINDING" && parentNode.toUpperCase() == "CLASSASSERTION")
      {
        if (findingsArray.indexOf(namedIndividual0 + "_") == -1 && findingsArrayConfirmed.indexOf(namedIndividual0 + "_") == -1 && indexFindingsArray.indexOf(namedIndividual0 + "_") == -1 && indexFindingsArrayConf.indexOf(namedIndividual0 + "_") == -1)
        {
          indexFindingsArray.push(namedIndividual0 + "_");
          classIsFinding = true;
        }

      }
    }

    //Searching through "ObjectPropertyAssertion"
    //dropped element is not "ClassAssertion", the search continues on "ObjectPropertyAssertion"
    if (!classIsFinding)
    {
      //if possible observation was dropped into observations, search runs through "ObjectPropertyAssertion" elements
      //otherwise, when possible observation was dropped into NEGATIVE observations, search runs through "NegativeObjectPropertyAssertion" elements
      var result;

      if (observationsArray[i][1] == "pos")
        result = xmlDoc.getElementsByTagName("ObjectPropertyAssertion");
      else
        result = xmlDoc.getElementsByTagName("NegativeObjectPropertyAssertion");


      //loop  performs comparison with dropped items and xml file
      for (j = 0; j < result.length; j++)
      {
        //getting values of attributes of child elements
        objectProperty = result[j].getElementsByTagName("ObjectProperty")[0].getAttribute('IRI');
        namedIndividual0 = result[j].getElementsByTagName("NamedIndividual")[0].getAttribute('IRI');
        namedIndividual1 = result[j].getElementsByTagName("NamedIndividual")[1].getAttribute('IRI');
        //stripping '#' signs
        namedIndividual0 = namedIndividual0.substring(1, namedIndividual0.length);
        namedIndividual1 = namedIndividual1.substring(1, namedIndividual1.length);

        //isObsSuggestingFinding, isFindingSuggestedByObs
        //if matched element is found, program adds found item into column3

        if (objectProperty == "#isObsSuggestingFinding" || objectProperty == "#isFindingSuggestedByObs")
        {
          var newDiv = document.createElement("DIV");
          newDiv.className = "finding_row";

          if (namedIndividual0.toUpperCase() === tempObs.toUpperCase())
          {
            //avoid repetition in the array
            if (findingsArray.indexOf(namedIndividual1) == -1 && findingsArrayConfirmed.indexOf(namedIndividual1) == -1 && indexFindingsArray.indexOf(namedIndividual1) == -1 && indexFindingsArrayConf.indexOf(namedIndividual1) == -1)
            {

              newDiv.innerHTML = splitString2(namedIndividual1, 1);
              findingsArray.push(namedIndividual1);
              //alert(namedIndividual1+"_");
              //findings.appendChild(newDiv);
            }

          }
          else if (namedIndividual1.toUpperCase() === tempObs.toUpperCase())
          {
            //avoid repetition in the array
            if (findingsArray.indexOf(namedIndividual0) == -1 && findingsArrayConfirmed.indexOf(namedIndividual0) == -1 && indexFindingsArray.indexOf(namedIndividual0) == -1 && indexFindingsArrayConf.indexOf(namedIndividual0) == -1)
            {
              newDiv.innerHTML = splitString2(namedIndividual0, 1);
              findingsArray.push(namedIndividual0);
              //alert(namedIndividual0+"_");
              //findings.appendChild(newDiv);
            }
          }

        }
      }//END of "ObjectPropertyAssertion"
    }//END of classAssertionFound
  }//END of "childNodeArray" - array of Observations

  //findingsArray=findingsArray.sort();
  renderFindings();
}//END of function

function confirmFinding(ev) {

  var findingId = ev.target.id;

  for (i = 0; i < findingsArray.length; i++)
  {
    if (findingsArray[i] == findingId)
    {
      findingsArray.splice(i, 1);
      findingsArrayConfirmed.push(findingId);
    }
  }
  findingsArrayConfirmed = findingsArrayConfirmed.sort();
  renderFindings();
  getDiagnosis();
}

function unconfirmFinding(ev) {
  var findingId = ev.target.id;

  for (i = 0; i < findingsArrayConfirmed.length; i++)
  {
    if (findingsArrayConfirmed[i] == findingId)
    {

      findingsArrayConfirmed.splice(i, 1);
      findingsArray.push(findingId);
    }
  }

  findingsArray = findingsArray.sort();
  renderFindings();
  getDiagnosis();
}

function confirmIndexFinding(ev)
{
  //alert(ev.target.id);
  var findingId = ev.target.id;

  for (i = 0; i < indexFindingsArray.length; i++)
  {
    if (indexFindingsArray[i] == findingId)
    {
      indexFindingsArray.splice(i, 1);
      indexFindingsArrayConf.push(findingId);
      break;
    }
  }
  indexFindingsArrayConf = indexFindingsArrayConf.sort();
  renderFindings();
  getDiagnosis();

}

function unconfirmIndexFinding(ev)
{
  var findingId = ev.target.id;

  for (i = 0; i < indexFindingsArrayConf.length; i++)
  {
    if (indexFindingsArrayConf[i] == findingId)
    {

      indexFindingsArrayConf.splice(i, 1);
      indexFindingsArray.push(findingId);
    }
  }

  indexFindingsArray = indexFindingsArray.sort();
  renderFindings();
  getDiagnosis();
}

function confirmObsFinding(ev)
{
  //alert("confirm!");
  var findingId = ev.target.id;

  for (i = 0; i < observationsFindingsArray.length; i++)
  {
    if (observationsFindingsArray[i][0] == findingId)
    {
      if (observationsFindingsArray[0][1] == 'pos')
        observationsFindingsArrayConf.push([findingId, "pos"]);
      else
        observationsFindingsArrayConf.push([findingId, "neg"]);

      observationsFindingsArray.splice(i, 1);
      break;
    }
  }
  //observationsFindingsArrayConf=observationsFindingsArrayConf.sort();
  renderFindings();
  getDiagnosis();
  getPlans();
}

function unconfirmObsFinding(ev)
{
  //alert("unconfirm!");
  var findingId = ev.target.id;

  for (i = 0; i < observationsFindingsArrayConf.length; i++)
  {
    if (observationsFindingsArrayConf[i][0] == findingId)
    {
      if (observationsFindingsArrayConf[0][1] == 'pos')
        observationsFindingsArray.push([findingId, "pos"]);
      else
        observationsFindingsArray.push([findingId, "neg"]);

      observationsFindingsArrayConf.splice(i, 1);
      break;
    }
  }
  //alert("size: "+observationsFindingsArrayConf.length);
  //observationsFindingsArray=observationsFindingsArray.sort();
  renderFindings();
  getDiagnosis();
  getPlans();
}



function renderFindings()
{
  //Removing all child nodes of Column3
  var findings = document.getElementById('findingsBody');

  //cleaning the Findings container, before updating it
  while (findings.firstChild)
    findings.removeChild(findings.firstChild);

  //rendering Confirmed Observations in Findings
  for (i = 0; i < observationsFindingsArrayConf.length; i++)
  {
    var newDiv = document.getElementById("cloneableConfObservationFinding").cloneNode(false);
    newDiv.className = "observation_finding_row_conf";
    newDiv.id = observationsFindingsArrayConf[i][0];

    if (observationsFindingsArrayConf[i][1] == 'pos')
    {
      newDiv.innerHTML = splitString2(observationsFindingsArrayConf[i][0], 2);
      findings.appendChild(newDiv);
    }
    else if (observationsFindingsArrayConf[i][1] == 'neg')
    {
      newDiv.innerHTML = "NO " + splitString2(observationsFindingsArrayConf[i][0], 2);
      findings.appendChild(newDiv);
    }
    else //if(observationsArray[i][1]=='emptypos')
    {
      var emptyDiv = document.getElementById("cloneableEmptyObsFind").cloneNode(false);
      emptyDiv.id = observationsFindingsArrayConf[i][0];
      //positiveObservationsBody.appendChild(emptyDiv);
      findings.appendChild(emptyDiv);
    }


  }

  //seperator between observations & findings in Findings column
  if (observationsFindingsArrayConf.length > 0)
  {
    var newDiv = document.createElement("DIV");
    newDiv.className = "finding_row_empty";
    findings.appendChild(newDiv);
  }
  //observationsFindingsArrayConf
  //rendering Observations in Findings
  for (i = 0; i < observationsFindingsArray.length; i++)
  {
    var newDiv = document.getElementById("cloneableObservationFinding").cloneNode(false);
    newDiv.className = "observation_finding_row";
    newDiv.id = observationsFindingsArray[i][0];

    if (observationsFindingsArray[i][1] == 'pos')
    {
      newDiv.innerHTML = splitString2(observationsFindingsArray[i][0], 2);
      findings.appendChild(newDiv);
    }
    else if (observationsFindingsArray[i][1] == 'neg')
    {
      newDiv.innerHTML = "NO " + splitString2(observationsFindingsArray[i][0], 2);
      findings.appendChild(newDiv);
    }
    else //if(observationsArray[i][1]=='emptypos')
    {
      var emptyDiv = document.getElementById("cloneableEmptyObsFind").cloneNode(false);
      emptyDiv.id = observationsFindingsArray[i][0];
      findings.appendChild(emptyDiv);
    }


  }

  //seperator between observations & findings in Findings column
  if (observationsFindingsArray.length > 0)
  {
    var newDiv = document.createElement("DIV");
    newDiv.className = "finding_row_empty";
    findings.appendChild(newDiv);
  }


  //rendering Confirmed Indexes in Findings
  for (i = 0; i < indexFindingsArrayConf.length; i++)
  {
    var newDiv = document.getElementById("cloneableConfIndexFinding").cloneNode(false);
    newDiv.id = indexFindingsArrayConf[i];
    newDiv.innerHTML = splitString2(indexFindingsArrayConf[i], 1);
    findings.appendChild(newDiv);
  }

  //seperator between index findings & findings
  if (indexFindingsArrayConf.length > 0)
  {
    //cloneableFinding
    var newDiv = document.createElement("DIV");
    newDiv.className = "finding_row_empty";
    findings.appendChild(newDiv);
  }

  //rendering Confirmed Indexes in Findings
  for (i = 0; i < indexFindingsArray.length; i++)
  {
    var newDiv = document.getElementById("cloneableIndexFinding").cloneNode(false);
    newDiv.id = indexFindingsArray[i];
    newDiv.innerHTML = splitString2(indexFindingsArray[i], 1);
    findings.appendChild(newDiv);
  }

  //seperator between index findings & findings
  if (indexFindingsArray.length > 0)
  {
    var newDiv = document.createElement("DIV");
    newDiv.className = "finding_row_empty";
    findings.appendChild(newDiv);
  }

  //rendering confirmed findings
  for (i = 0; i < findingsArrayConfirmed.length; i++)
  {
    var newDiv = document.getElementById("cloneableConfirmedFinding").cloneNode(false);
    newDiv.id = findingsArrayConfirmed[i];
    newDiv.innerHTML = splitString2(findingsArrayConfirmed[i], 1);
    ;
    findings.appendChild(newDiv);
  }

  //seperator between confirmed & unconfirmed findings
  if (findingsArrayConfirmed.length > 0)
  {
    var newDiv = document.createElement("DIV");
    newDiv.className = "finding_row_empty";
    findings.appendChild(newDiv);
  }

  //rendering unconfirmed findings
  for (i = 0; i < findingsArray.length; i++)
  {
    var newDiv = document.getElementById("cloneableFinding").cloneNode(false);
    newDiv.className = "finding_row";
    newDiv.id = findingsArray[i];
    newDiv.innerHTML = splitString2(findingsArray[i], 1);
    findings.appendChild(newDiv);
    /*
     var newDiv = document.createElement("DIV");
     newDiv.className="finding_row";*/
    findings.appendChild(newDiv);
  }
}

function getDiagnosis() {

  //initializing variables
  var objectProperty = namedIndividual0 = namedIndividual1 = classType = parentNode = null;
  var tempFinding;
  var tempObsFindArray = [];

  for (i = 0; i < observationsFindingsArray.length; i++)
    tempObsFindArray.push(observationsFindingsArray[i][0]);

  var tempFindingsAndIndexArray = indexFindingsArrayConf.concat(findingsArrayConfirmed, tempObsFindArray);

  //alert(tempFindingsAndIndexArray.length)
  //resetting diagnosisArray
  diagnosisArray = [];
  diagnosisArrayConfirmed = [];

  for (i = 0; i < tempFindingsAndIndexArray.length; i++)
  {
    tempFinding = tempFindingsAndIndexArray[i];

    if (tempFinding.substr(tempFinding.length - 2, 2) == "_%" || tempFinding.substr(tempFinding.length - 2, 2) == "%_")
      tempFinding = tempFinding.substr(0, tempFinding.length - 2);

    if (tempFinding.substr(tempFinding.length - 1, 1) == "_" || tempFinding.substr(tempFinding.length - 1, 1) == "%")
      tempFinding = tempFinding.substr(0, tempFinding.length - 1);

    //alert(tempFinding);

    var result = xmlDoc.getElementsByTagName("ObjectPropertyAssertion");

    for (j = 0; j < result.length; j++)
    {
      objectProperty = result[j].getElementsByTagName("ObjectProperty")[0].getAttribute('IRI');
      namedIndividual0 = result[j].getElementsByTagName("NamedIndividual")[0].getAttribute('IRI');
      namedIndividual1 = result[j].getElementsByTagName("NamedIndividual")[1].getAttribute('IRI');
      //stripping '#' signs
      namedIndividual0 = namedIndividual0.substring(1, namedIndividual0.length);
      namedIndividual1 = namedIndividual1.substring(1, namedIndividual1.length);

      if (objectProperty == "#isDxSuggestedByFinding" || objectProperty == "#isFindingSuggestingDx")
      {
        if (namedIndividual1 == tempFinding)
        {
          //avoid repetition in the array
          if (diagnosisArray.indexOf(namedIndividual0) == -1 && diagnosisArrayConfirmed.indexOf(namedIndividual0) == -1)
            diagnosisArray.push(namedIndividual0);
        }

      }
    }//END of "ObjectPropertyAssertion"
  }//END of classAssertionFound

  diagnosisArray = diagnosisArray.sort();
  renderDiagnosis();
}

function confirmDiagnosis(ev)
{
  console.log("Diagnose Confirmed: " + ev.target.className + " - " + ev.target.id);
  var diagnosisId = ev.target.id;
  for (i = 0; i < diagnosisArray.length; i++) {
    if (diagnosisArray[i] == diagnosisId) {
      diagnosisArray.splice(i, 1);
      diagnosisArrayConfirmed.push(diagnosisId);
    }
  }
  diagnosisArrayConfirmed = diagnosisArrayConfirmed.sort();
  renderDiagnosis();
  getPlans();
}

function unconfirmDiagnosis(ev) {
  console.log("Diagnose Unconfirmed: " + ev.target.className + "-" + ev.target.id);
  var diagnosisId = ev.target.id;
  for (i = 0; i < diagnosisArrayConfirmed.length; i++) {
    if (diagnosisArrayConfirmed[i] == diagnosisId)
    {
      diagnosisArrayConfirmed.splice(i, 1);
      diagnosisArray.push(diagnosisId);
//      break;
    }
  }
  diagnosisArray = diagnosisArray.sort();
  renderDiagnosis();
  getPlans();
}

function renderDiagnosis() {
  //Removing all child nodes of Column3
  var diagnosis = document.getElementById('diagnosisBody');
  //cleaning the Findings container, before updating it
  while (diagnosis.firstChild) {
    diagnosis.removeChild(diagnosis.firstChild);
  }

  for (i = 0; i < diagnosisArrayConfirmed.length; i++) {
    var newDiv = document.getElementById("cloneableConfirmedDiagnosis").cloneNode(false);
    newDiv.id = diagnosisArrayConfirmed[i];
    newDiv.innerHTML = splitString2(diagnosisArrayConfirmed[i], 1);
    diagnosis.appendChild(newDiv);
  }

  if (diagnosisArrayConfirmed.length > 0) {
    var newDiv = document.createElement("DIV");
    newDiv.className = "finding_row_empty";
    diagnosis.appendChild(newDiv);
  }


  for (i = 0; i < diagnosisArray.length; i++)
  {
    var newDiv = document.getElementById("cloneableDiagnosis").cloneNode(false);
    newDiv.id = diagnosisArray[i];
    newDiv.innerHTML = splitString2(diagnosisArray[i], 1);
    diagnosis.appendChild(newDiv);
  }
}

function getPlans() {
  //initializing variables
  var objectProperty = namedIndividual0 = namedIndividual1 = classType = parentNode = null;
  var tempDx;
  var tempObsFindArray = [];

  console.log("Dx Conf Array: " + diagnosisArrayConfirmed);
  for (i = 0; i < diagnosisArrayConfirmed.length; i++) {
    console.log("  -" + diagnosisArrayConfirmed[i]);
  }

  //resetting plan Arrays
  plansArray = [];
  plansArrayConfirmed = [];

  for (i = 0; i < diagnosisArrayConfirmed.length; i++) {
    tempFinding = diagnosisArrayConfirmed[i];

    if (tempFinding.substr(tempFinding.length - 2, 2) == "_%" || tempFinding.substr(tempFinding.length - 2, 2) == "%_") {
      tempFinding = tempFinding.substr(0, tempFinding.length - 2);
    }

    if (tempFinding.substr(tempFinding.length - 1, 1) == "_" || tempFinding.substr(tempFinding.length - 1, 1) == "%") {
      tempFinding = tempFinding.substr(0, tempFinding.length - 1);
    }

    var result = xmlDoc.getElementsByTagName("ObjectPropertyAssertion");

    for (j = 0; j < result.length; j++)
    {
      objectProperty = result[j].getElementsByTagName("ObjectProperty")[0].getAttribute('IRI');
      namedIndividual0 = result[j].getElementsByTagName("NamedIndividual")[0].getAttribute('IRI');
      namedIndividual1 = result[j].getElementsByTagName("NamedIndividual")[1].getAttribute('IRI');
      //stripping '#' signs
      namedIndividual0 = namedIndividual0.substring(1, namedIndividual0.length);
      namedIndividual1 = namedIndividual1.substring(1, namedIndividual1.length);

      if (objectProperty == "#isDxSuggestingPlan" || objectProperty == "isFindingSuggestingPlan")
      {
        console.log("~~~Getting Plans. tempDxConf: " + tempFinding);
        console.log(namedIndividual0);
        console.log(namedIndividual1);
        if (namedIndividual0 == tempFinding)
        {
          //avoid repetition in the array
          if (plansArray.indexOf(namedIndividual1) == -1 && plansArrayConfirmed.indexOf(namedIndividual1) == -1) {
            plansArray.push(namedIndividual1);
          }
        }

      }
    }//END of "ObjectPropertyAssertion"
  }//END of classAssertionFound

  plansArray = plansArray.sort();
  renderPlans();
}

function renderPlans() {
  //Removing all child nodes of Plans
  var plans = document.getElementById('planBody');
  //cleaning the Plans container, before updating it
  while (plans.firstChild) {
    plans.removeChild(plans.firstChild);
  }

  console.log("Plans Confirmed:");
  for (i = 0; i < plansArrayConfirmed.length; i++) {
    console.log("   -" + plansArrayConfirmed[i]);
    var newDiv = document.getElementById("cloneableConfirmedPlan").cloneNode(false);
    newDiv.id = plansArrayConfirmed[i];
    newDiv.innerHTML = splitString2(plansArrayConfirmed[i], 1);
    plans.appendChild(newDiv);
  }

  if (plansArrayConfirmed.length > 0) {
    var newDiv = document.createElement("DIV");
    newDiv.className = "plan_row_empty";
    plans.appendChild(newDiv);
  }

  console.log("Plans:");
  for (i = 0; i < plansArray.length; i++) {
    console.log("   -" + plansArray[i]);
    var newDiv = document.getElementById("cloneablePlan").cloneNode(false);
    newDiv.id = plansArray[i];
    newDiv.innerHTML = splitString2(plansArray[i], 1);
    plans.appendChild(newDiv);
  }
}

function confirmPlan(ev) {
  console.log("Plan Confirmed" + ev.target.id);
  var planId = ev.target.id;
  for (i = 0; i < plansArray.length; i++) {
    if (plansArray[i] == planId) {
      plansArray.splice(i, 1);
      plansArrayConfirmed.push(planId);
    }
  }
  plansArrayConfirmed = plansArrayConfirmed.sort();
  renderPlans();

  console.log("TODO: Add some functionality upon request");
}

function unconfirmPlan(ev) {
  console.log("Plan Unonfirmed" + ev.target.id);
  var planId = ev.target.id;
  for (i = 0; i < plansArrayConfirmed.length; i++) {
    if (plansArrayConfirmed[i] == planId) {
      plansArrayConfirmed.splice(i, 1);
      plansArray.push(planId);
    }
  }

  plansArray = plansArray.sort();
  renderPlans();

  console.log("TODO: Add some functionality upon request");
}

function onDoubleClickPlan(ev) {
  console.log("Plan Double Clicked" + ev.target.id);
  console.log("TODO: Add some functionality upon request");
}

//since contents (contents of innerHTML of DIV element) are not split
//with spaced in between, and some of them longer that 20 characters
//this function splits string into 2 lines in order to fit the content
//into the DIV element
function splitString(stringToSplit, splitIndex)
{
  if (stringToSplit.length > splitIndex && stringToSplit.length - splitIndex > 3)
  {
    var tempStr = stringToSplit.substr(0, splitIndex) + "\n" + stringToSplit.substr(splitIndex, stringToSplit.length - splitIndex);
    return tempStr;
  }
  return stringToSplit;
}

//This functions splits given cample case string
//if type=1 and stringToSplit=oneTwoThreeFour
//it returns: one Two Three Four
//
//if type=2 and stringToSplit=oneTwoThreeFour
//it returns: One Two Three Four
//
//if type=3 and stringToSplit=oneTwoThreeFour
//it returns: One two three four
function splitString2(stringToSplit, type)
{
  var newSplitString = "";
  var initialPos = 0;
  var currentChar;
  var stringSize = stringToSplit.length;

  if (type == 1)
  {
    for (k = 0; k < stringSize; k++)
    {
      currentChar = stringToSplit.substr(k, 1);
      if (currentChar == currentChar.toUpperCase())
      {
        newSplitString = newSplitString + stringToSplit.substr(initialPos, k - initialPos) + " ";
        initialPos = k;
        k++;
        stringSize++;
      }
    }
    newSplitString = newSplitString.substr(0, 1).toUpperCase() + newSplitString.substr(1, initialPos) + " ";
    newSplitString = newSplitString + stringToSplit.substr(initialPos, 1).toUpperCase() + stringToSplit.substr(initialPos + 1, stringToSplit.length - 1);
  }
  else
  {
    var extraWordFound = false;

    for (k = 1; k < stringSize; k++)
    {
      currentChar = stringToSplit.substr(k, 1);
      if (currentChar == currentChar.toUpperCase())
      {
        extraWordFound = true;
        newSplitString =
                newSplitString + stringToSplit.substr(initialPos, 1).toLowerCase() + stringToSplit.substr(initialPos + 1, k - 1 - initialPos) + " ";
        initialPos = k;
        k++;
        stringSize++;
      }
    }
    //newSplitString=newSplitString.substr(0,initialPos+1)+"_";
    newSplitString = newSplitString.substr(0, 1).toLowerCase() + newSplitString.substr(1, initialPos) + " ";
    newSplitString = newSplitString + stringToSplit.substr(initialPos, 1).toLowerCase() + stringToSplit.substr(initialPos + 1, stringToSplit.length - 1);
  }
  newSplitString = newSplitString.trim();

  if (newSplitString.substr(newSplitString.length - 2, 2) == "%_")
    newSplitString = newSplitString.substr(0, newSplitString.length - 2);
  else if (newSplitString.substr(newSplitString.length - 1, 1) == "_" || newSplitString.substr(newSplitString.length - 1, 1) == "%")
    newSplitString = newSplitString.substr(0, newSplitString.length - 1);


  return newSplitString;
}

function indexOf2D(searchArray, searchIndex, searchedElement)
{
  for (k = 0; k < searchArray.length; k++)
  {
    if (searchArray[k][searchIndex] == searchedElement)
    {
      return k;
    }
  }

  return -1;
}

function delete2D(searchArray, searchIndex, searchedElement)
{
  for (k = 0; k < searchArray.length; k++)
  {
    if (searchArray[k][searchIndex] == searchedElement)
    {
      searchArray.splice(k, 1);
      return k;
    }
  }

  return -1;
}

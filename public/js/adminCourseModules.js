define (['module'], function (module){

    const useLogging = module.config().useLogging;
    const baseURL = module.config().baseURL;
    const getModulesForCourseAPI = module.config().getModulesForCourseAPI;
    const getModuleHTMLForCourseAndOrder = module.config().getModuleForCourseAndOrderAPI;
    const addCourseModuleAPI = module.config().addCourseModuleAPI;
    
    let moduleTableBody = document.getElementById('selectedModuleHTML');
    let moduleSelect = document.getElementById('moduleOrderChoice');
    let currentCourse = document.getElementById('courseToGetModulesFrom');
    let addModuleButton = document.getElementById('addModuleButton');
    

// ------------- Event Listeners----------------
    document.getElementById('moduleOrderForm').style.display = 'none'

    currentCourse.addEventListener('change',function(){
        //clear current modules displayed (if any)
        document.getElementById('moduleOrderForm').style.display = 'none'
        moduleTableBody.innerHTML = "";
        moduleSelect.innerHTML= '';

        if (currentCourse.value == "noSelection"){
            moduleTableBody.innerHTML = "";
            moduleSelect.innerHTML= '';
            return
        }
        //take out "Select Module" 
        //re-populate classes based on category selection
        populateModulesSelect(currentCourse.value)
    });

    moduleSelect.addEventListener('change', function(){
        if (moduleSelect.value == "noSelection"){
            moduleTableBody.innerHTML = "";
            moduleSelect.innerHTML= '';
            populateModulesSelect(currentCourse.value)

        } else{
            //call function to get that module's HTML
            getModuleHTML(currentCourse.value, moduleSelect.value)
        }
    })

    addModuleButton.addEventListener('click', function(){
        if(currentCourse.value == "noSelection"){
            alert('Oops! You have to select a course')
        }
        moduleHTML= document.getElementById('moduleHTMLInput')
        moduleOrder = document.getElementById('moduleOrderInput')
        addModuleToCourseAPI(moduleOrder.value, moduleHTML.value, currentCourse.value)
    })

//------------- Main functions-------------

    function addModuleToCourseAPI(moduleOrder, moduleHTML, courseId){
        var input = {moduleOrder: moduleOrder, moduleHTML: moduleHTML, courseId: courseId }
        let req = new XMLHttpRequest();
        req.open("POST", baseURL + addCourseModuleAPI, true);

        req.setRequestHeader("Content-type", "application/json");
        req.addEventListener("load", function () {
            if (req.status >=200 && req.status < 400) {
                let data = JSON.parse(req.response);
                logIt(data)
                if (data.results.length == 0) {
                    logIt('There was an error in inserting your language')
                }else {
                    logIt('Module successfully inserted')
                    //re-populates table with updated data
                    //moduleTableBody.innerHTML = ''
                    //populateModulesSelect(currentCourse.value)
                }
            }
        })
        req.send(JSON.stringify(input));
        event.preventDefault();
    }

    function populateModulesSelect(courseId){

        let req = new XMLHttpRequest();
        req.open("GET", baseURL + getModulesForCourseAPI + courseId, true);
        req.setRequestHeader("Content-type", "application/json");
        req.addEventListener("load", function () {
            if (req.status >=200 && req.status < 400) {
                let data = JSON.parse(req.response);
                if (data.results.length == 0) {
                } else {
                    let dropDownNoSelection = document.createElement('option');
                    dropDownNoSelection.setAttribute('value',"noSelection")
                    dropDownNoSelection.innerHTML = '--';
                    moduleSelect.appendChild(dropDownNoSelection)

                    for (let someMod of data.results){
                        let dropDownOption = document.createElement("option");
                        dropDownOption.setAttribute("value", someMod.courseModuleId);
                        dropDownOption.text = someMod.courseModuleOrder;
                        moduleSelect.appendChild(dropDownOption)
                    }
                }
            }
        
            document.getElementById('moduleOrderForm').style.display = 'block'
    })  
    req.send(JSON.stringify(null));
    event.preventDefault();
    
}

function getModuleHTML(courseId, moduleId){
    let req = new XMLHttpRequest();
    req.open("GET", baseURL + getModuleHTMLForCourseAndOrder + courseId + '/' + moduleId, true);
    req.setRequestHeader("Content-type", "application/json");
    req.addEventListener("load", function () {
        if (req.status >=200 && req.status < 400) {
            let data = JSON.parse(req.response);
            if (data.results.length == 0) {
            } else {
                let cell1 = document.getElementById('selectedModuleHTML')
                cell1.innerHTML = data.results[0].courseModuleHTML
            }
        }
    })
    req.send(JSON.stringify(null));
    event.preventDefault();
}

function logIt(someMessage) {
    if (useLogging) {
      console.log(someMessage);
    }
  }

})



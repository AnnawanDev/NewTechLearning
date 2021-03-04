define (['module'], function (module){

    const useLogging = module.config().useLogging;
    const baseURL = module.config().baseURL;
    const getModulesForCourseAPI = module.config().getModulesForCourseAPI;
    const getModuleHTMLForCourseAndOrder = module.config().getModuleForCourseAndOrderAPI;
    const addCourseModuleAPI = module.config().addCourseModuleAPI;
    const deleteCourseModuleAPI = module.config().deleteCourseModuleAPI;
    const editCourseModuleAPI = module.config().editCourseModuleAPI;

    let moduleTable =  document.getElementById("selectedModuleDisplayTable")
    moduleTable.style.display = 'none';
    let moduleSelect = document.getElementById('moduleOrderChoice');
    let currentCourse = document.getElementById('courseToGetModulesFrom');
    let addModuleButton = document.getElementById('addModuleButton');
    
    
// ------------- Event Listeners----------------
    document.getElementById('moduleOrderForm').style.display = 'none'

    currentCourse.addEventListener('change',function(){
        //clear current modules displayed (if any)
        document.getElementById('moduleOrderForm').style.display = 'none'
        moduleTable.innerHTML = "";
        moduleSelect.innerHTML= '';
        
        if (currentCourse.value == "noSelection"){
            moduleTable.innerHTML = '';
            moduleSelect.innerHTML= '';
            return
        }
        //take out "Select Module" 
        //re-populate classes based on category selection
        populateModulesSelect(currentCourse.value)
    });

    moduleSelect.addEventListener('change', function(){
        if (moduleSelect.value == "noSelection"){
            moduleTable.innerHTML = "";
            moduleSelect.innerHTML= '';
            populateModulesSelect(currentCourse.value)

        } else{
            //call function to get that module's HTML
            getModuleHTML(currentCourse.value, moduleSelect.value)
        }
    })

    addModuleButton.addEventListener('click', function(){
        if(currentCourse.value == "noSelection") {
            alert('Oops! You have to select a course')
            return
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
                    alert("Module successfully inserted")
                    //re-populates table with updated data
                    moduleTable.innerHTML = ''
                    moduleSelect.innerHTML= '';
                    populateModulesSelect(currentCourse.value)
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
                moduleTable.innerHTML = ''
                let tbody = document.createElement('tbody')
                let trow = moduleTable.insertRow(-1); 
                let td = document.createElement('td');
                let cell = document.createElement('textarea')
                cell.value = data.results[0].courseModuleHTML
                // or
                cell.rows = '70'
                cell.cols = '100'
                cell.innerHTML = data.results[0].courseModuleHTML
                td.appendChild(cell)
                trow.appendChild(td)
                
                var cell2 = document.createElement('input')
                cell2.type="button";
                cell2.value = "DELETE THIS MODULE"
                cell2.name= 'delete'
                cell2.addEventListener("click", function() {
                    deleteModule(courseId, moduleId);
                });
                let td2 = document.createElement('td')
                td2.appendChild(cell2)
                let trow2 = document.createElement('tr')
                trow2.appendChild(td2);
                tbody.appendChild(trow2)
                

                var cell3 = document.createElement('input')
                cell3.type="button";
                cell3.value = "UPDATE THIS MODULE"
                cell3.name= 'update'
                cell3.addEventListener("click", function() {
                    //let newOrder = cell.value
                    let newHTML = cell.value
                    editCourseModule(courseId, moduleId, newHTML);
                });
                let td3 = document.createElement('td')
                td3.appendChild(cell3)
                let trow3 = document.createElement('tr')
                trow3.appendChild(td3);

                //--------------------------
                tbody.appendChild(trow3)
                moduleTable.appendChild(tbody)
                moduleTable.style.display = 'block'
            }
        }
    })
    req.send(JSON.stringify(null));
    event.preventDefault();
}

function deleteModule(courseId, moduleId){
        let req = new XMLHttpRequest();
        req.open("GET", baseURL + deleteCourseModuleAPI + moduleId, true);
        req.setRequestHeader("Content-type", "application/json");
        req.addEventListener("load", function () {
            if (req.status >=200 && req.status < 400) {
                let data = JSON.parse(req.response);
                if (data.results.length == 0) {
                    logIt("We weren't able to delete that module!")
                }else{
                    logIt('Module successfully deleted')
                    //re-populates table with updated data
                    moduleTable.innerHTML = "";
                    moduleSelect.innerHTML= '';
                    populateModulesSelect(courseId)
                }
            } else {
                logIt("OOPS! We've had a problem deleting that category.")
            }

        })
        req.send(JSON.stringify(null));
        event.preventDefault();
}

function editCourseModule(courseId, moduleId, newHTML){
    let input = {courseModuleId: moduleId, newHTML: newHTML,}
    let req = new XMLHttpRequest();
    req.open("POST", baseURL + editCourseModuleAPI, true);
    req.setRequestHeader("Content-type", "application/json");
    req.addEventListener('load', function(){
        if (req.status >=200 && req.status < 400) {
            let data = JSON.parse(req.response);
            if (data.results.length == 0) {
                logIt("We weren't able to edit that courseModule!")
            }else{
                logIt('Module was successfully edited')
                //re-populates table with updated data
                moduleTable.innerHTML = "";
                moduleSelect.innerHTML= '';
                populateModulesSelect(courseId)
            }
        } else {
            logIt("OOPS! We've had a problem editing that category.")
        }
    })
    req.send(JSON.stringify(input));
    event.preventDefault();
}

function logIt(someMessage) {
    if (useLogging) {
      console.log(someMessage);
    }
  }
})



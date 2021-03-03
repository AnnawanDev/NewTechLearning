define (['module'], function (module){
    const useLogging = module.config().useLogging;
    const baseURL = module.config().baseURL;
    const getLanguagesAPI = module.config().getLanguagesAPI;
    const addLanguageAPI = module.config().addLanguageAPI;
    const deleteLanguageAPI = module.config().deleteLanguageAPI;
    const editLanguageAPI= module.config().editLanguageAPI;
    const languagesTableBody = document.getElementById('langAdminTableBody');

    populateLanguageTable();
    let addLanguageButton = document.getElementById('addLanguageButton');
    addLanguageButton.addEventListener('click', function(){
        let langNameInput = document.getElementById('languageNameInput').value
        let langCountryInput = document.getElementById('languageCountryInput').value
        if (langCountryInput && langNameInput) {
            addLanguage(langNameInput,langCountryInput)
        } else {
            alert("Please enter all fields in order to successfully add a language.")
        }
    })


    function populateLanguageTable(){
        let req = new XMLHttpRequest();
        req.open("GET", baseURL + getLanguagesAPI, true);
        req.setRequestHeader("Content-type", "application/json");
        req.addEventListener("load", function () {
            if (req.status >=200 && req.status < 400) {
                let data = JSON.parse(req.response);
                if (data.results.length == 0) {
                } else {
                    for (let someLang of data.results) {
            
                        // cell3 - UPDATE
                        let newRow = languagesTableBody.insertRow(-1);
                        let newTd = document.createElement('td')
                        let cell =document.createElement('input')
                        cell.value = someLang.languageName
                        newTd.appendChild(cell)
                        newRow.appendChild(newTd)

                        let newTd1 = document.createElement('td')
                        let cell1 =document.createElement('input')
                        cell1.value = someLang.languageCountry
                        newTd1.appendChild(cell1)
                        newRow.appendChild(newTd1)

                        // cell2 is a button with click listener that calls deleteCategoryAPI onClick
                        let newTd2 = document.createElement('td')
                        let cell2 = document.createElement('input')
                        cell2.type="button";
                        cell2.value = "delete"
                        cell2.name= 'delete'
                        cell2.addEventListener("click", function() {
                            deleteLanguage(someLang.languageId);
                        });
                        newTd2.appendChild(cell2)
                        newRow.appendChild(newTd2)
                        // cell3 - UPDATE

                        let newTd3 = document.createElement('td');
                        let cell3 = document.createElement('input');
                        cell3.type="button";
                        cell3.value = "update"
                        cell3.name= 'edit'
                        cell3.addEventListener("click", function() {
                            //get new value
                            let newLangName= cell.value
                            let newLangCountry = cell1.value
                            editLanguage(someLang.languageId, newLangName, newLangCountry);
                        });

                        newTd3.appendChild(cell3)
                        newRow.appendChild(newTd3)
                    }
                }
            }
        })

    req.send(JSON.stringify(null));
    event.preventDefault();
    }

    function addLanguage(languageName, languageCountry){
        let req = new XMLHttpRequest();
        req.open("GET", baseURL + addLanguageAPI + languageName + '/' + languageCountry, true);
        req.setRequestHeader("Content-type", "application/json");
        req.addEventListener("load", function () {
            if (req.status >=200 && req.status < 400) {
                let data = JSON.parse(req.response);
                if (data.results.length == 0) {
                    logIt('There was an error in inserting your language')
                }else {
                    logIt('Language successfully inserted')
                    //re-populates table with updated data
                    languagesTableBody.innerHTML = ''
                    populateLanguageTable();
                }
            }
        })
        req.send(JSON.stringify(null));
        event.preventDefault();
    }

    function deleteLanguage(languageID) {
        let req = new XMLHttpRequest();
        req.open("GET", baseURL + deleteLanguageAPI + languageID, true);
        req.setRequestHeader("Content-type", "application/json");
        req.addEventListener("load", function () {
            if (req.status >=200 && req.status < 400) {
                let data = JSON.parse(req.response);
                if (data.results.length == 0) {
                    logIt("Language couldn't be deleted :(")
                }else{
                    logIt('Language successfully deleted')
                    //re-populates table with updated data
                    languagesTableBody.innerHTML = ''
                    populateLanguageTable();
                }
            } else {
                logIt("OOPS! We've had a problem deleting that category.")
            }

        })
        req.send(JSON.stringify(null));
        event.preventDefault();
    }

    function editLanguage(languageId, newLangName, newLangCountry){
        let input = {languageId: languageId, languageName: newLangName, languageCountry: newLangCountry}
        let req = new XMLHttpRequest();
        req.open("POST", baseURL + editLanguageAPI, true);
        req.setRequestHeader("Content-type", "application/json");
        req.addEventListener('load', function(){
            if (req.status >=200 && req.status < 400) {
                let data = JSON.parse(req.response);
                if (data.results.length == 0) {
                    logIt("We weren't able to edit that language!")
                }else{
                    logIt('Language successfully edited')
                    //re-populates table with updated data
                    languagesTableBody.innerHTML = ''
                    populateLanguageTable();
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
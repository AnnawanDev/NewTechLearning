define (['module'], function (module){
    const useLogging = module.config().useLogging;
    const baseURL = module.config().baseURL;
    const getLanguagesAPI = module.config().getLanguagesAPI;
    const addLanguageAPI = module.config().addLanguageAPI;
    const languagesTableBody = document.getElementById('langAdminTableBody');

    populateLanguageTable();
    let addLanguageButton = document.getElementById('addLanguageButton');
    addLanguageButton.addEventListener('click', function(){
        let langNameInput = document.getElementById('languageNameInput').value
        let langCountryInput = document.getElementById('languageCountryInput').value
        addLanguage(langNameInput,langCountryInput)
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

                        let newRow = languagesTableBody.insertRow(-1);
                        let cell1 = newRow.insertCell(0);
                        cell1.innerHTML = someLang.languageName
                        let cell2 = newRow.insertCell(1);
                        cell2.innerHTML = someLang.languageCountry
                        //  cell2 is a button with click listener that calls deleteCategoryAPI onClick
                        var cell3 = document.createElement('input')
                        cell3.type="button";
                        cell3.value = "delete"
                        cell3.name= 'delete'
                        cell3.addEventListener("click", function() {
                            deleteLanguage(someLang.languageId);
                        });
                        newRow.appendChild(cell3)
            
                        // cell3 - UPDATE
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
                logIt(data)
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
        //will implementLater
    }

    function logIt(someMessage) {
        if (useLogging) {
            console.log(someMessage);
        }
    }

})
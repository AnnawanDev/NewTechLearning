/*
   CS 340 Final Project: New Tech Learning
   Nora Marji
   Ed Wied
   February 23, 2021
*/


define(['module'], function(module){

    const useLogging = module.config().useLogging;
    const baseURL = module.config().baseURL;   
    const getCategoriesAPI = module.config().getCategoriesAPI;
    const deleteCategoryAPI = module.config().deleteCategoryAPI;
    const addCategoryAPI = module.config().addCategoryAPI;
    const editCategoryAPI = module.config().editCategoryAPI;
    let categoriesTableBody = document.getElementById('catAdminTableBody');


    populateCategoriesTable();
    let addCategoryButton = document.getElementById('addCategoryButton');
    addCategoryButton.addEventListener('click', function(){
        let categoryInput = document.getElementById('categoryNameInput').value
        if(categoryInput){
            addCategory(categoryInput)
        }
    })


    //calls AddCategoryAPI to insert a category into the table
    function addCategory(categoryName){
        let req = new XMLHttpRequest();
        req.open("GET", baseURL + addCategoryAPI + categoryName, true);
        req.setRequestHeader("Content-type", "application/json");
        req.addEventListener("load", function () {
            if (req.status >=200 && req.status < 400) {
                let data = JSON.parse(req.response);
                if (data.results.length == 0) {
                    logIt('there was an error in inserting your category')
                }else {
                    logIt('Category successfully inserted')
                    //re-populates table with updated data
                    categoriesTableBody.innerHTML = ''
                    populateCategoriesTable();
                }
            }
        })
        req.send(JSON.stringify(null));
        event.preventDefault();
    }
    
  

    //calls API to populate admin categories table from database
    function populateCategoriesTable(){

        let req = new XMLHttpRequest();
        req.open("GET", baseURL + getCategoriesAPI, true);
        console.log(baseURL+getCategoriesAPI )
        req.setRequestHeader("Content-type", "application/json");
        req.addEventListener("load", function () {
            if (req.status >=200 && req.status < 400) {
                let data = JSON.parse(req.response);
                console.log(data)
                if (data.results.length == 0) {
                } else {
                    for (let someCategory of data.results) {    
                        //add category name column
                        let newRow = categoriesTableBody.insertRow(-1);
                        let newTd1 = document.createElement('td')
                        let cell1 =document.createElement('input')
                        cell1.value = someCategory.categoryName
                        newTd1.appendChild(cell1)
                        newRow.appendChild(newTd1)

                        // cell2 is a button with click listener that calls deleteCategoryAPI onClick
                        let newTd2 = document.createElement('td')
                        let cell2 = document.createElement('input')
                        cell2.type="button";
                        cell2.value = "delete"
                        cell2.name= 'delete'
                        cell2.addEventListener("click", function() {
                            deleteCategory(someCategory.categoryId);
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
                            let newCatName= cell1.value
                            editCategory(someCategory.categoryId, newCatName);
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
    
    //calls delete category API to delete from DB 
    function deleteCategory(categoryId){
        let req = new XMLHttpRequest();
        req.open("GET", baseURL + deleteCategoryAPI + categoryId, true);
        req.setRequestHeader("Content-type", "application/json");
        req.addEventListener("load", function () {
            if (req.status >=200 && req.status < 400) {
                let data = JSON.parse(req.response);
                if (data.results.length == 0) {
                    logIt("We weren't able to delete that category!")
                }else{
                    logIt('Category successfully deleted')
                    //re-populates table with updated data
                    categoriesTableBody.innerHTML = ''
                    populateCategoriesTable();
                }
            } else {
                logIt("OOPS! We've had a problem deleting that category.")
            }

        })
        req.send(JSON.stringify(null));
        event.preventDefault();
    }
    
    //TO DO: calls api to edit
    function editCategory(categoryId, newCatName){
        let input = {categoryId: categoryId, categoryName: newCatName}
        let req = new XMLHttpRequest();
        req.open("POST", baseURL + editCategoryAPI, true);
        req.setRequestHeader("Content-type", "application/json");
        req.addEventListener('load', function(){
            if (req.status >=200 && req.status < 400) {
                let data = JSON.parse(req.response);
                if (data.results.length == 0) {
                    logIt("We weren't able to edit that category!")
                }else{
                    logIt('Category successfully edited')
                    //re-populates table with updated data
                    categoriesTableBody.innerHTML = ''
                    populateCategoriesTable();
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

});


  

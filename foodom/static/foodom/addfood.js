//Perform when submit button is clicked
document.querySelector('form').onsubmit = () => {
    //Look for food in API
    if (document.querySelector('#calories-place').style.display === 'none') {
        let str = replaceAll(document.querySelector('#name').value, ' ', '%20');
        fetch(`https://api.nal.usda.gov/fdc/v1/foods/search?query=${str}&api_key=PPe9i8UbOdGTx9mafVS2S6MHGLn789lohVQogWFK`)
            .then(response => response.json())
            .then(foods => {
                //Take one specific food Id and get the information
                fetch(`https://api.nal.usda.gov/fdc/v1/food/${foods.foods[0].fdcId}?api_key=PPe9i8UbOdGTx9mafVS2S6MHGLn789lohVQogWFK`)
                    .then(response => response.json())
                    .then(food => {
                        fetch(`/addfood`, {
                            method: 'POST',
                            body: JSON.stringify({
                                name: document.querySelector('#name').value,
                                category: document.querySelector('#category').value,
                                calories: parseInt(food.labelNutrients.calories.value, 10) * parseInt(document.querySelector("#servings").value, 10)
                            })
                        })
                        document.querySelector('.alert').style.display = 'block';
                    })
            })
            //Show the new popup if the food name cannot be found in the database
            .catch(err => {
                document.querySelector("#calories").required = true;
                document.querySelector('#calories-place').style.display = 'block';
            })
    } else {
        //If calories are manually entered, pass them
        fetch(`/addfood`, {
            method: 'POST',
            body: JSON.stringify({
                name: document.querySelector('#name').value,
                category: document.querySelector('#category').value,
                calories: parseInt(document.querySelector('#calories').value, 10),
            })
        })
        document.querySelector('.alert').style.display = 'block';
    }
    return false;
}

//Used to replace spaces with '%20'
function replaceAll(string, search, replace) {
    return string.split(search).join(replace);
}
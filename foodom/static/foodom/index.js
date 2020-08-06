let questions = {
    1: "What is your first name?",
    2: "What is your last name?",
    3: "What is your daily calorie limit?",
}
let count = Object.keys(questions).length;
document.addEventListener('DOMContentLoaded', () => evaluateView());

function evaluateView() {
    fetch('/info')
        .then(response => response.json())
        .then(user => {
            if (user.fname != "") {
                document.querySelector("#index-view").style.display = 'block';
                document.querySelector("#info-view").style.display = 'none';
                displayIndex();
                displayStats();
            } else {
                displayQuestion(1)
            }
        })
}

function displayQuestion(num) {
    let buttonContent = "Next";
    if (num === count) {
        buttonContent = "Submit";
    }

    let toggleBtn = document.createElement('button');
    toggleBtn.className += "btn btn-primary";
    toggleBtn.innerHTML = buttonContent;

    let item = document.createElement('div');
    item.style.display = 'block';
    item.style.textAlign = 'center';
    item.style.margin = 'auto';
    item.style.marginTop = '5%';    
    if (num != 3) {
        item.innerHTML =
            `
                <h5>${questions[num]}</h5>
                <input type="text" class="form-control" id=q${num.toString()} style="width: 40%;">
                <br>
                `;
        item.appendChild(toggleBtn);
    } else {
        item.innerHTML =
            `
                <h5>${questions[num]}</h5>
                <input type="number" class="form-control" id=q${num.toString()} style="width: 40%;">
                <br>
                <input type="submit" class="btn btn-primary" value="Submit">
                <br>
                `;
    }

    document.querySelector("#info-form").onsubmit = () => {
        fetch(`/info`, {
            method: 'PUT',
            body: JSON.stringify({
                fname: document.querySelector('#q1').value,
                lname: document.querySelector('#q2').value,
                cal_limit: document.querySelector('#q3').value,
            })
        })
            .then(() => {
                document.querySelector("#index-view").style.display = 'block';
                document.querySelector("#info-view").style.display = 'none';
                displayIndex();
                displayStats();
            })
        return false;
    }

    toggleBtn.onclick = () => fade(item, document.querySelector(`#q${num}`).value, num + 1);
    document.querySelector("#info-form").appendChild(item);
}

function fade(element, answer, num) {
    var op = 1;  // initial opacity
    var timer = setInterval(function () {
        if (op <= 0.1) {
            clearInterval(timer);
            element.style.display = 'none';
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op -= op * 0.1;
    }, 10);

    setTimeout(() => {
        if (num <= count) {
            displayQuestion(num);
        } else {
            window.location.replace("{% url 'index' %}");
        }
    }, 500);
    return false;
}

function displayIndex() {
    fetch('/info')
        .then(response => response.json())
        .then(user => {
            document.querySelector('h3').innerHTML = 'Welcome, ' + user.fname + '!';
        })
}

function displayStats() {
    fetch('/info')
        .then(response => response.json())
        .then(user => {
            fetch('/foods')
                .then(response => response.json())
                .then(meals => {
                    let cals = 0;
                    let b = 0, l = 0, d = 0, s = 0, f = 0, de = 0, dr = 0;
                    let bP = 0, lP = 0, dP = 0, sP = 0, fP = 0, deP = 0, drP = 0;
                    meals.forEach(meal => {
                        cals += meal.calories;
                        if (meal.category === 'Breakfast') {
                            b++;
                            bP += meal.calories;
                        } else if (meal.category === 'Lunch') {
                            l++;
                            lP += meal.calories;
                        } else if (meal.category === 'Dinner') {
                            d++;
                            dP += meal.calories;
                        } else if (meal.category === 'Fruit/Vegetable') {
                            f++;
                            fP += meal.calories;
                        } else if (meal.category === 'Dessert') {
                            de++;
                            deP += meal.calories;
                        } else if (meal.category === 'Drink') {
                            dr++;
                            drP += meal.calories;
                        } else {
                            s++;
                            sP += meal.calories;
                        }
                    })
                    let prog = cals + " out of " + user.cal_limit + " calories consumed";
                    document.querySelector('.progress-words').innerHTML = prog;
                    let perc = parseInt((cals / user.cal_limit) * 100, 10);
                    var cssAnimation = document.createElement('style');
                    cssAnimation.type = 'text/css';
                    let rules = document.createTextNode('@-webkit-keyframes increase {' +
                        '0% { width:0; }' +
                        `100% { width:${perc}%; }` +
                        '}');
                    if (perc >= 100) {
                        document.querySelector('.limit-warning').style.display = 'block';
                        document.querySelector('.progress-words').style.color = 'red';
                        rules = document.createTextNode('@-webkit-keyframes increase {' +
                            '0% { width:0; }' +
                            `100% { width:100%; background-color: red; }` +
                            '}');
                    }
                    cssAnimation.appendChild(rules);
                    document.getElementsByTagName("head")[0].appendChild(cssAnimation);

                    let limit = user.cal_limit;
                    let oPerc = ((user.cal_limit - cals) / user.cal_limit).toFixed(2);
                    if (cals > user.cal_limit) {
                        limit = cals;
                        oPerc = 0;
                    }

                    let bPerc = (bP / limit).toFixed(2);
                    let lPerc = (lP / limit).toFixed(2);
                    let dPerc = (dP / limit).toFixed(2);
                    let sPerc = (sP / limit).toFixed(2);
                    let fPerc = (fP / limit).toFixed(2);
                    let dePerc = (deP / limit).toFixed(2);
                    let drPerc = (drP / limit).toFixed(2);

                    var dataB = [{
                        values: [bPerc, lPerc, dPerc, sPerc, fPerc, dePerc, drPerc, oPerc],
                        labels: ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Fruit/Vegetable', 'Dessert', 'Drink', 'Remaining'],
                        type: 'pie'
                    }];

                    if (meals.length != 0) {
                        b = parseInt(100 * b / meals.length, 10);
                        l = parseInt(100 * l / meals.length, 10);
                        d = parseInt(100 * d / meals.length, 10);
                        f = parseInt(100 * f / meals.length, 10);
                        de = parseInt(100 * de / meals.length, 10);
                        dr = parseInt(100 * dr / meals.length, 10);
                    }

                    var data = [{
                        values: [b, l, d, s, f, de, dr],
                        labels: ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Fruit/Vegetable', 'Dessert', 'Drink'],
                        type: 'pie'
                    }];

                    var layout = {
                        paper_bgcolor: "black",
                        height: 400,
                        width: 400,
                    };

                    if (cals != 0) {
                        Plotly.newPlot('category-breakdown', dataB, layout);
                        Plotly.newPlot('meal-breakdown', data, layout);
                    } else {
                        document.querySelector('#category-breakdown').innerHTML = '<p style="color: darkorange; font-size: 20px; font-weight: 500">Add a meal first!</p><br><br><br>';
                        document.querySelector('#meal-breakdown').innerHTML = '<p style="color: darkorange; font-size: 20px; font-weight: 500">Add a meal first!</p>';
                    }
                })
        })
}

function removeFoods() {
    document.querySelectorAll('.food').forEach(meal => {
        meal.style.display = 'none';
    })
    fetch('/startnew')
        .then(() => {
            document.querySelector('.limit-warning').style.display = 'none';
            document.querySelector('.progress-words').style.color = 'rgb(177,177,177)';
            displayStats();
        })
}
# Foodometer
This app is a calorie counter that tracks all of the meals a user eats.

## How to start
When a user first enters the application, they are prompted to login if they are not logged in already. If they don't have an account, they can also register for an account.

## The home page
After registering, the user is asked three for three things: their first name, their last name, and their calorie limit. AFter that, the actual home page is loaded.

On the home page, the user can see all the meals they have eaten, which include the name, category, an icon, and the number of calories in that meal. The user can also see a
progress bar that shows how many calories the user has consumed out of the limit that they entered <br /> (e.g. "1200 out of 2000 calories"). 

With the help of the Plotly, the user can also see two pie charts: One that shows a breakdown of how many calories consumed based on category 
(e.g. 20% breakfast, 40% lunch, 40% remaining calories), and another one that shows a meal breakdown based on category (e.g. 20% of meals consumed have been part of breakfast).

## Add a meal
By clicking "Add Meal" in the top right, the user gets a form, where they can enter the name, servings eaten, and category of a food they have eaten. However, if the API (USDA API)
cannot find the food, the user will have the opportunity of entering the approximate calories they have consumed. <br /> 

The categories that a user can enter are:
* Breakfast
* Lunch
* Dinner
* Snack
* Fruit/Vegetable
* Drink
* Dessert

## Start new day
In the home page, there is a button called "Start New Day", which, upon clicking, clears all of the meals in the user's database.

## Have fun using this!

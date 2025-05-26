// @ts-check

/** @import {RecipeCard, RecipeData} from "./RecipeCard" */

// main.js

// CONSTANTS
export const RECIPE_URLS = [
  "https://adarsh249.github.io/Lab8-Starter/recipes/1_50-thanksgiving-side-dishes.json",
  "https://adarsh249.github.io/Lab8-Starter/recipes/2_roasting-turkey-breast-with-stuffing.json",
  "https://adarsh249.github.io/Lab8-Starter/recipes/3_moms-cornbread-stuffing.json",
  "https://adarsh249.github.io/Lab8-Starter/recipes/4_50-indulgent-thanksgiving-side-dishes-for-any-holiday-gathering.json",
  "https://adarsh249.github.io/Lab8-Starter/recipes/5_healthy-thanksgiving-recipe-crockpot-turkey-breast.json",
  "https://adarsh249.github.io/Lab8-Starter/recipes/6_one-pot-thanksgiving-dinner.json",
];

// Run the init() function when the page has loaded
window.addEventListener("DOMContentLoaded", init);

// Starts the program, all function calls trace back here
async function init() {
  // initialize ServiceWorker
  initializeServiceWorker();
  // Get the recipes from localStorage
  /** @type {RecipeData[]} */ let recipes;
  try {
    recipes = await getRecipes();
  } catch (err) {
    console.error(err);
    return;
  }
  // Add each recipe to the <main> element
  addRecipesToDocument(recipes);
}

/**
 * Detects if there's a service worker, then loads it and begins the process
 * of installing it and getting it running
 */
function initializeServiceWorker() {
  // EXPLORE - START (All explore numbers start with B)
  /*******************/
  // ServiceWorkers have many uses, the most common of which is to manage
  // local caches, intercept network requests, and conditionally serve from
  // those local caches. This increases performance since users aren't
  // re-downloading the same resources every single page visit. This also allows
  // websites to have some (if not all) functionality offline! I highly
  // recommend reading up on ServiceWorkers on MDN before continuing.
  /*******************/
  // We first must register our ServiceWorker here before any of the code in
  // sw.js is executed.
  // B1. TODO - Check if 'serviceWorker' is supported in the current browser
  if (!("serviceWorker" in navigator)) {
    alert("Service workers are not supported in your browser!");
    return;
  }

  // B2. TODO - Listen for the 'load' event on the window object.
  window.addEventListener("load", () => {
    // Steps B3-B6 will be *inside* the event listener's function created in B2
    // B3. TODO - Register './sw.js' as a service worker (The MDN article
    //            "Using Service Workers" will help you here)
    navigator.serviceWorker
      .register("sw.js")
      .then((reg) =>
        // B4. TODO - Once the service worker has been successfully registered, console
        //            log that it was successful.
        console.log("Service worker registered with scope:", reg.scope)
      )
      .catch((err) =>
        // B5. TODO - In the event that the service worker registration fails, console
        //            log that it has failed.
        console.log("Service worker registration failed:", err)
      );
  });
}

/**
 * Reads 'recipes' from localStorage and returns an array of
 * all of the recipes found (parsed, not in string form). If
 * nothing is found in localStorage, network requests are made to all
 * of the URLs in RECIPE_URLs, an array is made from those recipes, that
 * array is saved to localStorage, and then the array is returned.
 * @returns {Promise<RecipeData[]>} An array of recipes found in localStorage
 */
async function getRecipes() {
  // EXPOSE - START (All expose numbers start with A)
  // A1. TODO - Check local storage to see if there are any recipes.
  //            If there are recipes, return them.
  let localRecipesRepr = localStorage.getItem("recipes");
  if (localRecipesRepr) {
    return JSON.parse(localRecipesRepr);
  }

  /**************************/
  // The rest of this method will be concerned with requesting the recipes
  // from the network

  // One could also simply do:
  // return (
  //   await Promise.all(
  //     RECIPE_URLS.map(
  //       /** @returns {Promise<RecipeData | null>} */
  //       async (url) => {
  //         const response = await fetch(url);
  //         if (response.ok) {
  //           const json = await response.json();
  //           return json;
  //         }
  //         return null;
  //       }
  //     )
  //   )
  // ).filter((recipe) => recipe != null);

  // A2. TODO - Create an empty array to hold the recipes that you will fetch
  const recipes = [];

  // A3. TODO - Return a new Promise. If you are unfamiliar with promises, MDN
  //            has a great article on them. A promise takes one parameter - A
  //            function (we call these callback functions). That function will
  //            take two parameters - resolve, and reject. These are functions
  //            you can call to either resolve the Promise or Reject it.
  /**************************/
  return new Promise((resolve, reject) => {
    // A4-A11 will all be *inside* the callback function we passed to the Promise
    // we're returning
    /**************************/

    (async () => {
      await Promise.all(
        // A4. TODO - Loop through each recipe in the RECIPE_URLS array constant
        //            declared above
        RECIPE_URLS.map(async (url) => {
          // A5. TODO - Since we are going to be dealing with asynchronous code, create
          //            a try / catch block. A6-A9 will be in the try portion, A10-A11
          //            will be in the catch portion.
          try {
            // A6. TODO - For each URL in that array, fetch the URL - MDN also has a great
            //            article on fetch(). NOTE: Fetches are ASYNCHRONOUS, meaning that
            //            you must either use "await fetch(...)" or "fetch.then(...)". This
            //            function is using the async keyword so we recommend "await"
            const response = await fetch(url);

            // A7. TODO - For each fetch response, retrieve the JSON from it using .json().
            //            NOTE: .json() is ALSO asynchronous, so you will need to use
            //            "await" again
            /** @type {RecipeData} */
            const json = await response.json();

            // A8. TODO - Add the new recipe to the recipes array
            recipes.push(json);
          } catch (e) {
            // A10. TODO - Log any errors from catch using console.error
            // avoiding `console.error()` manually
            console.log(e);
            // A11. TODO - Pass any errors to the Promise's reject() function
            reject(e);
          }
        })
      );

      // A9. TODO - Check to see if you have finished retrieving all of the recipes,
      //            if you have, then save the recipes to storage using the function
      //            we have provided. Then, pass the recipes array to the Promise's
      //            resolve() method.
      resolve(recipes);
    })();
  });
}

/**
 * Takes in an array of recipes, converts it to a string, and then
 * saves that string to 'recipes' in localStorage
 * @param {Array<RecipeData>} recipes An array of recipes
 */
function saveRecipesToStorage(recipes) {
  localStorage.setItem("recipes", JSON.stringify(recipes));
}

/**
 * Takes in an array of recipes and for each recipe creates a
 * new <recipe-card> element, adds the recipe data to that card
 * using element.data = {...}, and then appends that new recipe
 * to <main>
 * @param {RecipeData[]} recipes An array of recipes
 */
function addRecipesToDocument(recipes) {
  if (!recipes) return;
  let main = document.querySelector("main");
  if (!main) return;
  recipes.forEach((recipe) => {
    /** @type { RecipeCard } */ // @ts-ignore
    let recipeCard = document.createElement("recipe-card");
    recipeCard.data = recipe;
    main.append(recipeCard);
  });
}

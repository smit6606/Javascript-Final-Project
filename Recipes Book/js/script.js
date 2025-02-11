let recipes = JSON.parse(localStorage.getItem("recipes")) || [];
let editingRecipeId = null;

// Add Recipe
document.getElementById("add-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const title = document.getElementById("title").value.trim();
  const ingredients = document.getElementById("ingredients").value.trim();
  const instructions = document.getElementById("instructions").value.trim();
  const cuisine = document.getElementById("cuisine").value.trim();

  if (!title || !ingredients) {
    alert("Title and Ingredients are required!");
    return;
  }

  const recipe = {
    id: Date.now(),
    title,
    ingredients,
    instructions,
    cuisine,
  };

  recipes.push(recipe);
  localStorage.setItem("recipes", JSON.stringify(recipes));
  displayRecipes();

  this.reset();
});

// Display Recipes
function displayRecipes(filteredRecipes = null) {
  const recipeList = document.getElementById("recipe-list");
  recipeList.innerHTML = "";

  const list = filteredRecipes || recipes;

  if (list.length === 0) {
    recipeList.innerHTML = `<p class="text-center">No recipes found!</p>`;
    return;
  }

  list.forEach((recipe) => {
    const card = document.createElement("div");
    card.className = "col-md-6";
    card.innerHTML = `
      <div class="card mb-3 shadow-sm">
        <div class="card-body">
          <h5 class="card-title">${recipe.title}</h5>
          <p class="card-text"><strong>Ingredients:</strong> ${recipe.ingredients}</p>
          <p class="card-text"><strong>Instructions:</strong> ${recipe.instructions}</p>
          <p class="card-text"><strong>Cuisine:</strong> ${recipe.cuisine}</p>
          <div class="btn-group">
            <button class="btn btn-warning btn-sm" onclick="editRecipe(${recipe.id})">Edit</button>
            <button class="btn btn-danger btn-sm" onclick="deleteRecipe(${recipe.id})">Delete</button>
          </div>
        </div>
      </div>
    `;
    recipeList.appendChild(card);
  });
}

// Edit Recipe
function editRecipe(id) {
  const recipe = recipes.find((r) => r.id === id);
  if (recipe) {
    editingRecipeId = id;
    document.getElementById("edit-title").value = recipe.title;
    document.getElementById("edit-ingredients").value = recipe.ingredients;
    document.getElementById("edit-instructions").value = recipe.instructions;
    document.getElementById("edit-cuisine").value = recipe.cuisine;

    document.getElementById("add-form").style.display = "none";
    document.getElementById("edit-form").style.display = "block";
  }
}

// Save Edited Recipe
document.getElementById("edit-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const title = document.getElementById("edit-title").value.trim();
  const ingredients = document.getElementById("edit-ingredients").value.trim();
  const instructions = document
    .getElementById("edit-instructions")
    .value.trim();
  const cuisine = document.getElementById("edit-cuisine").value.trim();

  if (!title || !ingredients) {
    alert("Title and Ingredients are required!");
    return;
  }

  const recipeIndex = recipes.findIndex((r) => r.id === editingRecipeId);
  if (recipeIndex !== -1) {
    recipes[recipeIndex] = {
      id: editingRecipeId,
      title,
      ingredients,
      instructions,
      cuisine,
    };
    localStorage.setItem("recipes", JSON.stringify(recipes));
    displayRecipes();
    cancelEdit();
  }
});

// Cancel Edit
document.getElementById("cancel-edit").addEventListener("click", cancelEdit);

function cancelEdit() {
  document.getElementById("add-form").style.display = "block";
  document.getElementById("edit-form").style.display = "none";
  editingRecipeId = null;
}

// Delete Recipe
function deleteRecipe(id) {
  if (confirm("Are you sure you want to delete this recipe?")) {
    recipes = recipes.filter((r) => r.id !== id);
    localStorage.setItem("recipes", JSON.stringify(recipes));
    displayRecipes();
  }
}

// Search Recipes
document.getElementById("search-input").addEventListener("input", function () {
  const query = this.value.toLowerCase();
  const filteredRecipes = recipes.filter(
    (recipe) =>
      recipe.title.toLowerCase().includes(query) ||
      recipe.ingredients.toLowerCase().includes(query)
  );
  displayRecipes(filteredRecipes);
});

// Show/Hide Recipes
document.getElementById("show-recipes").addEventListener("click", function () {
  const recipeList = document.getElementById("recipe-list");
  const addForm = document.getElementById("add-form");
  const editForm = document.getElementById("edit-form");

  if (recipeList.style.display === "none" || recipeList.innerHTML === "") {
    let savedRecipes = JSON.parse(localStorage.getItem("recipes")) || [];
    if (savedRecipes.length === 0) {
      alert("No recipes available. Add a new recipe first!");
      return;
    }
    recipeList.style.display = "flex";
    addForm.style.display = "none";
    editForm.style.display = "none";
    displayRecipes();
  } else {
    recipeList.style.display = "none";
    addForm.style.display = "block";
  }
});

// Load Recipes on Page Load
window.onload = function () {
  displayRecipes();
};

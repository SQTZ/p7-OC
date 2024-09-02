document.addEventListener('DOMContentLoaded', () => {
    const recipeList = document.getElementById('recipe-list');
    const ingredientSelectButton = document.getElementById('ingredient-selected');
    const appareilSelectButton = document.getElementById('appareil-selected');
    const ustensileSelectButton = document.getElementById('ustensile-selected');

    const ingredientOptions = document.getElementById('ingredient-options');
    const appareilOptions = document.getElementById('appareil-options');
    const ustensileOptions = document.getElementById('ustensile-options');

    const ingredientSearch = ingredientOptions.querySelector('input[type="text"]');
    const appareilSearch = appareilOptions.querySelector('input[type="text"]');
    const ustensileSearch = ustensileOptions.querySelector('input[type="text"]');

    const filterContainer = document.getElementById('filter-container');
    const recipeCount = document.getElementById('recipe-count');

    const selectedFilters = {
        ingredients: [],
        appareils: [],
        ustensiles: [],
    };

    const createFilterTag = (type, value) => {
        const filterTag = document.createElement('div');
        filterTag.className = 'bg-primary text-black px-5 py-4 rounded-xl flex items-center mt-5';

        const filterText = document.createElement('span');
        filterText.textContent = value;

        const closeButton = document.createElement('button');
        closeButton.className = 'ml-10';
        closeButton.innerHTML = '&times;';

        closeButton.addEventListener('click', () => {
            selectedFilters[type] = selectedFilters[type].filter(item => item !== value.toLowerCase());
            filterContainer.removeChild(filterTag);
            filterRecipes();
        });

        filterTag.appendChild(filterText);
        filterTag.appendChild(closeButton);
        filterContainer.appendChild(filterTag);
    };

    ingredientSelectButton.parentElement.addEventListener('click', () => {
        ingredientOptions.classList.toggle('hidden');
    });

    appareilSelectButton.parentElement.addEventListener('click', () => {
        appareilOptions.classList.toggle('hidden');
    });

    ustensileSelectButton.parentElement.addEventListener('click', () => {
        ustensileOptions.classList.toggle('hidden');
    });

    const filterList = (searchInput, listItems) => {
        const filterText = searchInput.value.toLowerCase();
        listItems.forEach(item => {
            if (item.textContent.toLowerCase().includes(filterText)) {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        });
    };

    const populateSelects = (recipes) => {
        const ingredientsSet = new Set();
        const appliancesSet = new Set();
        const utensilsSet = new Set();

        recipes.forEach(recipe => {
            if (Array.isArray(recipe.ingredients)) {
                recipe.ingredients.forEach(ingredient => ingredientsSet.add(ingredient.ingredient.toLowerCase()));
            }

            if (recipe.appliance) { // Modification ici
                appliancesSet.add(recipe.appliance.toLowerCase());
            }

            if (Array.isArray(recipe.ustensils)) {
                recipe.ustensils.forEach(utensil => utensilsSet.add(utensil.toLowerCase()));
            }
        });

        const addItemsToList = (set, container, type) => {
            const listItems = [];
            set.forEach(item => {
                const li = document.createElement('li');
                li.className = 'p-2 hover:bg-gray-100 cursor-pointer';
                li.textContent = item.charAt(0).toUpperCase() + item.slice(1);
                li.addEventListener('click', () => {
                    if (!selectedFilters[type].includes(item)) {
                        selectedFilters[type].push(item);
                        createFilterTag(type, item.charAt(0).toUpperCase() + item.slice(1));
                    }
                    container.parentElement.classList.add('hidden');
                    filterRecipes();
                });
                container.appendChild(li);
                listItems.push(li);
            });
            return listItems;
        };

        const ingredientListItems = addItemsToList(ingredientsSet, ingredientOptions.querySelector('ul'), 'ingredients');
        const appareilListItems = addItemsToList(appliancesSet, appareilOptions.querySelector('ul'), 'appareils');
        const ustensileListItems = addItemsToList(utensilsSet, ustensileOptions.querySelector('ul'), 'ustensiles');

        ingredientSearch.addEventListener('input', () => filterList(ingredientSearch, ingredientListItems));
        appareilSearch.addEventListener('input', () => filterList(appareilSearch, appareilListItems));
        ustensileSearch.addEventListener('input', () => filterList(ustensileSearch, ustensileListItems));
    };

    const filterRecipes = () => {
        const filteredRecipes = recipes.filter(recipe => {
            const hasIngredient = selectedFilters.ingredients.length
                ? selectedFilters.ingredients.every(selectedIngredient => recipe.ingredients.some(ingredient => ingredient.ingredient.toLowerCase().includes(selectedIngredient)))
                : true;

            const hasAppareil = selectedFilters.appareils.length
                ? selectedFilters.appareils.every(selectedAppareil => recipe.appliance.toLowerCase() === selectedAppareil)
                : true;

            const hasUstensile = selectedFilters.ustensiles.length
                ? selectedFilters.ustensiles.every(selectedUstensile => recipe.ustensils.some(utensil => utensil.toLowerCase() === selectedUstensile))
                : true;

            return hasIngredient && hasAppareil && hasUstensile;
        });

        displayRecipes(filteredRecipes);
    };

    const displayRecipes = (filteredRecipes) => {
        recipeList.innerHTML = '';

        const recipeCards = filteredRecipes.map(recipe => {
            let ingredientsHTML = '<div class="grid grid-cols-2 gap-2 mt-4 ingredients">';
            if (Array.isArray(recipe.ingredients)) {
                recipe.ingredients.forEach(ingredient => {
                    ingredientsHTML += `
                        <div class="mb-2">
                            <p class="">${ingredient.ingredient}</p>
                            <span class="text-subtitle">${ingredient.quantity} ${ingredient.unit || ''}</span>
                        </div>
                    `;
                });
            }
            ingredientsHTML += '</div>';

            return `
                <div class="bg-white rounded-2xl shadow-lg overflow-hidden relative recipe-card">
                    <img src="./assets/pictures/${recipe.image}" alt="${recipe.name}" class="w-full h-64 object-cover">
                    <div class="p-6">
                        <h3 class="text-xl font-semibold">${recipe.name}</h3>
                        <h4 class="text-subtitle font-bold tracking-wide">Recette</h4>
                        <p class="desc">${recipe.description}</p>
                        <h4 class="text-subtitle font-bold tracking-wide">Ingrédients</h4>
                        ${ingredientsHTML}
                    </div>
                    <p class="bg-primary text-xs font-light py-1 px-3 rounded-full absolute top-4 right-4">${recipe.time}min</p>
                </div>
            `;
        });

        recipeCards.forEach(recipeCardHTML => {
            const recipeCardElement = document.createElement('div');
            recipeCardElement.innerHTML = recipeCardHTML;
            recipeList.appendChild(recipeCardElement);
        });

        recipeCount.textContent = `${filteredRecipes.length} recettes`;
    };

    populateSelects(recipes);
    displayRecipes(recipes);
});

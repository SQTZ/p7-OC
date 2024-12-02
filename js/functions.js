document.addEventListener('DOMContentLoaded', () => {
    // Éléments du DOM
    const recipeList = document.getElementById('recipe-list');
    const mainSearchBar = document.querySelector('.searchbar input');
    const recipeCount = document.getElementById('recipe-count');
    const filterContainer = document.getElementById('filter-container');

    // Éléments des filtres
    const ingredientButton = document.getElementById('ingredient-selected');
    const appareilButton = document.getElementById('appareil-selected');
    const ustensileButton = document.getElementById('ustensile-selected');

    const ingredientOptions = document.getElementById('ingredient-options');
    const appareilOptions = document.getElementById('appareil-options');
    const ustensileOptions = document.getElementById('ustensile-options');

    // Champs de recherche des filtres
    const ingredientSearch = ingredientOptions.querySelector('input');
    const appareilSearch = appareilOptions.querySelector('input');
    const ustensileSearch = ustensileOptions.querySelector('input');

    // État des filtres sélectionnés
    const selectedFilters = {
        ingredients: [],
        appareils: [],
        ustensiles: []
    };

    // Gestion des dropdowns
    const toggleDropdown = (button, options) => {
        options.classList.toggle('hidden');
        const allOptions = [ingredientOptions, appareilOptions, ustensileOptions];
        for (let i = 0; i < allOptions.length; i++) {
            if (allOptions[i] !== options) {
                allOptions[i].classList.add('hidden');
            }
        }
    };

    // Événements des boutons de filtre
    ingredientButton.parentElement.addEventListener('click', () => toggleDropdown(ingredientButton, ingredientOptions));
    appareilButton.parentElement.addEventListener('click', () => toggleDropdown(appareilButton, appareilOptions));
    ustensileButton.parentElement.addEventListener('click', () => toggleDropdown(ustensileButton, ustensileOptions));

    // Fonction pour remplir les listes de filtres
    const populateFilters = (recipes) => {
        const ingredients = new Set(); // Pour stocker que les éléments uniques
        const appareils = new Set();
        const ustensiles = new Set();

        for (let i = 0; i < recipes.length; i++) {
            const recipe = recipes[i];
            // Collecter les ingrédients
            for (let j = 0; j < recipe.ingredients.length; j++) {
                ingredients.add(recipe.ingredients[j].ingredient.toLowerCase());
            }
            // Collecter les appareils
            if (recipe.appliance) {
                appareils.add(recipe.appliance.toLowerCase());
            }
            // Collecter les ustensiles
            for (let j = 0; j < recipe.ustensils.length; j++) {
                ustensiles.add(recipe.ustensils[j].toLowerCase());
            }
        }

        // Fonction pour créer les éléments de liste
        const createFilterList = (items, container, type) => {
            const ul = container.querySelector('ul');
            ul.innerHTML = '';
            const itemsArray = Array.from(items);
            for (let i = 0; i < itemsArray.length; i++) {
                const item = itemsArray[i];
                const li = document.createElement('li');
                li.className = 'py-2 px-4 hover:bg-primary cursor-pointer flex justify-between items-center';
                
                // Ajouter le texte
                const textSpan = document.createElement('span');
                textSpan.textContent = item.charAt(0).toUpperCase() + item.slice(1);
                li.appendChild(textSpan);
                
                // Ajouter la croix si l'élément est sélectionné
                if (selectedFilters[type].indexOf(item) !== -1) {
                    li.classList.add('bg-primary');
                    const crossIcon = document.createElement('span');
                    crossIcon.className = 'cross-icon cursor-pointer text-gray-400';
                    crossIcon.innerHTML = '&times;';
                    li.appendChild(crossIcon);

                    crossIcon.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const index = selectedFilters[type].indexOf(item);
                        if (index !== -1) {
                            selectedFilters[type].splice(index, 1);
                        }
                        li.classList.remove('bg-primary');
                        crossIcon.remove();
                        removeFilterTag(type, item);
                        updateResults();
                    });
                }

                li.addEventListener('click', () => toggleFilter(item, type, li));
                ul.appendChild(li);
            }
        };

        createFilterList(ingredients, ingredientOptions, 'ingredients');
        createFilterList(appareils, appareilOptions, 'appareils');
        createFilterList(ustensiles, ustensileOptions, 'ustensiles');
    };

    // Fonction pour créer un tag de filtre
    const createFilterTag = (value, type) => {
        const tag = document.createElement('div');
        tag.className = 'bg-primary text-black px-5 py-3 rounded-xl flex items-center gap-3';
        tag.innerHTML = `
            <span>${value}</span>
            <button class="text-gray-500">&times;</button>
        `;

        tag.querySelector('button').addEventListener('click', () => {
            filterContainer.removeChild(tag);
            const index = selectedFilters[type].indexOf(value.toLowerCase());
            if (index !== -1) {
                selectedFilters[type].splice(index, 1);
            }
            updateResults();
        });

        filterContainer.appendChild(tag);
    };

    // Fonction pour gérer la sélection/déselection des filtres
    const toggleFilter = (value, type, element) => {
        const lowercaseValue = value.toLowerCase();
        const index = selectedFilters[type].indexOf(lowercaseValue);

        if (index === -1) {
            // Ajouter le filtre
            selectedFilters[type].push(lowercaseValue);
            element.classList.add('bg-primary');
            
            // Ajouter la croix
            const crossIcon = document.createElement('span');
            crossIcon.className = 'cross-icon cursor-pointer text-gray-400';
            crossIcon.innerHTML = '&times;';
            element.appendChild(crossIcon);

            crossIcon.addEventListener('click', (e) => {
                e.stopPropagation();
                const index = selectedFilters[type].indexOf(lowercaseValue);
                if (index !== -1) {
                    selectedFilters[type].splice(index, 1);
                }
                element.classList.remove('bg-primary');
                crossIcon.remove();
                removeFilterTag(type, value);
                updateResults();
            });

            createFilterTag(value, type);
        } else {
            // Retirer le filtre
            selectedFilters[type].splice(index, 1);
            element.classList.remove('bg-primary');
            const crossIcon = element.querySelector('.cross-icon');
            if (crossIcon) {
                crossIcon.remove();
            }
            removeFilterTag(type, value);
        }

        updateResults();
    };

    // Fonction de recherche dans les listes de filtres
    const filterList = (input, container) => {
        const items = container.querySelectorAll('li');
        const searchTerm = input.value.toLowerCase();

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const text = item.textContent.toLowerCase();
            item.style.display = text.includes(searchTerm) ? '' : 'none';
        }
    };

    // Événements de recherche dans les filtres
    ingredientSearch.addEventListener('input', () => filterList(ingredientSearch, ingredientOptions));
    appareilSearch.addEventListener('input', () => filterList(appareilSearch, appareilOptions));
    ustensileSearch.addEventListener('input', () => filterList(ustensileSearch, ustensileOptions));

    // Fonction de mise à jour des résultats
    const updateResults = () => {
        const query = mainSearchBar.value.trim().toLowerCase();
        let filteredRecipes = [];

        // Copier les recettes une seule fois
        for (let i = 0; i < recipes.length; i++) {
            filteredRecipes[i] = recipes[i];
        }

        // Filtre par recherche principale (si plus de 3 caractères)
        if (query.length >= 3) {
            const tempRecipes = [];
            let tempIndex = 0;
            
            for (let i = 0; i < filteredRecipes.length; i++) {
                const recipe = filteredRecipes[i];
                const matchTitle = recipe.name.toLowerCase().includes(query);
                const matchDescription = recipe.description.toLowerCase().includes(query);
                let matchIngredients = false;

                // Optimisation de la recherche d'ingrédients
                const ingredients = recipe.ingredients;
                for (let j = 0; j < ingredients.length && !matchIngredients; j++) {
                    if (ingredients[j].ingredient.toLowerCase().includes(query)) {
                        matchIngredients = true;
                    }
                }

                if (matchTitle || matchDescription || matchIngredients) {
                    tempRecipes[tempIndex++] = recipe;
                }
            }
            filteredRecipes = tempRecipes;
        }

        // Optimisation des filtres sélectionnés
        if (selectedFilters.ingredients.length > 0) {
            const tempRecipes = [];
            let tempIndex = 0;

            recipeLoop: for (let i = 0; i < filteredRecipes.length; i++) {
                const recipe = filteredRecipes[i];
                const recipeIngredients = recipe.ingredients;

                for (let j = 0; j < selectedFilters.ingredients.length; j++) {
                    const selectedIng = selectedFilters.ingredients[j];
                    let found = false;

                    for (let k = 0; k < recipeIngredients.length; k++) {
                        if (recipeIngredients[k].ingredient.toLowerCase().includes(selectedIng)) {
                            found = true;
                            break;
                        }
                    }

                    if (!found) {
                        continue recipeLoop;
                    }
                }
                tempRecipes[tempIndex++] = recipe;
            }
            filteredRecipes = tempRecipes;
        }

        if (selectedFilters.appareils.length > 0) {
            const tempRecipes = [];
            for (let i = 0; i < filteredRecipes.length; i++) {
                const recipe = filteredRecipes[i];
                let hasAppareil = true;

                for (let j = 0; j < selectedFilters.appareils.length; j++) {
                    if (recipe.appliance.toLowerCase() !== selectedFilters.appareils[j]) {
                        hasAppareil = false;
                        break;
                    }
                }

                if (hasAppareil) {
                    tempRecipes.push(recipe);
                }
            }
            filteredRecipes = tempRecipes;
        }

        if (selectedFilters.ustensiles.length > 0) {
            const tempRecipes = [];
            for (let i = 0; i < filteredRecipes.length; i++) {
                const recipe = filteredRecipes[i];
                let hasAllUstensils = true;

                for (let j = 0; j < selectedFilters.ustensiles.length; j++) {
                    const selectedUst = selectedFilters.ustensiles[j];
                    let hasUstensil = false;

                    for (let k = 0; k < recipe.ustensils.length; k++) {
                        if (recipe.ustensils[k].toLowerCase().includes(selectedUst)) {
                            hasUstensil = true;
                            break;
                        }
                    }

                    if (!hasUstensil) {
                        hasAllUstensils = false;
                        break;
                    }
                }

                if (hasAllUstensils) {
                    tempRecipes.push(recipe);
                }
            }
            filteredRecipes = tempRecipes;
        }

        // Vérifier si des filtres doivent être retirés car plus aucune recette ne les contient
        const availableIngredients = new Set();
        const availableAppareils = new Set();
        const availableUstensiles = new Set();

        // Collecter tous les éléments disponibles dans les recettes filtrées
        for (let i = 0; i < filteredRecipes.length; i++) {
            const recipe = filteredRecipes[i];
            
            // Ingrédients
            for (let j = 0; j < recipe.ingredients.length; j++) {
                availableIngredients.add(recipe.ingredients[j].ingredient.toLowerCase());
            }
            
            // Appareils
            if (recipe.appliance) {
                availableAppareils.add(recipe.appliance.toLowerCase());
            }
            
            // Ustensiles
            for (let j = 0; j < recipe.ustensils.length; j++) {
                availableUstensiles.add(recipe.ustensils[j].toLowerCase());
            }
        }

        // Retirer les filtres qui ne sont plus disponibles
        for (let i = selectedFilters.ingredients.length - 1; i >= 0; i--) {
            if (!availableIngredients.has(selectedFilters.ingredients[i])) {
                const removedIngredient = selectedFilters.ingredients[i];
                selectedFilters.ingredients.splice(i, 1);
                removeFilterTag('ingredients', removedIngredient);
            }
        }

        for (let i = selectedFilters.appareils.length - 1; i >= 0; i--) {
            if (!availableAppareils.has(selectedFilters.appareils[i])) {
                const removedAppareil = selectedFilters.appareils[i];
                selectedFilters.appareils.splice(i, 1);
                removeFilterTag('appareils', removedAppareil);
            }
        }

        for (let i = selectedFilters.ustensiles.length - 1; i >= 0; i--) {
            if (!availableUstensiles.has(selectedFilters.ustensiles[i])) {
                const removedUstensile = selectedFilters.ustensiles[i];
                selectedFilters.ustensiles.splice(i, 1);
                removeFilterTag('ustensiles', removedUstensile);
            }
        }

        // Afficher les résultats
        displayRecipes(filteredRecipes);
        populateFilters(filteredRecipes);

        // Message si aucun résultat
        if (filteredRecipes.length === 0) {
            const message = `Aucune recette ne correspond à vos critères.`;
            recipeList.innerHTML = `<h2 class="text-error">${message}</h2>`;
        }
    };

    // Fonction d'affichage des recettes
    const displayRecipes = (recipesToDisplay) => {
        let html = '';
        
        for (let i = 0; i < recipesToDisplay.length; i++) {
            const recipe = recipesToDisplay[i];
            let ingredientsHTML = '<div class="grid grid-cols-2 gap-2 mt-4 ingredients">';
            
            const ingredients = recipe.ingredients;
            for (let j = 0; j < ingredients.length; j++) {
                const ingredient = ingredients[j];
                ingredientsHTML += `
                    <div class="mb-2">
                        <p class="">${ingredient.ingredient}</p>
                        <span class="text-subtitle">${ingredient.quantity || ''} ${ingredient.unit || ''}</span>
                    </div>
                `;
            }
            ingredientsHTML += '</div>';

            html += `
                <div class="bg-white rounded-2xl shadow-lg overflow-hidden relative recipe-card">
                    <img src="./assets/pictures/${recipe.image}" 
                         alt="${recipe.name}" 
                         class="w-full h-64 object-cover"
                         loading="lazy">
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
        }

        recipeList.innerHTML = html;
        recipeCount.textContent = `${recipesToDisplay.length} recettes`;
    };

    // Initialisation
    displayRecipes(recipes);
    populateFilters(recipes);

    // Événement de recherche principale
    mainSearchBar.addEventListener('input', updateResults);

    // Fonction pour gérer les croix dans les champs de recherche
    const handleSearchInputs = () => {
        // Barre de recherche principale
        const mainSearchBar = document.querySelector('.searchbar input');
        const mainSearchCross = mainSearchBar.parentElement.querySelector('img[src="./assets/close.svg"]');
        
        mainSearchBar.addEventListener('input', () => {
            mainSearchCross.classList.toggle('hidden', !mainSearchBar.value);
        });

        mainSearchCross.addEventListener('click', () => {
            mainSearchBar.value = '';
            mainSearchCross.classList.add('hidden');
            updateResults();
        });

        // Barres de recherche des filtres
        const filterInputs = document.querySelectorAll('#ingredient-options input, #appareil-options input, #ustensile-options input');
        
        filterInputs.forEach(input => {
            const cross = input.parentElement.querySelector('img[src="./assets/close.svg"]');
            
            input.addEventListener('input', () => {
                cross.classList.toggle('hidden', !input.value);
            });

            cross.addEventListener('click', () => {
                input.value = '';
                cross.classList.add('hidden');
                
                // Récupérer tous les éléments de la liste associée
                const filterList = input.closest('.relative').nextElementSibling;
                const listItems = filterList.querySelectorAll('li');
                
                // Afficher tous les éléments de la liste
                listItems.forEach(item => {
                    item.style.display = '';
                });
                
                // Mettre à jour les résultats si nécessaire
                updateResults();
            });
        });
    };

    // Initialiser la gestion des croix
    handleSearchInputs();

    // Fonction pour supprimer un tag de filtre
    const removeFilterTag = (type, value) => {
        // Supprimer le tag
        const tags = filterContainer.querySelectorAll('div');
        for (let i = 0; i < tags.length; i++) {
            const tag = tags[i];
            if (tag.textContent.includes(value)) {
                filterContainer.removeChild(tag);
                break;
            }
        }

        // Mettre à jour l'apparence du bouton dans la liste des filtres
        let optionsContainer;
        switch(type) {
            case 'ingredients':
                optionsContainer = ingredientOptions;
                break;
            case 'appareils':
                optionsContainer = appareilOptions;
                break;
            case 'ustensiles':
                optionsContainer = ustensileOptions;
                break;
        }

        if (optionsContainer) {
            const listItems = optionsContainer.querySelectorAll('li');
            for (let i = 0; i < listItems.length; i++) {
                const li = listItems[i];
                if (li.textContent.toLowerCase().includes(value.toLowerCase())) {
                    li.classList.remove('bg-primary');
                    const crossIcon = li.querySelector('.cross-icon');
                    if (crossIcon) {
                        crossIcon.remove();
                    }
                    break;
                }
            }
        }
    };

    // Fonction pour ajouter une croix à un champ de recherche
    const addSearchCross = (input) => {
        const parentDiv = input.parentElement;
        const crossIcon = document.createElement('img');
        parentDiv.appendChild(crossIcon);

        // Ajouter l'icône de recherche
        const searchIcon = document.createElement('img');
        parentDiv.appendChild(searchIcon);

        input.addEventListener('input', () => {
            if (input.value.length > 0) {
                crossIcon.classList.remove('hidden');
            } else {
                crossIcon.classList.add('hidden');
            }
        });

        crossIcon.addEventListener('click', () => {
            input.value = '';
            crossIcon.classList.add('hidden');
            if (input === mainSearchBar) {
                updateResults();
            } else {
                filterList(input, input.closest('.filter-options'));
            }
        });
    };

    // Initialiser les croix dans toutes les barres de recherche
    addSearchCross(mainSearchBar);
    addSearchCross(ingredientSearch);
    addSearchCross(appareilSearch);
    addSearchCross(ustensileSearch);
});
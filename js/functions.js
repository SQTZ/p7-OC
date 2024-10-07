// Lorsque le DOM est entièrement chargé, le code suivant sera exécuté
document.addEventListener('DOMContentLoaded', () => {
    // Obtenir les éléments nécessaires du DOM
    const recipeList = document.getElementById('recipe-list');
    const mainSearchBar = document.querySelector('.searchbar input');
    const mainSearchButton = document.querySelector('.searchbar button');
    const mainSearchInput = document.getElementById('main-search');
    const clearMainSearch = document.getElementById('clear-main-search');

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

    // Lorsque l'entrée de la barre de recherche principale est modifiée, cette fonction sera exécutée
    mainSearchInput.addEventListener('input', () => {
        if (mainSearchInput.value) {
            clearMainSearch.classList.remove('hidden');
        } else {
            clearMainSearch.classList.add('hidden');
        }
    });


    // Lorsque le bouton de recherche principale est effacé, cette fonction sera exécutée
    clearMainSearch.addEventListener('click', () => {
        mainSearchInput.value = '';
        clearMainSearch.classList.add('hidden');
        filterRecipes();
    });

    // Cette fonction met à jour les résultats en fonction de la recherche principale et des filtres sélectionnés
    const updateResults = () => {
        const query = mainSearchInput.value.trim().toLowerCase();

        const filteredRecipes = [];
        for (let i = 0; i < recipes.length; i++) {
            const recipe = recipes[i];

            const matchTitle = recipe.name.toLowerCase().includes(query);
            const matchDescription = recipe.description.toLowerCase().includes(query);
            let matchIngredients = false;
            for (let j = 0; j < recipe.ingredients.length; j++) {
                if (recipe.ingredients[j].ingredient.toLowerCase().includes(query)) {
                    matchIngredients = true;
                    break;
                }
            }

            const matchesSearchBar = matchTitle || matchDescription || matchIngredients;


            let hasIngredient = true;
            if (selectedFilters.ingredients.length) {
                for (let j = 0; j < selectedFilters.ingredients.length; j++) {
                    const selectedIngredient = selectedFilters.ingredients[j];
                    let ingredientFound = false;
                    for (let k = 0; k < recipe.ingredients.length; k++) {
                        if (recipe.ingredients[k].ingredient.toLowerCase().includes(selectedIngredient)) {
                            ingredientFound = true;
                            break;
                        }
                    }
                    if (!ingredientFound) {
                        hasIngredient = false;
                        break;
                    }
                }
            }

            let hasAppareil = true;
            if (selectedFilters.appareils.length) {
                for (let j = 0; j < selectedFilters.appareils.length; j++) {
                    if (recipe.appliance.toLowerCase() !== selectedFilters.appareils[j]) {
                        hasAppareil = false;
                        break;
                    }
                }
            }

            let hasUstensile = true;
            if (selectedFilters.ustensiles.length) {
                for (let j = 0; j < selectedFilters.ustensiles.length; j++) {
                    const selectedUstensile = selectedFilters.ustensiles[j];
                    let utensilFound = false;
                    for (let k = 0; k < recipe.ustensils.length; k++) {
                        if (recipe.ustensils[k].toLowerCase().includes(selectedUstensile)) {
                            utensilFound = true;
                            break;
                        }
                    }
                    if (!utensilFound) {
                        hasUstensile = false;
                        break;
                    }
                }
            }


            if (matchesSearchBar && hasIngredient && hasAppareil && hasUstensile) {
                filteredRecipes.push(recipe);
            }
        }


        if (query.length < 3) {
            const filteredByFilters = [];
            for (let i = 0; i < recipes.length; i++) {
                const recipe = recipes[i];
                let hasIngredient = true;
                if (selectedFilters.ingredients.length) {
                    for (let j = 0; j < selectedFilters.ingredients.length; j++) {
                        const selectedIngredient = selectedFilters.ingredients[j];
                        let ingredientFound = false;
                        for (let k = 0; k < recipe.ingredients.length; k++) {
                            if (recipe.ingredients[k].ingredient.toLowerCase().includes(selectedIngredient)) {
                                ingredientFound = true;
                                break;
                            }
                        }
                        if (!ingredientFound) {
                            hasIngredient = false;
                            break;
                        }
                    }
                }

                let hasAppareil = true;
                if (selectedFilters.appareils.length) {
                    for (let j = 0; j < selectedFilters.appareils.length; j++) {
                        if (recipe.appliance.toLowerCase() !== selectedFilters.appareils[j]) {
                            hasAppareil = false;
                            break;
                        }
                    }
                }

                let hasUstensile = true;
                if (selectedFilters.ustensiles.length) {
                    for (let j = 0; j < selectedFilters.ustensiles.length; j++) {
                        const selectedUstensile = selectedFilters.ustensiles[j];
                        let utensilFound = false;
                        for (let k = 0; k < recipe.ustensils.length; k++) {
                            if (recipe.ustensils[k].toLowerCase().includes(selectedUstensile)) {
                                utensilFound = true;
                                break;
                            }
                        }
                        if (!utensilFound) {
                            hasUstensile = false;
                            break;
                        }
                    }
                }

                if (hasIngredient && hasAppareil && hasUstensile) {
                    filteredByFilters.push(recipe);
                }
            }

            displayRecipes(filteredByFilters);
            recipeCount.textContent = `${filteredByFilters.length} recettes`;
            return;
        }


        displayRecipes(filteredRecipes);
        populateSelects(filteredRecipes);


        recipeCount.textContent = `${filteredRecipes.length} recettes`;


        if (filteredRecipes.length === 0) {
            const message = `Aucune recette ne contient '${query}'. Vous pouvez chercher 'tarte aux pommes', 'poisson', etc.`;
            recipeList.innerHTML = `<h2 class="text-error">${message}</h2>`;
        } else {
            populateSelects(filteredRecipes);
        }
    };

    // Cette fonction filtre les recettes en fonction de la recherche principale et des filtres sélectionnés
    const filterRecipes = () => {
        updateResults();
    };

    // Cette fonction filtre la liste en fonction de l'entrée de recherche
    const filterList = (searchInput, listItems) => {
        const filterText = searchInput.value.toLowerCase();
        for (let i = 0; i < listItems.length; i++) {
            const item = listItems[i];
            if (item.textContent.toLowerCase().includes(filterText)) {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        }
    };

    // Cette fonction ajoute des écouteurs d'événements pour les filtres
    const addFilterListeners = () => {
        const filterInputs = [ingredientSearch, appareilSearch, ustensileSearch];
        for (let i = 0; i < filterInputs.length; i++) {
            const input = filterInputs[i];
            input.addEventListener('input', () => {

                if (input === ingredientSearch) {
                    filterList(ingredientSearch, ingredientOptions.querySelectorAll('ul li'));
                } else if (input === appareilSearch) {
                    filterList(appareilSearch, appareilOptions.querySelectorAll('ul li'));
                } else if (input === ustensileSearch) {
                    filterList(ustensileSearch, ustensileOptions.querySelectorAll('ul li'));
                }
            });
        }
    };


    // Lorsque l'entrée de la barre de recherche principale est modifiée, cette fonction sera exécutée
    mainSearchBar.addEventListener('input', updateResults);

    addFilterListeners();


    // Cette fonction ajoute un bouton pour effacer la recherche principale
    const addMainSearchClearButton = () => {
        const searchWrapper = mainSearchBar.parentElement;


        const clearButton = document.createElement('span');
        clearButton.classList.add('absolute', 'right-10', 'top-2', 'hidden', 'cursor-pointer', 'text-gray-400');
        clearButton.innerHTML = '&times;';
        searchWrapper.appendChild(clearButton);


        mainSearchBar.addEventListener('input', () => {
            if (mainSearchBar.value.length > 0) {
                clearButton.classList.remove('hidden');
            } else {
                clearButton.classList.add('hidden');
            }
        });


        clearButton.addEventListener('click', () => {
            mainSearchBar.value = '';
            clearButton.classList.add('hidden');
            displayRecipes(recipes);
        });
    };
    addMainSearchClearButton();


    // Cette fonction ajoute des icônes de recherche pour les filtres
    const addSearchIcons = (searchInput, clearButtonId) => {
        const searchWrapper = searchInput.parentElement;


        const clearButton = document.createElement('span');
        clearButton.id = clearButtonId;
        clearButton.classList.add('absolute', 'right-10', 'top-2', 'hidden', 'cursor-pointer', 'text-gray-400');
        clearButton.innerHTML = '&times;';
        searchWrapper.appendChild(clearButton);


        searchInput.addEventListener('input', () => {
            if (searchInput.value.length > 0) {
                clearButton.classList.remove('hidden');
            } else {
                clearButton.classList.add('hidden');
            }
        });


        clearButton.addEventListener('click', () => {
            searchInput.value = '';
            clearButton.classList.add('hidden');
            searchInput.dispatchEvent(new Event('input'));
        });
    };


    addSearchIcons(ingredientSearch, 'clear-search-ingredient');
    addSearchIcons(appareilSearch, 'clear-search-appareil');
    addSearchIcons(ustensileSearch, 'clear-search-ustensile');

    // Les filtres sélectionnés
    const selectedFilters = {
        ingredients: [],
        appareils: [],
        ustensiles: [],
    };

    // Cette fonction crée une balise de filtre
    const createFilterTag = (type, value, listItem) => {
        const filterTag = document.createElement('div');
        filterTag.className = 'bg-primary text-black px-5 py-3 rounded-xl flex items-center mt-5';
    
        const filterText = document.createElement('span');
        filterText.textContent = value;
    
        const closeButton = document.createElement('button');
        closeButton.className = 'ml-10 cross-icon cursor-pointer text-gray-400';
        closeButton.innerHTML = '&times;';
    
        closeButton.addEventListener('click', () => {
            selectedFilters[type] = selectedFilters[type].filter(item => item !== value.toLowerCase());
            filterContainer.removeChild(filterTag);
            listItem.classList.remove('bg-primary'); 
            const crossIcon = listItem.querySelector('.cross-icon');
            if (crossIcon) {
                crossIcon.remove(); 
            }
            filterRecipes();
        });
    
        filterTag.appendChild(filterText);
        filterTag.appendChild(closeButton);
        filterContainer.appendChild(filterTag);
    };

    // Lorsque le bouton de sélection d'ingrédient est cliqué, cette fonction sera exécutée
    ingredientSelectButton.parentElement.addEventListener('click', () => {
        ingredientOptions.classList.toggle('hidden');
    });

    // Lorsque le bouton de sélection d'appareil est cliqué, cette fonction sera exécutée
    appareilSelectButton.parentElement.addEventListener('click', () => {
        appareilOptions.classList.toggle('hidden');
    });

    // Lorsque le bouton de sélection d'ustensile est cliqué, cette fonction sera exécutée
    ustensileSelectButton.parentElement.addEventListener('click', () => {
        ustensileOptions.classList.toggle('hidden');
    });

    // Cette fonction peuple les listes de sélection avec les filtres
    const populateSelects = (recipes) => {
        const ingredientsSet = new Set();
        const appliancesSet = new Set();
        const utensilsSet = new Set();

        for (let i = 0; i < recipes.length; i++) {
            const recipe = recipes[i];
            if (Array.isArray(recipe.ingredients)) {
                for (let j = 0; j < recipe.ingredients.length; j++) {
                    ingredientsSet.add(recipe.ingredients[j].ingredient.toLowerCase());
                }
            }

            if (recipe.appliance) {
                appliancesSet.add(recipe.appliance.toLowerCase());
            }

            if (Array.isArray(recipe.ustensils)) {
                for (let j = 0; j < recipe.ustensils.length; j++) {
                    utensilsSet.add(recipe.ustensils[j].toLowerCase());
                }
            }
        }

        const addItemsToList = (set, container, type) => {
            container.innerHTML = '';
            set.forEach(item => {
                const li = document.createElement('li');
                li.className = 'py-2 px-4 hover:bg-primary text-left cursor-pointer w-full';
                li.textContent = item.charAt(0).toUpperCase() + item.slice(1);


                if (selectedFilters[type].includes(item)) {
                    li.classList.add('bg-primary');
                    li.classList.add('font-bold');


                    const crossIcon = document.createElement('span');
                    crossIcon.className = 'cursor-pointer text-xl';
                    crossIcon.innerHTML = '&times;';
                    

                    li.style.display = 'flex';
                    li.style.justifyContent = 'space-between';
                    li.style.alignItems = 'center';
                    li.appendChild(crossIcon);


                    crossIcon.addEventListener('click', (e) => {
                        e.stopPropagation();
                        selectedFilters[type] = selectedFilters[type].filter(selectedItem => selectedItem !== item);
                        li.classList.remove('bg-primary');
                        crossIcon.remove();
                        removeFilterTag(type, item);
                        filterRecipes();
                    });
                }

                li.addEventListener('click', () => {
                    if (!selectedFilters[type].includes(item)) {

                        selectedFilters[type].push(item);
                        li.classList.add('bg-primary');


                        const crossIcon = document.createElement('span');
                        crossIcon.className = 'cross-icon cursor-pointer text-gray-400 ml-2';
                        crossIcon.innerHTML = '&times;';
                        li.appendChild(crossIcon);


                        crossIcon.addEventListener('click', (e) => {
                            e.stopPropagation();
                            selectedFilters[type] = selectedFilters[type].filter(selectedItem => selectedItem !== item);
                            li.classList.remove('bg-primary'); 
                            crossIcon.remove(); 
                            removeFilterTag(type, item); 
                            filterRecipes();
                        });


                        createFilterTag(type, item.charAt(0).toUpperCase() + item.slice(1), li);
                    } else {

                        selectedFilters[type] = selectedFilters[type].filter(selectedItem => selectedItem !== item);
                        li.classList.remove('bg-primary');
                        const crossIcon = li.querySelector('.cross-icon');
                        if (crossIcon) {
                            crossIcon.remove(); 
                        }


                        removeFilterTag(type, item); 
                    }


                    filterRecipes();
                });

                container.appendChild(li);
            });
        };

        addItemsToList(ingredientsSet, ingredientOptions.querySelector('ul'), 'ingredients');
        addItemsToList(appliancesSet, appareilOptions.querySelector('ul'), 'appareils');
        addItemsToList(utensilsSet, ustensileOptions.querySelector('ul'), 'ustensiles');
    };


    // Cette fonction supprime la balise de filtre
    const removeFilterTag = (type, item) => {
        const tags = filterContainer.querySelectorAll('div');
        for (let i = 0; i < tags.length; i++) {
            const tag = tags[i];
            if (tag.textContent.includes(item.charAt(0).toUpperCase() + item.slice(1))) {
                filterContainer.removeChild(tag);
            }
        }
    };

    // Cette fonction affiche les recettes filtrées
    const displayRecipes = (filteredRecipes) => {
        recipeList.innerHTML = '';

        const recipeCards = [];
        for (let i = 0; i < filteredRecipes.length; i++) {
            const recipe = filteredRecipes[i];
            let ingredientsHTML = '<div class="grid grid-cols-2 gap-2 mt-4 ingredients">';
            if (Array.isArray(recipe.ingredients)) {
                for (let j = 0; j < recipe.ingredients.length; j++) {
                    const ingredient = recipe.ingredients[j];
                    ingredientsHTML += `
                        <div class="mb-2">
                            <p class="">${ingredient.ingredient}</p>
                            <span class="text-subtitle">${ingredient.quantity} ${ingredient.unit || ''}</span>
                        </div>
                    `;
                }
            }
            ingredientsHTML += '</div>';

            recipeCards.push(`
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
            `);
        }

        for (let i = 0; i < recipeCards.length; i++) {
            const recipeCardElement = document.createElement('div');
            recipeCardElement.innerHTML = recipeCards[i];
            recipeList.appendChild(recipeCardElement);
        }

        recipeCount.textContent = `${filteredRecipes.length} recettes`;
    };

    // Peupler les listes de sélection avec les recettes
    populateSelects(recipes);
    // Afficher les recettes
    displayRecipes(recipes);
});
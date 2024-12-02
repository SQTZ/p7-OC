// Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', () => {
    // Récupérer les éléments du DOM
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


    // Ajouter un écouteur d'événement pour le champ de recherche principal
    mainSearchInput.addEventListener('input', () => {
        if (mainSearchInput.value) {
            clearMainSearch.classList.remove('hidden');
        } else {
            clearMainSearch.classList.add('hidden');
        }
    });


    // Ajouter un écouteur d'événement pour le bouton de suppression de la recherche principale
    clearMainSearch.addEventListener('click', () => {
        mainSearchInput.value = '';
        clearMainSearch.classList.add('hidden');
        filterRecipes();
    });

    // Fonction pour mettre à jour les résultats de la recherche
    const updateResults = () => {
        const query = mainSearchInput.value.trim().toLowerCase();
        
        // Filtrer d'abord par la recherche principale
        let filteredRecipes = query.length < 3 
            ? [...recipes]
            : recipes.filter(recipe => 
                recipe.name.toLowerCase().includes(query) ||
                recipe.description.toLowerCase().includes(query) ||
                recipe.ingredients.some(ingredient => 
                    ingredient.ingredient.toLowerCase().includes(query)
                )
            );

        // Ensuite appliquer les filtres sélectionnés
        if (selectedFilters.ingredients.length > 0 || 
            selectedFilters.appareils.length > 0 || 
            selectedFilters.ustensiles.length > 0) {
            
            filteredRecipes = filteredRecipes.filter(recipe => {
                const hasIngredient = selectedFilters.ingredients.length === 0 || 
                    selectedFilters.ingredients.every(selectedIngredient => 
                        recipe.ingredients.some(ingredient => 
                            ingredient.ingredient.toLowerCase().includes(selectedIngredient)
                        )
                    );

                const hasAppareil = selectedFilters.appareils.length === 0 || 
                    selectedFilters.appareils.every(selectedAppareil => 
                        recipe.appliance.toLowerCase() === selectedAppareil
                    );

                const hasUstensile = selectedFilters.ustensiles.length === 0 || 
                    selectedFilters.ustensiles.every(selectedUstensile => 
                        recipe.ustensils.some(utensil => 
                            utensil.toLowerCase().includes(selectedUstensile)
                        )
                    );

                return hasIngredient && hasAppareil && hasUstensile;
            });
        }

        // Mettre à jour l'affichage
        displayRecipes(filteredRecipes);
        recipeCount.textContent = `${filteredRecipes.length} recettes`;

        // Mettre à jour les listes de filtres avec toutes les options disponibles
        if (query.length >= 3) {
            if (filteredRecipes.length === 0) {
                recipeList.innerHTML = `<h2 class="text-error">Aucune recette ne contient '${query}'. Vous pouvez chercher 'tarte aux pommes', 'poisson', etc.</h2>`;
            }
        }
        // Toujours mettre à jour les sélecteurs avec les recettes filtrées
        populateSelects(filteredRecipes);
    };

    // Fonction pour filtrer les recettes
    const filterRecipes = () => {
        updateResults();
    };

    // Fonction pour filtrer la liste
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

    // Ajouter des écouteurs d'événements pour les champs de recherche
    const addFilterListeners = () => {
        const filterInputs = [ingredientSearch, appareilSearch, ustensileSearch];
        filterInputs.forEach(input => {
            input.addEventListener('input', () => {
                if (input === ingredientSearch) {
                    filterList(ingredientSearch, ingredientOptions.querySelectorAll('ul li'));
                } else if (input === appareilSearch) {
                    filterList(appareilSearch, appareilOptions.querySelectorAll('ul li'));
                } else if (input === ustensileSearch) {
                    filterList(ustensileSearch, ustensileOptions.querySelectorAll('ul li'));
                }
            });
        });
    };


    // Ajouter un écouteur d'événement pour la recherche principale
    mainSearchBar.addEventListener('input', updateResults);

    // Ajouter des écouteurs d'événements pour les filtres
    addFilterListeners();


    // Fonction pour ajouter un bouton de suppression à la recherche principale
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




    // Fonction pour ajouter des icônes de recherche
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


    // Ajouter des icônes de recherche aux champs de recherche
    addSearchIcons(ingredientSearch, 'clear-search-ingredient');
    addSearchIcons(appareilSearch, 'clear-search-appareil');
    addSearchIcons(ustensileSearch, 'clear-search-ustensile');

    // Initialiser les filtres
    const selectedFilters = {
        ingredients: [],
        appareils: [],
        ustensiles: [],
    };

    // Fonction pour créer un tag de filtre
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



    // Ajouter des écouteurs d'événements pour les boutons de sélection
    ingredientSelectButton.parentElement.addEventListener('click', () => {
        ingredientOptions.classList.toggle('hidden');
    });

    appareilSelectButton.parentElement.addEventListener('click', () => {
        appareilOptions.classList.toggle('hidden');
    });

    ustensileSelectButton.parentElement.addEventListener('click', () => {
        ustensileOptions.classList.toggle('hidden');
    });

    // Fonction pour peupler les sélecteurs
    const populateSelects = (recipes) => {
        const ingredientsSet = new Set();
        const appliancesSet = new Set();
        const utensilsSet = new Set();

        recipes.forEach(recipe => {
            if (Array.isArray(recipe.ingredients)) {
                recipe.ingredients.forEach(ingredient => ingredientsSet.add(ingredient.ingredient.toLowerCase()));
            }

            if (recipe.appliance) {
                appliancesSet.add(recipe.appliance.toLowerCase());
            }

            if (Array.isArray(recipe.ustensils)) {
                recipe.ustensils.forEach(utensil => utensilsSet.add(utensil.toLowerCase()));
            }
        });

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


    // Fonction pour supprimer un tag de filtre
    const removeFilterTag = (type, item) => {
        const tags = filterContainer.querySelectorAll('div');
        tags.forEach(tag => {
            if (tag.textContent.includes(item.charAt(0).toUpperCase() + item.slice(1))) {
                filterContainer.removeChild(tag);
            }
        });
    };

    // Fonction pour afficher les recettes
    const displayRecipes = (filteredRecipes) => {
        const fragment = document.createDocumentFragment();
        
        filteredRecipes.forEach(recipe => {
            const recipeCard = document.createElement('div');
            const ingredientsHTML = Array.isArray(recipe.ingredients) 
                ? recipe.ingredients.map(ingredient => `
                    <div class="mb-2">
                        <p>${ingredient.ingredient}</p>
                        <span class="text-subtitle">${ingredient.quantity} ${ingredient.unit || ''}</span>
                    </div>
                `).join('')
                : '';

            recipeCard.innerHTML = `
                <div class="bg-white rounded-2xl shadow-lg overflow-hidden relative recipe-card">
                    <img loading="lazy" src="./assets/pictures/${recipe.image}" alt="${recipe.name}" class="w-full h-64 object-cover">
                    <div class="p-6">
                        <h3 class="text-xl font-semibold">${recipe.name}</h3>
                        <h4 class="text-subtitle font-bold tracking-wide">Recette</h4>
                        <p class="desc">${recipe.description}</p>
                        <h4 class="text-subtitle font-bold tracking-wide">Ingrédients</h4>
                        <div class="grid grid-cols-2 gap-2 mt-4 ingredients">
                            ${ingredientsHTML}
                        </div>
                    </div>
                    <p class="bg-primary text-xs font-light py-1 px-3 rounded-full absolute top-4 right-4">${recipe.time}min</p>
                </div>
            `;
            fragment.appendChild(recipeCard);
        });

        recipeList.innerHTML = '';
        recipeList.appendChild(fragment);
        recipeCount.textContent = `${filteredRecipes.length} recettes`;
    };

    // Initialiser les sélecteurs et afficher toutes les recettes
    populateSelects(recipes);
    displayRecipes(recipes);
});
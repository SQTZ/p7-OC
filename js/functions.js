document.addEventListener('DOMContentLoaded', () => {
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


    // Afficher ou cacher la croix en fonction de l'entrée
    mainSearchInput.addEventListener('input', () => {
        if (mainSearchInput.value) {
            clearMainSearch.classList.remove('hidden'); // Affiche la croix si le champ n'est pas vide
        } else {
            clearMainSearch.classList.add('hidden'); // Cache la croix si le champ est vide
        }
    });

    // Effacer le champ de recherche lorsque la croix est cliquée
    clearMainSearch.addEventListener('click', () => {
        mainSearchInput.value = ''; // Vide le champ de recherche
        clearMainSearch.classList.add('hidden'); // Cache la croix
        // Vous pouvez également appeler une fonction pour mettre à jour les résultats de recherche ici
    });

    const updateResults = () => {
        const query = mainSearchInput.value.trim().toLowerCase();

        // Vérifiez si la longueur de la requête est inférieure à 3 caractères
        if (query.length < 3) {
            displayRecipes(recipes); // Affiche toutes les recettes si moins de 3 caractères
            return; // Sort de la fonction
        }

        const filteredRecipes = recipes.filter(recipe => {
            // Recherche par la barre principale
            const matchTitle = recipe.name.toLowerCase().includes(query);
            const matchDescription = recipe.description.toLowerCase().includes(query);
            const matchIngredients = recipe.ingredients.some(ingredient => ingredient.ingredient.toLowerCase().includes(query));

            const matchesSearchBar = matchTitle || matchDescription || matchIngredients;

            // Filtres
            const hasIngredient = selectedFilters.ingredients.length
                ? selectedFilters.ingredients.every(selectedIngredient => recipe.ingredients.some(ingredient => ingredient.ingredient.toLowerCase().includes(selectedIngredient)))
                : true;

            const hasAppareil = selectedFilters.appareils.length
                ? selectedFilters.appareils.every(selectedAppareil => recipe.appliance.toLowerCase() === selectedAppareil)
                : true;

            const hasUstensile = selectedFilters.ustensiles.length
                ? selectedFilters.ustensiles.every(selectedUstensile => recipe.ustensils.some(utensil => utensil.toLowerCase().includes(selectedUstensile)))
                : true;

            // Afficher la recette seulement si elle correspond à la recherche principale ET aux filtres
            return matchesSearchBar && hasIngredient && hasAppareil && hasUstensile;
        });

        // Afficher les recettes filtrées
        displayRecipes(filteredRecipes);

        // Vérifiez si aucune recette n'a été trouvée
        if (filteredRecipes.length === 0) {
            const message = `Aucune recette ne contient '${query}'. Vous pouvez chercher 'tarte aux pommes', 'poisson', etc.`;
            recipeList.innerHTML = `<h2 class="mb-4 text-error">${message}</h2>`;
        } else {
            populateSelects(filteredRecipes); // Mettre à jour les filtres avec les recettes filtrées
        }
    };

    const filterRecipes = () => {
        updateResults(); // Mettre à jour les résultats en fonction des filtres
    };

    const addFilterListeners = () => {
        const filterInputs = [ingredientSearch, appareilSearch, ustensileSearch];
        filterInputs.forEach(input => {
            input.addEventListener('input', () => {
                // Appeler la fonction de filtrage pour chaque champ de recherche
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

    // Écouteur d'événements sur la barre de recherche principale
    mainSearchBar.addEventListener('input', updateResults);

    addFilterListeners(); // Appeler la fonction pour ajouter les écouteurs de filtre

    // Ajouter une croix pour effacer le champ de recherche principale
    const addMainSearchClearButton = () => {
        const searchWrapper = mainSearchBar.parentElement;

        // Ajouter la croix pour effacer le texte
        const clearButton = document.createElement('span');
        clearButton.classList.add('absolute', 'right-10', 'top-2', 'hidden', 'cursor-pointer', 'text-gray-400');
        clearButton.innerHTML = '&times;';
        searchWrapper.appendChild(clearButton);

        // Afficher la croix quand l'utilisateur tape
        mainSearchBar.addEventListener('input', () => {
            if (mainSearchBar.value.length > 0) {
                clearButton.classList.remove('hidden');
            } else {
                clearButton.classList.add('hidden');
            }
        });

        // Effacer le champ de recherche quand on clique sur la croix
        clearButton.addEventListener('click', () => {
            mainSearchBar.value = '';
            clearButton.classList.add('hidden');
            displayRecipes(recipes); // Réafficher toutes les recettes
        });
    };
    addMainSearchClearButton();
    
    

    // Ajouter les icônes de loupe et croix
    const addSearchIcons = (searchInput, clearButtonId) => {
        const searchWrapper = searchInput.parentElement;

        // Ajouter la croix pour effacer le texte
        const clearButton = document.createElement('span');
        clearButton.id = clearButtonId;
        clearButton.classList.add('absolute', 'right-10', 'top-2', 'hidden', 'cursor-pointer', 'text-gray-400');
        clearButton.innerHTML = '&times;';
        searchWrapper.appendChild(clearButton);

        // Gérer l'affichage de la croix quand l'utilisateur tape
        searchInput.addEventListener('input', () => {
            if (searchInput.value.length > 0) {
                clearButton.classList.remove('hidden');
            } else {
                clearButton.classList.add('hidden');
            }
        });

        // Effacer le champ de recherche quand on clique sur la croix
        clearButton.addEventListener('click', () => {
            searchInput.value = '';
            clearButton.classList.add('hidden');
            searchInput.dispatchEvent(new Event('input')); // Re-déclencher l'input pour actualiser la liste
        });
    };

    // Appeler la fonction pour ajouter les icônes dans chaque champ de recherche
    addSearchIcons(ingredientSearch, 'clear-search-ingredient');
    addSearchIcons(appareilSearch, 'clear-search-appareil');
    addSearchIcons(ustensileSearch, 'clear-search-ustensile');

    const selectedFilters = {
        ingredients: [],
        appareils: [],
        ustensiles: [],
    };

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

            if (recipe.appliance) {
                appliancesSet.add(recipe.appliance.toLowerCase());
            }

            if (Array.isArray(recipe.ustensils)) {
                recipe.ustensils.forEach(utensil => utensilsSet.add(utensil.toLowerCase()));
            }
        });

        const addItemsToList = (set, container, type) => {
            container.innerHTML = ''; // Réinitialiser la liste avant d'ajouter les éléments
            set.forEach(item => {
                const li = document.createElement('li');
                li.className = 'py-2 px-4 hover:bg-primary text-left cursor-pointer w-full';
                li.textContent = item.charAt(0).toUpperCase() + item.slice(1);

                // Vérifiez si l'élément est déjà sélectionné
                if (selectedFilters[type].includes(item)) {
                    li.classList.add('bg-primary');  // Ajoutez la classe jaune si déjà sélectionné
                    li.classList.add('font-bold');

                    // Ajouter une croix pour montrer que l'élément est sélectionné
                    const crossIcon = document.createElement('span');
                    crossIcon.className = 'cursor-pointer text-xl'; // Classe pour la croix
                    crossIcon.innerHTML = '&times;';
                    
                    // Appliquer le style flex à l'élément li
                    li.style.display = 'flex'; // Utiliser flexbox
                    li.style.justifyContent = 'space-between'; // Espacer le contenu
                    li.style.alignItems = 'center';
                    li.appendChild(crossIcon); // Ajouter la croix à la fin

                    // Écouteur d'événements pour retirer l'élément lorsque la croix est cliquée
                    crossIcon.addEventListener('click', (e) => {
                        e.stopPropagation(); // Empêche la propagation de l'événement
                        selectedFilters[type] = selectedFilters[type].filter(selectedItem => selectedItem !== item);
                        li.classList.remove('bg-primary'); // Retirer la classe jaune
                        crossIcon.remove(); // Retirer la croix
                        removeFilterTag(type, item); // Retirer le tag associé
                        filterRecipes(); // Refiltrer les recettes après mise à jour
                    });
                }

                li.addEventListener('click', () => {
                    if (!selectedFilters[type].includes(item)) {
                        // Ajouter l'élément à la sélection s'il n'est pas déjà présent
                        selectedFilters[type].push(item);
                        li.classList.add('bg-primary'); // Ajouter la classe jaune lors de la sélection

                        // Ajouter une croix pour montrer que l'élément est sélectionné
                        const crossIcon = document.createElement('span');
                        crossIcon.className = 'cross-icon cursor-pointer text-gray-400 ml-2';
                        crossIcon.innerHTML = '&times;';
                        li.appendChild(crossIcon);

                        // Écouteur d'événements pour retirer l'élément lorsque la croix est cliquée
                        crossIcon.addEventListener('click', (e) => {
                            e.stopPropagation(); // Empêche la propagation de l'événement
                            selectedFilters[type] = selectedFilters[type].filter(selectedItem => selectedItem !== item);
                            li.classList.remove('bg-primary'); // Retirer la classe jaune
                            crossIcon.remove(); // Retirer la croix
                            removeFilterTag(type, item); // Retirer le tag associé
                            filterRecipes(); // Refiltrer les recettes après mise à jour
                        });

                        // Créer un tag visuel (badge)
                        createFilterTag(type, item.charAt(0).toUpperCase() + item.slice(1), li);
                    } else {
                        // Si l'élément est déjà sélectionné, on le retire
                        selectedFilters[type] = selectedFilters[type].filter(selectedItem => selectedItem !== item);
                        li.classList.remove('bg-primary'); // Retirer la classe jaune
                        const crossIcon = li.querySelector('.cross-icon');
                        if (crossIcon) {
                            crossIcon.remove(); // Retirer la croix dans le menu
                        }

                        // Retirer également le tag associé à cet élément
                        removeFilterTag(type, item); // Retirer le tag correspondant
                    }

                    // Refiltrer les recettes après mise à jour
                    filterRecipes();
                });

                container.appendChild(li);
            });
        };

        addItemsToList(ingredientsSet, ingredientOptions.querySelector('ul'), 'ingredients');
        addItemsToList(appliancesSet, appareilOptions.querySelector('ul'), 'appareils');
        addItemsToList(utensilsSet, ustensileOptions.querySelector('ul'), 'ustensiles');
    };

    // Fonction pour retirer le tag associé
    const removeFilterTag = (type, item) => {
        const tags = filterContainer.querySelectorAll('div');
        tags.forEach(tag => {
            if (tag.textContent.includes(item.charAt(0).toUpperCase() + item.slice(1))) {
                filterContainer.removeChild(tag); // Retirer le tag correspondant
            }
        });
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

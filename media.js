document.addEventListener('DOMContentLoaded', () => {
    const mediaGrid = document.getElementById('mediaGrid');
    const typeFilter = document.getElementById('typeFilter');
    const sortBy = document.getElementById('sortBy');

    // Store all media items for reference
    let allMediaItems = Array.from(mediaGrid.children).map(item => {
        // Clone the items to avoid modifying the originals
        return item.cloneNode(true);
    });

    // Function to get rating from stars
    function getRatingFromStars(starsElement) {
        return starsElement.textContent.split('★').length - 1;
    }

    // Function to create a "no items" message
    function createNoItemsMessage(type) {
        const message = document.createElement('div');
        message.className = 'no-items-message entering';
        message.textContent = `No ${type} items found`;
        return message;
    }

    // Function to animate items out
    function animateItemsOut(items) {
        return new Promise(resolve => {
            if (items.length === 0) {
                resolve();
                return;
            }
            items.forEach(item => {
                item.classList.add('leaving');
            });
            setTimeout(resolve, 300);
        });
    }

    // Function to animate items in
    function animateItemsIn(items) {
        items.forEach(item => {
            item.classList.add('entering');
            // Force a reflow
            void item.offsetHeight;
            item.classList.remove('entering');
        });
    }

    // Function to sort and filter media items
    async function updateMediaDisplay() {
        const selectedType = typeFilter.value;
        const sortValue = sortBy.value;

        // Animate out existing items
        const currentItems = Array.from(mediaGrid.children);
        await animateItemsOut(currentItems);

        // Clear the grid
        mediaGrid.innerHTML = '';

        // Get items to display
        let itemsToDisplay = selectedType === 'all' 
            ? [...allMediaItems]
            : allMediaItems.filter(item => {
                const typeElement = item.querySelector('.media-type');
                if (!typeElement) return false;
                const itemType = typeElement.textContent.toLowerCase();
                return itemType === selectedType || 
                       (selectedType === 'tv' && itemType === 'tv show') ||
                       (selectedType === 'game' && itemType === 'game');
            });

        // If no items in the selected category, show message
        if (itemsToDisplay.length === 0) {
            const typeLabel = typeFilter.options[typeFilter.selectedIndex].text;
            const message = createNoItemsMessage(typeLabel);
            mediaGrid.appendChild(message);
            // Force a reflow
            void message.offsetHeight;
            message.classList.remove('entering');
            return;
        }

        // Sort items
        itemsToDisplay.sort((a, b) => {
            const aTitle = a.querySelector('h3').textContent.toLowerCase();
            const bTitle = b.querySelector('h3').textContent.toLowerCase();
            const aRating = getRatingFromStars(a.querySelector('.stars'));
            const bRating = getRatingFromStars(b.querySelector('.stars'));

            switch (sortValue) {
                case 'rating-desc':
                    return bRating - aRating;
                case 'rating-asc':
                    return aRating - bRating;
                case 'name-asc':
                    return aTitle.localeCompare(bTitle);
                case 'name-desc':
                    return bTitle.localeCompare(aTitle);
                default:
                    return 0;
            }
        });

        // Append sorted items
        itemsToDisplay.forEach(item => mediaGrid.appendChild(item));
        
        // Animate in new items
        requestAnimationFrame(() => {
            animateItemsIn(itemsToDisplay);
        });
    }

    // Add event listeners with debounce
    let timeout;
    function debounce(func, delay) {
        return function() {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(), delay);
        };
    }

    typeFilter.addEventListener('change', debounce(updateMediaDisplay, 100));
    sortBy.addEventListener('change', debounce(updateMediaDisplay, 100));

    // Initial sort - show items immediately without animation
    const initialItems = [...allMediaItems];
    mediaGrid.innerHTML = '';
    initialItems.forEach(item => mediaGrid.appendChild(item));
}); 
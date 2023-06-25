// Fetch inventory data from the backend API
function fetchInventoryData() {
    fetch('http://localhost:5000/inventory')
    .then(response => response.json())
    .then(data => {
      // Process the retrieved categories data
      // Update the UI with the categories data
      displayCategoriesData(data);
    })
    .catch(error => {
      // Handle any errors that occur during the request
      console.error('Error fetching categories data:', error);
    });
}

// Display the categories data in the UI
function displayCategoriesData(categoriesData) {
  // Get the inventory container element
  const inventoryContainer = document.getElementById('inventory-container');

  // Clear any existing content from the inventory container
  inventoryContainer.innerHTML = '';

  // Iterate over the categories data and create HTML elements to display the categories
  categoriesData.forEach(category => {
    const categoryElement = document.createElement('div');
    categoryElement.classList.add('category');
    categoryElement.textContent = category.name;
    inventoryContainer.appendChild(categoryElement);
  });
}

// Call the fetchCategoriesData function to retrieve and display the categories data

 
// Global variable to store the inventory data
let inventoryData = [];

// Fetch inventory data from the backend API
function fetchInventoryData() {
  fetch('http://localhost:5000/inventory')
    .then(response => response.json())
    .then(data => {

       // Store the inventory data
       inventoryData = data;
      // Process the retrieved inventory data
      // Update the UI with the inventory data
      inventoryData.sort((a,b)=>a.id - b.id); // Sort the inventory list
      displayInventoryData(data);
    })
    .catch(error => {
      // Handle any errors that occur during the request
      console.error('Error fetching inventory data:', error);
    });
}

// Display the inventory data in the UI
function displayInventoryData(inventoryData) {
  // Get the inventory table element
  const inventoryTable = document.getElementById('inventory-table');

  // Clear any existing content from the inventory table
  inventoryTable.innerHTML = '';

  // Create the table header row
  const headerRow = document.createElement('tr');
  headerRow.innerHTML = `
    <th>ID</th>
    <th>NAME</th>
    <th>PRICE</th>
    <th>QUANTITY</th>
    <th>CATEGORY</th>
    <th>SUPPLIER</th>
    <th>DELETE</th>
    <th>EDIT</th>
  `;
  inventoryTable.appendChild(headerRow);

  // Iterate over the inventory data and create table rows to display the items
  inventoryData.forEach(item => {
    const itemRow = document.createElement('tr');
    itemRow.innerHTML = `
      <td>${item.id}</td>
      <td>${item.name}</td>
      <td>${item.price}</td>
      <td>${item.quantity}</td>
      <td>${item.category}</td>
      <td>${item.supplier}</td>
      <td><button class="deletebuttons" data-id="${item.id}"><img class="trash-icons" src="src/icons/delete-outline.svg"</button></td>
      <td><button class="edit-buttons" onclick="displayUpdateForm()"><img class="edit-buttons-img" src="src/icons/pencil-outline.svg" alt="edit-sign"></button></td>
    `;
    inventoryTable.appendChild(itemRow);
  });

  document.querySelectorAll('.deletebuttons').forEach((button)=>{
    button.addEventListener('click', (e)=>{
      const buttonId = button.getAttribute('data-id');
      console.log(buttonId);
      displayConfirmBox(buttonId);
    })
  })
}


// Event listeners for search and filter inputs
const searchInput = document.getElementById('search-input');
const filterInput = document.getElementById('filter-input');

searchInput.addEventListener('input', () => {
  const query = searchInput.value.trim();
  searchInventory(query);
});

filterInput.addEventListener('change', () => {
  const category = filterInput.value;
  filterInventory(category);
});

// Search inventory items by name or ID
function searchInventory(query) {
  const searchResults = inventoryData.filter(item => {
    return (
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.id.toString().includes(query)
    );
  });

  displayInventoryData(searchResults);
}

// Filter inventory items by category
function filterInventory(category) {
  if(category == 'All'){
    displayInventoryData(inventoryData);
  }
  else{
    const filteredResults = inventoryData.filter(item => {
      return item.category.toLowerCase() === category.toLowerCase();
    });
    displayInventoryData(filteredResults);
  
  }
  
}

// Call the fetchInventoryData function to retrieve and display the inventory data
fetchInventoryData();



// Add event listener to the create item form
document.getElementById('create-item-form').addEventListener('submit', function(e) {
  e.preventDefault();

  // Gather the form data
  const formData = new FormData(this);

  // Make a POST request to the backend API
  fetch('http://localhost:5000/inventory', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(Object.fromEntries(formData))
  })
  .then(response => response.json())
  .then(data => {
    // Handle the response and update the UI accordingly
    console.log(data);
    fetchInventoryData();
    insertForm.reset();
  })
  .catch(error => {
    // Handle any errors that occur during the request
    console.error('Error creating inventory item:', error);
  });
  
});


// Event listener for the edit form submission
document.getElementById('update-item-form').addEventListener('submit', function(e) {
  e.preventDefault();

  // Gather the form data
  const formData = new FormData(this);
  const itemId = formData.get('id');

  // Make a PUT request to the backend API to update the item
  fetch(`http://localhost:5000/inventory/${itemId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(Object.fromEntries(formData))
  })
  .then(response => response.json())
  .then(data => {
    // Handle the response and update the UI accordingly
    console.log(data);
    
    fetchInventoryData();
    updateForm.reset();
    
  })
  .catch(error => {
    // Handle any errors that occur during the request
    console.error('Error updating inventory item:', error);
  });
});

// Funtion to delete an Inventory Data
function deleteInventoryData(theItemId){
  fetch(`http://localhost:5000/inventory/${theItemId}`, {
    method:'DELETE'
  })
  .then(response=>{
    if (response.ok){
      // Item delted successfully
      console.log('Inventory Item delted successfully');
      //Refresh the Inventory data
      fetchInventoryData();
    }
    else{
      // Error deleting Inventory Item
      console.log('Error deleting Inventory item');
    }
  })
  .catch(error=>{
    // Handle any errors that occur during deleting the item
    console.log('Error deleting inventory item:', error);
  });
}

const insertForm = document.getElementById('create-item-form');
const cancelButton = document.getElementById('cancelbutton');
const updateForm = document.getElementById('update-item-form');
const confirmBox = document.querySelector('.confirmbox');
const yesButton = document.getElementById('yesbutton');
const noButton = document.getElementById('nobutton');


function displayInsertForm(){
  insertForm.style.display='flex';
}

function hideInsertForm(event){
  event.preventDefault();
  insertForm.reset();
  insertForm.style.display='none';
}

function displayUpdateForm(){
  updateForm.style.display='block';
}

function hideUpdateForm(event){
  event.preventDefault();
  updateForm.reset();
  updateForm.style.display='none';
}

function displayConfirmBox(passedId){
  confirmBox.style.display='block';
  yesButton.addEventListener('click', function() {
    deleteInventoryData(passedId);
    confirmBox.style.display='none';
  }); 
}

noButton.addEventListener('click', ()=>{
  confirmBox.style.display='none';
})

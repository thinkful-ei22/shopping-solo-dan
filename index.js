'use strict';

const STORE = {
  items: [
    { name: 'apples', checked: false },
    { name: 'oranges', checked: false },
    { name: 'milk', checked: true },
    { name: 'bread', checked: false }
  ],
  hideChecked: false
};


function generateItemElement(item, itemIndex) {
  return `
    <li class="js-item-index-element" data-item-index="${itemIndex}">
      <span class="shopping-item js-shopping-item ${item.checked ? 'shopping-item__checked' : ''}">${item.name}</span>
      <div class="shopping-item-controls">
      <form id="js-item-edit-form" class="hidden">
            <input type="text" name="shopping-list-item-edit" class="js-shopping-list-item-edit">
            <button type="submit">save</button>
        </form>
      <button class="shopping-item-edit js-item-edit">
            <span class="button-label">edit</span>
        </button>
        <button class="shopping-item-toggle js-item-toggle">
            <span class="button-label">check</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
            <span class="button-label">delete</span>
        </button>
      </div>
    </li>`;
}


function generateShoppingItemsString(shoppingList) {
  console.log('Generating shopping list element');

  const items = shoppingList.map((item, index) => generateItemElement(item, index));

  return items.join('');
}


function renderShoppingList() {
  // render the shopping list in the DOM
  console.log('`renderShoppingList` ran');
  if (!STORE.hideChecked){
    const shoppingListItemsString = generateShoppingItemsString(STORE['items']);
    // insert that HTML into the DOM
    $('.js-shopping-list').html(shoppingListItemsString);
  } else {
    //if hideChecked is true, show only unchecked items
    const shoppingListUncheckedItemsString = generateShoppingItemsString(getUncheckedItems());
    $('.js-shopping-list').html(shoppingListUncheckedItemsString);
  }
}


function addItemToShoppingList(itemName) {
  console.log(`Adding "${itemName}" to shopping list`);
  STORE['items'].push({ name: itemName, checked: false });
}

function handleNewItemSubmit() {
  $('#js-shopping-list-form').submit(function (event) {
    event.preventDefault();
    console.log('`handleNewItemSubmit` ran');
    const newItemName = $('.js-shopping-list-entry').val();
    $('.js-shopping-list-entry').val('');
    addItemToShoppingList(newItemName);
    renderShoppingList();
  });
}

function toggleCheckedForListItem(itemIndex) {
  console.log('Toggling checked property for item at index ' + itemIndex);
  STORE['items'][itemIndex].checked = !STORE['items'][itemIndex].checked;
}


function getItemIndexFromElement(item) {
  const itemIndexString = $(item)
    .closest('.js-item-index-element')
    .attr('data-item-index');
  return parseInt(itemIndexString, 10);
}

function handleItemCheckClicked() {
  $('.js-shopping-list').on('click', '.js-item-toggle', event => {
    console.log('`handleItemCheckClicked` ran');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    toggleCheckedForListItem(itemIndex);
    renderShoppingList();
  });
}

function deleteCheckedForListItem (itemIndex) {
  STORE['items'].splice(itemIndex, 1);
}

function handleDeleteItemClicked() {
  // this function will be responsible for when users want to delete a shopping list item
  $('.js-shopping-list').on('click', '.js-item-delete', event => {
    console.log('`handleDeleteItemClicked` ran');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    deleteCheckedForListItem(itemIndex);
    renderShoppingList();
  });
}

//get unchecked items
function getUncheckedItems (){
  //create new array of items with unchecked items
  let uncheckedItems = STORE['items'].filter(item => item.checked === false);
  return uncheckedItems;
}

//Toggle checked items
function handleToggleCheckedItems (){
  $('#js-toggle-checked-items').on('click', function (){
    STORE.hideChecked = !STORE.hideChecked;
    renderShoppingList();
  });
}

//Edit mode
function editMode(event){
  let $li = $(event.currentTarget).closest('li');
  $li.find('.js-shopping-item').toggleClass('display-block');
  $li.find('#js-item-edit-form').toggleClass('hidden');
  $li.find('.js-shopping-item').toggleClass('hidden');
}

//Enter edit mode
function handleEnterEditMode (){
  $('.js-shopping-list').on('click', '.js-item-edit', event => {
    editMode(event);
    let currentName = $(event.currentTarget).closest('li').find('.js-shopping-item').text();
    $(event.currentTarget).closest('li').find('input[name="shopping-list-item-edit"]').val(currentName).focus();
  });
}

//Exit edit mode
function handleExitEditMode() {
  $('.js-shopping-list').on('focusout', 'input[name="shopping-list-item-edit"]', event => {
    let editedItemName = $(event.currentTarget).closest('li').find('input[name="shopping-list-item-edit"]').val();
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    editMode(event);
    editListItem(itemIndex, editedItemName);
  });
}

//Edit title of item
function editListItem(itemIndex, newValue) {
  if (!newValue) {
    deleteCheckedForListItem(itemIndex);
  } else {
    STORE['items'][itemIndex].name = newValue;
  }
  renderShoppingList();
}


// this function will be our callback when the page loads. it's responsible for
// initially rendering the shopping list, and activating our individual functions
// that handle new item submission and user clicks on the "check" and "delete" buttons
// for individual shopping list items.
function handleShoppingList() {
  renderShoppingList();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  handleToggleCheckedItems();
  handleEnterEditMode();
  handleExitEditMode();
}

// when the page loads, call `handleShoppingList`
$(handleShoppingList);

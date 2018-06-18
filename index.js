'use strict';

const STORE = {
  items: [
    { name: 'apples', checked: false },
    { name: 'oranges', checked: false },
    { name: 'milk', checked: true },
    { name: 'bread', checked: false }
  ],
  hideChecked: false,
  filteredBy: ''
};

//generates new li with shopping list item
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

//joins lis with shopping list items into single string
function generateShoppingItemsString(shoppingList) {
  const items = shoppingList.map((item, index) => generateItemElement(item, index));
  return items.join('');
}

// renders shopping list to the DOM
function renderShoppingList() {
  let shoppingList = STORE['items'];
  let filteredList = filterShoppingListItemsBy(shoppingList);

  if (STORE.filteredBy && STORE.hideChecked) {
    shoppingList = getUncheckedItems(filteredList);
  }
  else if (STORE.filteredBy && !STORE.hideChecked) {
    shoppingList = filteredList;
  }
  else if (!STORE.filteredBy && STORE.hideChecked) {
    shoppingList = getUncheckedItems(shoppingList);
  }
  $('.js-shopping-list').html(generateShoppingItemsString(shoppingList));
}

//adds new item to STORE.items
function addItemToShoppingList(itemName) {
  STORE['items'].push({ name: itemName, checked: false });
}

//handles addition of new value to shopping list
function handleNewItemSubmit() {
  $('#js-shopping-list-form').submit(function (event) {
    event.preventDefault();
    const newItemName = $('.js-shopping-list-entry').val();
    $('.js-shopping-list-entry').val('');
    addItemToShoppingList(newItemName);
    renderShoppingList();
  });
}

//returns array with elements filtered by keyword
function filterShoppingListItemsBy(list) {
  if (STORE.filteredBy) {
    return list.filter(item => item['name'].includes(STORE.filteredBy));
  }
}

//handles filtering of shopping list items by keyword
function handleFilteredItemSubmit() {
  $('#js-search-shopping-list-form').submit(function (event) {
    event.preventDefault();
    const itemToFilterBy = $('.js-search-key-entry').val();
    $('.js-search-key-entry').val('');
    STORE.filteredBy = itemToFilterBy;
    renderShoppingList();
  });
}

//toggles 'checked' property of shopping list item in STORE.items
function toggleCheckedForListItem(itemIndex) {
  STORE['items'][itemIndex].checked = !STORE['items'][itemIndex].checked;
}

//gets index of item in STORE.items
function getItemIndexFromElement(item) {
  const itemIndexString = $(item)
    .closest('.js-item-index-element')
    .attr('data-item-index');
  return parseInt(itemIndexString, 10);
}

//handles toggling of 'checked' property of shopping list items
function handleItemCheckClicked() {
  $('.js-shopping-list').on('click', '.js-item-toggle', event => {
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    toggleCheckedForListItem(itemIndex);
    renderShoppingList();
  });
}

//deletes item with selected index from STORE.items
function deleteListItem (itemIndex) {
  STORE['items'].splice(itemIndex, 1);
}

//handles deletion of shopping list items
function handleDeleteItemClicked() {
  $('.js-shopping-list').on('click', '.js-item-delete', event => {
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    deleteListItem(itemIndex);
    renderShoppingList();
  });
}

//returns array of elements with unchecked items
function getUncheckedItems (list){
  return list.filter(item => !item.checked);
}

//toggles checked items
function handleToggleCheckedItems (){
  $('#js-toggle-checked-items').on('click', function (){
    STORE.hideChecked = !STORE.hideChecked;
    renderShoppingList();
  });
}

//edit mode
function editMode(event){
  let $li = $(event.currentTarget).closest('li');
  $li.find('.js-shopping-item').toggleClass('display-block');
  $li.find('#js-item-edit-form').toggleClass('hidden');
  $li.find('.js-shopping-item').toggleClass('hidden');
}

//enters edit mode
function handleEnterEditMode (){
  $('.js-shopping-list').on('click', '.js-item-edit', event => {
    editMode(event);
    let currentName = $(event.currentTarget).closest('li').find('.js-shopping-item').text();
    $(event.currentTarget).closest('li').find('input[name="shopping-list-item-edit"]').val(currentName).focus();
  });
}

//exits edit mode
function handleExitEditMode() {
  $('.js-shopping-list').on('focusout', 'input[name="shopping-list-item-edit"]', event => {
    let editedItemName = $(event.currentTarget).closest('li').find('input[name="shopping-list-item-edit"]').val();
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    editMode(event);
    updateListItem(itemIndex, editedItemName);
  });
}

//updates title of item
function updateListItem(itemIndex, newValue) {
  if (!newValue) {
    deleteListItem(itemIndex);
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
  handleFilteredItemSubmit();
  handleDeleteItemClicked();
  handleToggleCheckedItems();
  handleEnterEditMode();
  handleExitEditMode();
}

// when the page loads, call `handleShoppingList`
$(handleShoppingList);

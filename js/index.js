const db = new Dexie('GroceryApp')
db.version(1).stores({ items: '++id,name,price,isPurchased' })

const itemInput = document.getElementById('itemInput')
const newItemsDiv = document.getElementById('newItemsDiv')
const totalPriceDiv = document.getElementById('totalPriceDiv')
const createNewListDiv = document.getElementById('createNewListDiv')


//toggle add/update views
const defaultView = (v) =>{
  if(v == true){
    addItemView.style.display="block";
    updateItemView.style.display="none";
  }else if(v == false){
    addItemView.style.display="none";
    updateItemView.style.display="block";
  }
}


// Items
const populateNewItemsDiv = async () => {
  const allItems = await db.items.reverse().toArray()

  newItemsDiv.innerHTML = allItems.map(item => `
    <div class="item ${item.isPurchased && 'purchased'}">
      <input
        type="checkbox"
        class="checkbox"
        onchange="toggleItemStatus(event, ${item.id})"
        ${item.isPurchased && 'checked'}
      />
      
      <div class="itemInfo">
        <p>${item.name}</p>
        <p>$${item.price} x ${item.quantity}</p>
      </div>
     
      ${!item.isPurchased ? `<div class="itemChange">
      <button onclick="deleteItem(${item.id})" class="deleteButton">
      <span class="deleteSign">&#9747</span>
      </button>
      </div>`: ``}
    </div>
  `).join('')

  const arrayOfPrices = allItems.map(item => item.price * item.quantity)
  const totalPrice = arrayOfPrices.reduce((a, b) => a + b, 0)

  totalPriceDiv.innerText = 'Total Price: $' + totalPrice
}

window.onload = populateNewItemsDiv

//add item
itemInput.onsubmit = async (event) => {
  event.preventDefault()

  const name = document.getElementById('nameInput').value
  const quantity = document.getElementById('quantityInput').value
  const price = document.getElementById('priceInput').value


  await db.items.add({ name, quantity, price})
  await populateNewItemsDiv()

  itemInput.reset()
}

//purchased or not
const toggleItemStatus = async (event, id) => {
  await db.items.update(id, { isPurchased: !!event.target.checked })
  await populateNewItemsDiv()
}

//delete item
const deleteItem = async id => {
  await db.items.delete(id)
  await populateNewItemsDiv()
  defaultView(true)
}

//delete all items
const deleteAllItems = () => {
  db.items.clear()
  populateNewItemsDiv()
  defaultView(true)
}

// Get the modal
var modal = document.getElementById('myModal');

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function () {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}  

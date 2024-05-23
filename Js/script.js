const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItensContainer = document.getElementById("cart-itens");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const adressInput = document.getElementById("adress");
const adressWarn = document.getElementById("adress-warn");
const spanItem = document.getElementById("data-span");

let cart = [];

cartBtn.addEventListener("click", function() {
    updateCartModal();
    cartModal.style.display = "flex";
});

cartModal.addEventListener("click", function(event) {
    if(event.target === cartModal) {
        cartModal.style.display = "none"
    }
});

closeModalBtn.addEventListener("click", function() {
    cartModal.style.display = "none"
});

menu.addEventListener("click", function(event) {
    let parentButton = event.target.closest(".add-to-cart-btn");
   if(parentButton) {
    const name = parentButton.getAttribute("data-name");
    const price = parseFloat(parentButton.getAttribute('data-price'));

    addToCard(name, price);

   }


});

function addToCard (name, price) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quanty += 1;    
    } else {
        cart.push({
            name,
            price,
            quanty: 1,
        })
    }

    updateCartModal();
}

function updateCartModal() {
    cartItensContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        cartItemElement.innerHTML = `
        <di class= "flex items-center justify-between">
            <div>
                <p class= " font-medium">${item.name}</p>
                <p>Qtd. ${item.quanty}</p>
                <p class= " font-medium mt-2">${item.price.toFixed(2)} €</p>
            </div>

            <button class="remove-from-btn" data-name="${item.name}">
                Remover
            </button>
         
        </div>
        `
        total += item.price * item.quanty;

        cartItensContainer.appendChild(cartItemElement);
    })

    cartTotal.textContent = total.toLocaleString("pt-PT", {
        style: "currency",
        currency: "EUR"
    });

    cartCounter.innerText = cart.length;
}

cartItensContainer.addEventListener("click", function(event) {
    if(event.target.classList.contains("remove-from-btn")) {
        const name = event.target.getAttribute("data-name")
        removeItemCart(name);
    }
})

function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name);
    if(index != -1){
        const item = cart[index];
        
        if(item.quanty > 1){
            item.quanty -= 1;
            updateCartModal();
            return;
        }

        cart.splice(index, 1);
        updateCartModal();
    }
}

adressInput.addEventListener("input" ,function(event){
    let inputValue = event.target.value;

    if(inputValue != ""){
        adressWarn.classList.remove("border-red-500")
        adressWarn.classList.add("hidden")
    }
});

checkoutBtn.addEventListener("click", function(){
    const isOpen = checkRestaurantOpen();
    if(!isOpen){
        Toastify({
            text: "Ops o restaurante está fechado!",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "#ef4444",
            },
            onClick: function(){} // Callback after click
          }).showToast();
        return;
    }

    if(cart.length === 0) return;

    if(adressInput.value === "") {
        adressWarn.classList.remove("hidden")
        adressWarn.classList.add("border-red-500")
        return;
    }

    const cartItens = cart.map((item) => {
        return (
            `${item.name} Quantidade: (${item.quanty}) Preço: ${item.price}€ |`
        )
    }).join("");

    const message = encodeURIComponent(cartItens);
    const phone = "927240193";

    window.open(`http://wa.me/${phone}?text=${message} Endereço: ${adressInput.value}`, "_bland");

    cart = [];
    updateCartModal();
});

function checkRestaurantOpen() {
    const data = new Date();
    const hora = data.getHours();
    return hora >= 8 && hora < 22;
}

const isOpen = checkRestaurantOpen();
console.log(isOpen)

if(isOpen) {
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-500");
} else {
    spanItem.classList.remove("bg-green-500");
    spanItem.classList.add("bg-red-500");
}



let myShoppingList = [];
let productMeta = null;
const productList = document.getElementById('productList');
const addToList = document.getElementById('addToList');

// Delete product from shopping list
productList.addEventListener('click', (e) => {
	if (e.target && e.target.nodeName === 'BUTTON') {
		const updatedList = myShoppingList?.filter((item) => item.url !== e.target.id);
		chrome.storage.sync.set({ shoppingList: updatedList }, getDataFromStorage);
	}
});

// Add product to shopping list
addToList.addEventListener('click', () => {
	if (productMeta && !myShoppingList?.find((item) => item.url === productMeta.url)) {
		chrome.storage.sync.set({ shoppingList: [...myShoppingList, productMeta] }, getDataFromStorage);
	}
});

// Truncate text
const truncateString = (text, length) => {
	if (!text) text = '';

	if (text?.length > length) {
		return `${text?.substring(0, length)}...`;
	}
	return text;
};

// Get product list from chrome storage and render into HTML
const getDataFromStorage = () => {
	chrome.storage.sync.get("shoppingList", ({ shoppingList }) => {
		myShoppingList = shoppingList ?? [];
	
		const products = [];
		for(let i = 0; i < shoppingList?.length; i++) {
			products.push(`
				<div class="card mb-3">
					<div class="row g-0">
						<div class="col-3">
							<img src="${shoppingList[i]?.image ?? './images/no-image.jpg'}" class="img-fluid rounded-start" alt="...">
						</div>
						<div class="col-9">
							<div class="card-body py-2">
								<h6 class="card-title mb-0">
									<a class="text-decoration-none" href="${shoppingList[i]?.url}" target="_blank">${truncateString(shoppingList[i]?.title, 30)}</a>
								</h6>
								<div class="mb-2">
									<a class="text-secondary" href="${shoppingList[i]?.website}" target="_blank">${shoppingList[i]?.website}</a>
								</div>
								<button id="${shoppingList[i]?.url}" class="btn btn-danger">Delete</button>
							</div>
						</div>
					</div>
				</div>
			`);
		}
		productList.innerHTML = products.join(' ');
	});
}

// Receive message with meta data
chrome.runtime.onMessage.addListener(function(request, sender) {
	if (request.method == "getMetas") {
		productMeta = request.metas;
	}
});

// Run get page meta script on load
async function getMetas() {
	let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

	if(!tab.url.includes('chrome://')) {
		chrome.scripting.executeScript({
			target: { tabId: tab.id },
			files: ["getPageMetas.js"]
		});
	}
}

window.addEventListener('load', (event) => {
	getMetas();
	getDataFromStorage();
});
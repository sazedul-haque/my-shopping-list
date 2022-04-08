// Collect product information from meta tags
var metas = document.getElementsByTagName('meta');
var productMeta = {
	url: window.location.href,
	website: window.location.origin
};

for (var i=0; i<metas.length; i++) {
	if (metas[i].getAttribute("name") === 'title' || metas[i].getAttribute("name") === 'og:title' || metas[i].getAttribute("property") === 'og:title') {
		productMeta.title = metas[i].getAttribute("content")
	}

	if (metas[i].getAttribute("name") === 'og:image' || metas[i].getAttribute("property") === 'og:image') {
		productMeta.image = metas[i].getAttribute("content")
	}
}

// Send message with product meta
chrome.runtime.sendMessage({
	method:"getMetas",
	metas:productMeta
});
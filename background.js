
// Keep page action icon on all tabs
chrome.tabs.onUpdated.addListener(function(tab_id) {
	chrome.pageAction.show(tab_id)
})

chrome.tabs.getSelected(null, function(tab) {
	chrome.pageAction.show(tab.id)
})

var clickCount = 0;
// Send request to current tab when icon is clicked
chrome.pageAction.onClicked.addListener(function(tab) {
	// Passing the tab's URL to the content script
	clickCount += 1
	var tabUrl = ''
	chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
		tabUrl = tabs[0].url
	})
	
	chrome.tabs.getSelected(null, function(tab) {
		chrome.tabs.sendMessage(
			//Selected tab id
			tab.id,
			//Params inside a object data
			{callFunction: "main", url: tabUrl, clickCount: clickCount}, 
			//Optional callback function
			function(response) {
				console.log(response)
			}
		)
	})
})

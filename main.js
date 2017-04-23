

/*Handle requests from background.html*/
function handleRequest(request, sender, sendResponse) {
	if (request.callFunction == "main") {
		main(request.clickCount, request.url)
	}
}

chrome.extension.onMessage.addListener(handleRequest)

function main(clickCount, url) {
	
	startLittleGuy(url)
	
	// Adjusting the multiple the other Guys slide in on so that it's not as predictable
	var grillGuyMultiple = Math.floor(31 + clickCount / 31)
	var bigGuyMultiple = Math.floor(11 + clickCount / 11)
	
	if (clickCount % bigGuyMultiple === 0) {
		slideBigGuyIn()
	}
	
	// Some math to figure out when to send out Grill Guys
	if (clickCount < 3) {
		return
	}
	var grillGuyRemainder = clickCount % grillGuyMultiple 
	switch (grillGuyRemainder) {
		case 0:
		case 1:
		case 2:
			slideGrillGuyIn()
			break
		default:
			break
	}
	
}

function startLittleGuy(url) {
	// Function to create and dispatch Little Guys
	
	var height = window.innerHeight
	var width = window.innerWidth
	
	// Creating a sort of random path for the Guys to follow
	var bezier_path = [
		{ x: Math.random() * width/2, y: Math.random() * height }, 
		{ x: width/2 + Math.random() * width/2, y: Math.random() * height }, 
		{ x: width + 600, y: Math.random() * height }
	]
	
	var littleGuyPath = chrome.extension.getURL('guys/guy3.png')
	var $littleGuy = $('<img src="' + littleGuyPath + '" class="little-guy" />')
	$littleGuy.css('height', height/4 + Math.random() * height/4 + 'px')
	
	// Some site specific changes to get around their css rules
	if (url.indexOf('www.cnn.com') != -1) {
		$littleGuy.addClass('nav')
	}
	
	$(document.body).append($littleGuy)
	
	var timeline = new TimelineMax()
	
	$littleGuy.on('load', function() {
		timeline.staggerTo($littleGuy, 4, { bezier: {
			type: 'soft',
			values: bezier_path,
			curviness: 1,
			autoRotate: true,
			parseTransform:true
		}, ease: Power1.easeOut })
	})
	
	setTimeout(function() {
		$littleGuy.remove()
	}, 4000)
}

function slideGrillGuyIn() {
	var grillGuyPath = chrome.extension.getURL('guys/guy4.png')
	var $grillGuy = $('<img src="' + grillGuyPath + '" class="grill-guy" />')
	
	$(document.body).append($grillGuy)
	
	$grillGuy.on('load', function() {
		var guyHeight = (2.0 / 3) * window.innerHeight
		$grillGuy.css({
			height: guyHeight + 'px',
			width: 'auto',
			bottom: '-' + guyHeight + 'px'
		})
		$grillGuy.animate({bottom: '+=' + guyHeight}, 2000)
		
		setTimeout(function() {
			$grillGuy.animate({bottom: '-=' + guyHeight}, 500)
			setTimeout(function() {
				$grillGuy.remove()
			}, 500)
		}, 2000)
	})
}

function slideBigGuyIn() {
	var bigGuyPath = chrome.extension.getURL('guys/guy1.png')
	var $bigGuy = $('<img src="' + bigGuyPath + '" class="guy-fieri"/>')
	
	$(document.body).append($bigGuy)
	$bigGuy.on('load', function() {
		var guyWidth = $bigGuy.width()
		
		$bigGuy.css('right', '-' + guyWidth + 'px')
		$bigGuy.animate({right: '+=' + guyWidth}, 1000)
		$bigGuy.css('display', 'block')
		
		setTimeout(function() {
			$bigGuy.animate({right: '-=' + guyWidth}, 1000)
			setTimeout(function() {
				$bigGuy.remove()
			}, 1000)
		}, 2200)
	})
	
}

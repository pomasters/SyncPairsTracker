import {SYNCPAIRS, VERSION} from './syncpairs.js';
import {EGGS} from './eggs.js';
import {NEWS} from './news.js';

const syncLevelImgs = ["images/1.png","images/2.png","images/3.png","images/4.png","images/5.png"];
const syncStarImgs = ["images/star/1.png","images/star/2.png","images/star/3.png","images/star/4.png","images/star/5.png"];
const syncStarImgs2 = ["images/star1.png","images/star2.png","images/star3.png","images/star4.png","images/star5.png","images/star6ex.png"];
const syncFavImgs = ["images/favorite1.png","images/favoriteG.png","images/favoriteY.png","images/favoriteO.png","images/favoriteR.png","images/favoriteV.png","images/favoriteB.png","images/favorite2.png"];
const typesOrder = {"normal":"01","fire":"02","water":"03","electric":"04","grass":"05","ice":"06","fighting":"07","poison":"08","ground":"09","flying":"10","psychic":"11","bug":"12","rock":"13","ghost":"14","dragon":"15","dark":"16","steel":"17","fairy":"18"};
const rolesOrder = {"physical strike":"01","special strike":"01","tech":"02","support":"03"};
const regionsOrder = {"pasio":"00","kanto":"01","johto":"02","hoenn":"03","sinnoh":"04","unova":"05","kalos":"06","alola":"07","galar":"08","paldea":"09"}


/*-----------------------------------------------------------------------------
	GENERATE ALL HTML ELEMENTS ABOUT THE SYNCPAIRS
-----------------------------------------------------------------------------*/

var EGGMONMODE = document.getElementById("btnEggs").classList.contains("btnEggsON");

var CURRENT_NEW = 0;

var FILTER_MODE = "&";


/* parameter "pairs" is the array containing all {syncpair} -- see syncpairs.js/eggs.js */
function generatePairsHTML(pairs) {

	var result = "";
	var hideStar = "";

	if(! EGGMONMODE) { hideStar = "hide" }

	for(var i=0; i<pairs.length; i++) {
		var syncPair = pairs[i];
		var keySyncPairStorage = syncPair.trainerName + "|" + syncPair.pokemonNumber;

		var selected = ""; //to enable the selected class or not

		var datamine = "";
		var dateRelease = new Date(syncPair.releaseDate + "T23:00:00-07:00"); //add 23:00:00 PDT
		var dateNow = new Date();
		// -86400000 => the previous day
		if(dateRelease.getTime()-86400000 > dateNow.getTime()) {
			datamine = " datamine"
		}

		var innerHtmlImages;

		/* if the current syncpair is in localstorage,
		generate the images with current selected image */
		if(localStorage.getItem(keySyncPairStorage) !== null) {
			// you get "X|Y|Z|W".split("|"), X index of sync level, Y index of syncpair image, Z sync star & W favorite
			var currentData = localStorage.getItem(keySyncPairStorage).split("|");

			var currentSyncLevel = parseInt(currentData[0]);
			var currentSyncImage = parseInt(currentData[1]);
			var currentSyncStar = parseInt(currentData[2]);
			var currentSyncFav = parseInt(currentData[3]);

			if(isNaN(currentSyncLevel)) { currentSyncLevel = "0" }
			if(isNaN(currentSyncImage)) { currentSyncImage = "0" }
			if(isNaN(currentSyncStar)) { currentSyncStar = "0" }
			if(isNaN(currentSyncFav)) { currentSyncFav = "0" }

			var currentStar;
			if(! EGGMONMODE) {
				if(syncPair.trainerName == "Player") {
					currentStar = Math.floor(currentSyncImage/2) + parseInt(syncPair.syncPairRarity);
				} else {
					currentStar = parseInt(syncPair.syncPairRarity) + parseInt(currentSyncImage);
				}
			} else { currentStar = parseInt(syncPair.syncPairRarity) + parseInt(currentSyncStar); }

		
			selected = " selected";
			innerHtmlImages = 
				`<div class="syncStar ${hideStar}" data-currentImage="${currentSyncStar}" data-currentstar="${currentStar}">
					${genImages(syncStarImgs, currentSyncStar)}
				</div>
				<div class="syncFav" data-currentImage="${currentSyncFav}" data-html2canvas-ignore="true">
					${genImages(syncFavImgs, currentSyncFav)}
				</div>
				<div class="syncLevel" data-currentImage="${currentSyncLevel}">
					${genImages(syncLevelImgs, currentSyncLevel)}
				</div>
				<div class="syncImages" data-currentImage="${currentSyncImage}">
					${genImages(syncPair.images, currentSyncImage)}
				</div>`;

		} else {
			innerHtmlImages = 
				`<div class="syncStar ${hideStar}" data-currentImage="0" data-currentstar="${syncPair.syncPairRarity}">
					${genImages(syncStarImgs, 0)}
				</div>
				<div class="syncFav" data-currentImage="0" data-html2canvas-ignore="true">
					${genImages(syncFavImgs, 0)}
				</div>
				<div class="syncLevel" data-currentImage="0">
					${genImages(syncLevelImgs, 0)}
				</div>
				<div class="syncImages" data-currentImage="0">
					${genImages(syncPair.images, 0)}
				</div>`;
		}

		result += `
			<div class="syncPair${selected}${datamine}" data-id="${i}">

				${innerHtmlImages}

				<div class="syncInfos" data-html2canvas-ignore="true">
					<p class="infoDexNum">${syncPair.dexNumber}</p>
					<p class="infoTrainerName">${syncPair.trainerName}</p>
					<p class="infoTrainerAltName">${syncPair.trainerAlt}</p>
					<p class="infoPokemonNum">${syncPair.pokemonNumber}</p>
					<p class="infoPokemonName">${syncPair.pokemonName}
						<span class="infoPokemonGender">${syncPair.pokemonGender}</span>
					</p>
					<p class="infoPokemonForms">${tags(syncPair.pokemonForm)}</p>
					<p data-order="${typesOrder[syncPair.pokemonType.toLowerCase()]}" class="infoPokemonType">${syncPair.pokemonType}</p>
					<p data-order="${typesOrder[syncPair.pokemonWeak.toLowerCase()]}" class="infoPokemonWeak">${syncPair.pokemonWeak}</p>
					<p data-order="${rolesOrder[syncPair.syncPairRole.toLowerCase()]}" class="infoSyncPairRole">${syncPair.syncPairRole}</p>
					<p class="infoSyncPairRarity">${syncPair.syncPairRarity}</p>
					<p class="infoReleaseDate">${syncPair.releaseDate}</p>
					<p data-order="${regionsOrder[syncPair.syncPairRegion.toLowerCase()]}" class="infoSyncPairRegion">${syncPair.syncPairRegion}</p>
					<p class="infoSyncPairThemes">${tags(syncPair.themes)}</p>
					<p class="infoSyncPairTags">${tags(syncPair.tags)}</p>
				</div>
			</div>`;
	}

	/* generate all <img> of an array of images src and
	add the "currentImage" class to image at index "current_i" */
	function genImages(imgs, current_i) {
		var im = "";
		var current_im = current_i;
		if(current_im >= imgs.length) { current_im = imgs.length-1; }
		if(imgs.length == 0) return `<img draggable="false" loading="lazy" src="images/empty.png" class="currentImage">`

		for(var i=0; i<imgs.length; i++) {
			if(i==current_im) { im += `<img draggable="false" loading="lazy" src="${imgs[i]}" class="currentImage">`
			} else { im += `<img  draggable="false" loading="lazy" src="${imgs[i]}">` }
		}
		return im;
	}

	function tags(tags) { return tags.join(", "); }

	document.getElementById('syncPairs').innerHTML = result;
}


/* add eventlisterner to all ".syncpair" elements, move level and images */
function addSyncPairsEvents() {

	var syncStars = Array.from(document.getElementsByClassName("syncStar"));
	var syncFavs = Array.from(document.getElementsByClassName("syncFav"));
	var syncLevels = Array.from(document.getElementsByClassName("syncLevel"));
	var syncImages = Array.from(document.getElementsByClassName("syncImages"));

	var syncStarFavsLevels = syncStars.concat(syncLevels);
	var syncStarFavsLevelsImages = syncImages.concat(syncStarFavsLevels);

	var ua = window.navigator.userAgent;
	var iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
	var webkit = !!ua.match(/WebKit/i);
	var iOSSafari = iOS && webkit && !ua.match(/CriOS/i);

	syncImages.forEach(s => s.addEventListener("click", function() {

		if(!(localStorage.getItem("viewMode") === "true") && !(localStorage.getItem("lockMode") === "true")) {
			if(s.parentElement.classList.contains("selected")) {
				unselect(s.parentElement);
			} else {
				select(s.parentElement);
			}
			countSelection();
		}

	}));

	syncStarFavsLevels.forEach(s => s.addEventListener("click", function() { addEvents(s); }));

	if(window.getComputedStyle(document.getElementById("mobileDetection")).getPropertyValue("width") == "0px") {
		syncFavs.forEach(function(s) {
			Array.from(s.children).forEach(t => t.addEventListener("click", function() {
				chooseFavorite(t);
				addToLocalStorage(t.parentElement.parentElement);
			}))
			Array.from(s.children).forEach(t => t.addEventListener("contextmenu", function(e) {
				e.preventDefault();	e.stopPropagation();

				chooseFavorite(t);
				addToLocalStorage(t.parentElement.parentElement);

				return false;
			}))
		});
	} else {
		syncFavs.forEach(s => s.addEventListener("click", function() { addEvents(s); }));
	}


	if(iOSSafari) {
		syncStarFavsLevelsImages.forEach(s => s.addEventListener("long-press", function() { addEvents(s); }));
	}
	else {
		syncStarFavsLevelsImages.forEach(s => s.addEventListener("contextmenu", function(e) {

			e.preventDefault();	e.stopPropagation();

			addEvents(s);

			return false;
		}));
	}

	function addEvents(si) {
		if(si.parentElement.classList.contains("selected") && !(localStorage.getItem("viewMode") === "true") && !(localStorage.getItem("lockMode") === "true")) {
			swapImages(si, 1)
			addToLocalStorage(si.parentElement);
		}
	}
}


/* takes a <div> containing <img> elements and move the "currentImage" class through the images */
function swapImages(imagesContainer, step) {
	var images = Array.from(imagesContainer.children);
	var nextImageNumber = parseInt(imagesContainer.dataset.currentimage) + step;

	if(nextImageNumber >= images.length) {
		nextImageNumber = 0;
	}
	if(nextImageNumber < 0) {
		nextImageNumber = images.length-1;
	}

	images.forEach(i => i.removeAttribute("class"));

	images[nextImageNumber].classList.add("currentImage");

	imagesContainer.dataset.currentimage = nextImageNumber;


	var basestar = parseInt(imagesContainer.parentElement.querySelector(".infoSyncPairRarity").textContent);

	if(imagesContainer.classList.contains("syncStar") && EGGMONMODE) {
		imagesContainer.dataset.currentstar = basestar + nextImageNumber;
	}
	if(imagesContainer.classList.contains("syncImages") && !EGGMONMODE) {
		if(imagesContainer.parentElement.querySelector(".infoTrainerName").textContent == "Player") {
			imagesContainer.parentElement.querySelector(".syncStar").dataset.currentstar = Math.floor(nextImageNumber/2) + basestar;
		} else {
			imagesContainer.parentElement.querySelector(".syncStar").dataset.currentstar = basestar + nextImageNumber;
		}
	}
}


function chooseFavorite(favorite) {
	var parent = favorite.parentElement;

	Array.from(parent.children).forEach(function(image, index) {
		if(image == favorite) {
			image.classList.add("currentImage");
			parent.dataset.currentimage = index + "";
		} else {
			image.removeAttribute("class")
		}
	});
}



/*-----------------------------------------------------------------------------
	FUNCTION FOR THE MANAGMENT OF THE SYNCPAIRS
-----------------------------------------------------------------------------*/

/* takes a ".syncpair" html element */
function select(syncpair) {
	syncpair.classList.add("selected");

	addToLocalStorage(syncpair);
}


/* takes a ".syncpair" html element */
function unselect(syncpair) {
	syncpair.classList.remove("selected");

	Array.from(syncpair.querySelector(".syncStar").children).forEach(c => c.classList.remove("currentImage"));
	Array.from(syncpair.querySelector(".syncFav").children).forEach(c => c.classList.remove("currentImage"));
	Array.from(syncpair.querySelector(".syncLevel").children).forEach(c => c.classList.remove("currentImage"));
	Array.from(syncpair.querySelector(".syncImages").children).forEach(c => c.classList.remove("currentImage"));

	syncpair.querySelector(".syncStar").children[0].classList.add("currentImage");
	syncpair.querySelector(".syncFav").children[0].classList.add("currentImage");
	syncpair.querySelector(".syncLevel").children[0].classList.add("currentImage");
	syncpair.querySelector(".syncImages").children[0].classList.add("currentImage");

	syncpair.querySelector(".syncStar").dataset.currentstar = syncpair.querySelector(".infoSyncPairRarity").textContent;
	syncpair.querySelector(".syncStar").dataset.currentimage = "0";
	syncpair.querySelector(".syncFav").dataset.currentimage = "0";
	syncpair.querySelector(".syncLevel").dataset.currentimage = "0";
	syncpair.querySelector(".syncImages").dataset.currentimage = "0";

	var keySyncPairStorage = syncpair.querySelector(".syncInfos .infoTrainerName").innerHTML + "|" + syncpair.querySelector(".syncInfos .infoPokemonNum").innerHTML;

	localStorage.removeItem(keySyncPairStorage);
}


/* takes a ".syncpair" html element and store the essentials informations in the data attribute in localstorage */
function addToLocalStorage(syncpair) {
	var keySyncPairStorage = syncpair.querySelector(".syncInfos .infoTrainerName").innerHTML + "|" + syncpair.querySelector(".syncInfos .infoPokemonNum").innerHTML;

	var currentSyncStar = syncpair.querySelector(".syncStar").dataset.currentimage;
	var currentSyncFav = syncpair.querySelector(".syncFav").dataset.currentimage;
	var currentSyncLevel = syncpair.querySelector(".syncLevel").dataset.currentimage;
	var currentSyncImage = syncpair.querySelector(".syncImages").dataset.currentimage;

	localStorage.setItem(keySyncPairStorage, currentSyncLevel + "|" + currentSyncImage + "|" + currentSyncStar + "|" + currentSyncFav);
}


/* takes all elements with a specific class (all, selected, found, notfound)
and insert the count in the corresponding output element */
function countSelection() {
	var totalSyncPairs, allSelected, allSelectedFound, allFound, allNotSelected, allNotSelectedFound;

	if((localStorage.getItem("datamineVisible") !== null) && (localStorage.getItem("datamineVisible") === "false")) {
		totalSyncPairs = parseInt(Array.from(document.querySelectorAll(".syncPair:not(.datamine)")).length);
		allSelected = parseInt(Array.from(document.querySelectorAll(".syncPair.selected:not(.datamine)")).length);
		allSelectedFound = parseInt(Array.from(document.querySelectorAll(".syncPair.selected.found:not(.datamine)")).length);
		allFound = parseInt(Array.from(document.querySelectorAll(".syncPair.found:not(.datamine)")).length);
		allNotSelected = totalSyncPairs-allSelected;
		allNotSelectedFound = allFound-allSelectedFound;
	} else {
		totalSyncPairs = parseInt(Array.from(document.querySelectorAll(".syncPair")).length);
		allSelected = parseInt(Array.from(document.querySelectorAll(".syncPair.selected")).length);
		allSelectedFound = parseInt(Array.from(document.querySelectorAll(".syncPair.selected.found")).length);
		allFound = parseInt(Array.from(document.querySelectorAll(".syncPair.found")).length);
		allNotSelected = totalSyncPairs-allSelected;
		allNotSelectedFound = allFound-allSelectedFound;		
	}
	if(document.getElementById("selectedVisible").classList.contains("btnYellow")) {
		totalSyncPairs = allSelected;
		allFound = allSelectedFound;
	}
	if(document.getElementById("notSelectedVisible").classList.contains("btnYellow")) {
		totalSyncPairs = allNotSelected;
		allSelected = allNotSelected;
		allSelectedFound = 0;
		allFound = allNotSelectedFound;
	}

	document.getElementById("counterSelected").innerHTML = `${allSelected} / ${totalSyncPairs}<span class="counterPercentage"> (${((allSelected/totalSyncPairs)*100).toFixed(1)}%)</span>`;

	if(allFound > 0) {
		document.getElementById("counterFound").innerHTML = `${allSelectedFound} / ${allFound}<span class="counterPercentage"> (${((allSelectedFound/allFound)*100).toFixed(1)}%)</span>`;
		document.getElementById("counterFoundTotal").innerHTML = `${allFound} / ${totalSyncPairs}<span class="counterPercentage"> (${((allFound/totalSyncPairs)*100).toFixed(1)}%)</span>`;
	} else {
		document.getElementById("counterFound").innerHTML = "";
		document.getElementById("counterFoundTotal").innerHTML = "";
	}

	document.getElementById("counterTotal").innerHTML = `Total : ${totalSyncPairs}`;
}


/* apply the unselect function to all syncpair */
function resetSelection() {

	var found = Array.from(document.getElementsByClassName("found"));

	if(parseInt(found.length) > 0 && confirm(`Unselect ${found.length} sync pairs ?\n(Sync level and Sync potential will be reset)`)) {
		found.forEach(s => unselect(s))
	} else if(parseInt(found.length) == 0 && confirm("Do you really want to unselect all sync pairs ?\n(Sync level and Sync potential will be reset)")) {
		Array.from(document.getElementsByClassName("syncPair")).forEach(s => unselect(s));
	}
	countSelection();
}


/* apply the select function to all syncpair */
function fullSelection() {

	var found = Array.from(document.getElementsByClassName("found"));

	if(parseInt(found.length) > 0 && confirm(`Select ${found.length} sync pairs ?`)) {
		found.forEach(s => select(s))
	} else if(parseInt(found.length) == 0 && confirm("Do you really want to select all sync pairs ?")) {
		Array.from(document.getElementsByClassName("syncPair")).forEach(s => select(s));
	}
	countSelection();
}


/* toggle the ".selected" class of all syncpairs and apply select/unselect function */
function invertSelection() {

	if(! confirm(`Do you really to want to invert your current selection ?\n(Sync level and Sync potential will be reset)`)) {
		return
	}

	var found = Array.from(document.getElementsByClassName("found"));

	if(parseInt(found.length) > 0) {
		found.forEach(function(s) {
			if(s.classList.contains("selected")) {
				unselect(s)
			} else { select(s) }
		});
	} else {
		Array.from(document.getElementsByClassName("syncPair")).forEach(function(s) {
			if(s.classList.contains("selected")) {
				unselect(s)
			} else { select(s) }
		});	
	}
	countSelection();
}


/* go through all selected elements, extract the needed informations and output them */
function exportSelection() {
	var exported = {};

	var filters = Array.from(document.getElementsByClassName("selectedFilter"));

	var searchValue = document.getElementById("search").value;
	if(searchValue !== "") { filters.push(searchValue); }

	if(parseInt(filters.length) > 0) {
		Array.from(document.getElementsByClassName("syncPair selected found")).forEach(function(s) {
			var key = s.querySelector(".syncInfos .infoTrainerName").innerHTML + "|" + s.querySelector(".syncInfos .infoPokemonNum").innerHTML;
			var value = s.querySelector(".syncLevel").dataset.currentimage + "|" + s.querySelector(".syncImages").dataset.currentimage + "|" + 
						s.querySelector(".syncStar").dataset.currentimage + "|" + s.querySelector(".syncFav").dataset.currentimage;

			exported[key] = value;
		})
	} else {
		Array.from(document.getElementsByClassName("syncPair selected")).forEach(function(s) {
			var key = s.querySelector(".syncInfos .infoTrainerName").innerHTML + "|" + s.querySelector(".syncInfos .infoPokemonNum").innerHTML;
			var value = s.querySelector(".syncLevel").dataset.currentimage + "|" + s.querySelector(".syncImages").dataset.currentimage + "|" + 
						s.querySelector(".syncStar").dataset.currentimage + "|" + s.querySelector(".syncFav").dataset.currentimage;

			exported[key] = value;
		})

		localStorage.setItem("syncPairsTrackerBackup", JSON.stringify(exported));
	}

	document.getElementById("exportImportZone").value = JSON.stringify(exported);

	importSelection();
}


/* takes the string (with the format from the export function) in the import textarea
go through all syncpairs and apply the need change to the elements */
function importSelection() {

	var imported;

	try {
		if(document.getElementById("exportImportZone").value == "") {
			imported = JSON.parse(localStorage.getItem("syncPairsTrackerBackup"));
		} else {
			imported = JSON.parse(document.getElementById("exportImportZone").value);
		}

		Array.from(document.getElementsByClassName("syncPair")).forEach(function(s) {
			var key = s.querySelector(".syncInfos .infoTrainerName").innerHTML + "|" + s.querySelector(".syncInfos .infoPokemonNum").innerHTML;

			if(key in imported) {
				var currentSyncData = imported[key].split("|");
				var importedSyncLevel = currentSyncData[0];
				var importedSyncImage = currentSyncData[1];
				var importedSyncStar = currentSyncData[2];
				var importedSyncFav = currentSyncData[3];

				if(isNaN(importedSyncLevel)) { importedSyncLevel = "0" }
				if(isNaN(importedSyncImage)) { importedSyncImage = "0" }
				if(isNaN(importedSyncStar)) { importedSyncStar = "0" }
				if(isNaN(importedSyncFav)) { importedSyncFav = "0" }

				var syncLevelDIV = s.querySelector(".syncLevel");
				var syncImagesDIV = s.querySelector(".syncImages");
				var syncStarDIV = s.querySelector(".syncStar");
				var syncFavDIV = s.querySelector(".syncFav");

				syncLevelDIV.dataset.currentimage = parseInt(importedSyncLevel);
				syncImagesDIV.dataset.currentimage = parseInt(importedSyncImage);
				syncStarDIV.dataset.currentimage = parseInt(importedSyncStar);
				syncFavDIV.dataset.currentimage = parseInt(importedSyncFav);

				var currentStar;
				var basestar = parseInt(s.querySelector(".infoSyncPairRarity").textContent);
				if(! EGGMONMODE) {
					if(s.querySelector(".infoTrainerName").textContent == "Player") {
						currentStar = Math.floor(importedSyncImage/2) + parseInt(basestar);
					} else {
						currentStar = parseInt(basestar) + parseInt(importedSyncImage);
					}
				} else { currentStar = parseInt(basestar) + parseInt(importedSyncStar); }
				syncStarDIV.dataset.currentstar = currentStar;

				Array.from(syncLevelDIV.children).forEach(c => c.classList.remove("currentImage"))
				Array.from(syncImagesDIV.children).forEach(c => c.classList.remove("currentImage"))
				Array.from(syncStarDIV.children).forEach(c => c.classList.remove("currentImage"))
				Array.from(syncFavDIV.children).forEach(c => c.classList.remove("currentImage"))

				syncLevelDIV.children[importedSyncLevel].classList.add("currentImage");
				syncImagesDIV.children[importedSyncImage].classList.add("currentImage");
				syncStarDIV.children[importedSyncStar].classList.add("currentImage");
				syncFavDIV.children[importedSyncFav].classList.add("currentImage");

				select(s);
			}
		});
		countSelection();

	} catch(e) { console.log(e); return; }
}


function swapElem(element, message1, message2, step) {

	var filters = Array.from(document.getElementsByClassName("selectedFilter"));

	var searchValue = document.getElementById("search").value;
	if(searchValue !== "") { filters.push(searchValue); }

	if(parseInt(filters.length) > 0 && confirm(message1)) {

		Array.from(document.getElementsByClassName("syncPair selected found")).forEach(function(s) {
			swapImages(s.querySelector(element), step)
			select(s);
		})
	} else if(parseInt(filters.length) == 0 && confirm(message2)) {
		Array.from(document.getElementsByClassName("syncPair selected")).forEach(function(s) {
			swapImages(s.querySelector(element), step)
			select(s);
		});
	}
}

function resetDefault(element, message1, message2) {

	var filters = Array.from(document.getElementsByClassName("selectedFilter"));

	var searchValue = document.getElementById("search").value;
	if(searchValue !== "") { filters.push(searchValue); }

	if(parseInt(filters.length) > 0 && confirm(message1)) {

		Array.from(document.getElementsByClassName("syncPair selected found")).forEach(function(s) {
			var imgs = Array.from(s.querySelector(element).children);
			imgs.forEach(f => f.removeAttribute("class"));
			imgs[0].classList.add("currentImage");
			s.querySelector(element).dataset.currentimage = "0";
			select(s);
		})
	} else if(parseInt(filters.length) == 0 && confirm(message2)) {
		Array.from(document.getElementsByClassName("syncPair selected")).forEach(function(s) {
			var imgs = Array.from(s.querySelector(element).children);
			imgs.forEach(f => f.removeAttribute("class"));
			imgs[0].classList.add("currentImage");
			s.querySelector(element).dataset.currentimage = "0";
			select(s);
		});
	}
}


function increaseFavorite() {
	var message1 = "Change the favorite color of all filtered sync pairs to the next color ?";
	var message2 = "Change the favorite color of all sync pairs to the next color ?";

	swapElem(".syncFav", message1, message2, 1);
}
function decreaseFavorite() {
	var message1 = "Change the favorite color of all filtered sync pairs to the previous color ?";
	var message2 = "Change the favorite color of all sync pairs to the previous color ?";

	swapElem(".syncFav", message1, message2, -1);
}
function resetFavorite() {
	var message1 = "Reset the favorite color of all filtered sync pairs ?";
	var message2 = "Reset the favorite color of all sync pairs ?";

	resetDefault(".syncFav", message1, message2);
}


function increaseSyncLevel() {
	var message1 = "Increase the sync level of all filtered sync pairs ?";
	var message2 = "Increase the sync level of all sync pairs ?";

	swapElem(".syncLevel", message1, message2, 1);
}
function decreaseSyncLevel() {
	var message1 = "Decrease the sync level of all filtered sync pairs ?";
	var message2 = "Decrease the sync level of all sync pairs ?";

	swapElem(".syncLevel", message1, message2, -1);
}
function resetSyncLevel() {
	var message1 = "Reset the sync level of all filtered sync pairs ?";
	var message2 = "Reset the sync level of all sync pairs ?";

	resetDefault(".syncLevel", message1, message2);
}


function increaseSyncStar() {
	var message1 = "Increase the potential of all filtered sync pairs ?";
	var message2 = "Increase the potential of all sync pairs ?";

	if(EGGMONMODE) {
		swapElem(".syncStar", message1, message2, 1);
	} else {
		swapElem(".syncImages", message1, message2, 1);		
	}
}
function decreaseSyncStar() {
	var message1 = "Decrease the potential of all filtered sync pairs ?";
	var message2 = "Decrease the potential of all sync pairs ?";

	if(EGGMONMODE) {
		swapElem(".syncStar", message1, message2, -1);
	} else {
		swapElem(".syncImages", message1, message2, -1);		
	}
}
function resetSyncStar() {
	var message1 = "Reset the potential of all filtered sync pairs ?";
	var message2 = "Reset the potential of all sync pairs ?";

	if(EGGMONMODE) {
		resetDefault(".syncStar", message1, message2);
	} else {
		resetDefault(".syncImages", message1, message2);
	}
}


function pairsVisible(id) {
	document.getElementById("allVisible").classList.remove("btnYellow");
	document.getElementById("selectedVisible").classList.remove("btnYellow");
	document.getElementById("notSelectedVisible").classList.remove("btnYellow");

	document.getElementById(id).classList.add("btnYellow");

	localStorage.setItem("visibilityMode", id);

	visibility();
}

function datamineVisible() {
	document.getElementById("datamineVisible").classList.toggle("btnYellow");

	localStorage.setItem("datamineVisible", !document.getElementById("datamineVisible").classList.contains("btnYellow"));

	Array.from(document.getElementsByClassName("datamine")).forEach(d => unselect(d))

	visibility();
}

function elementVisible(id) {
	document.getElementById(id).classList.toggle("btnYellow");

	localStorage.setItem(id, !document.getElementById(id).checked);

	visibility();
}

function visibility() {
	document.getElementById("visibilityMode").innerHTML = "";

	var css = {
		"allVisible": "",

		"selectedVisible" : `.syncPair:not([class*="selected"]) { display: none !important; }\n`,

		"notSelectedVisible": `.syncPair[class*="selected"] { display: none !important; }\n`,

		"datamineVisible": `.datamine { display: none !important; } #datamineVisible { text-decoration: line-through; text-decoration-thickness: 2px; }\n`,

		"counterPercentageVisible" : `.counterPercentage { display: none; }\n`,

		"syncFavsVisible" : `#buttonsFav, .syncFav { display: none !important; }\n`,

		"syncInfosVisible" : `.syncPair:hover > .syncInfos { display: none !important; }\n`,

		"fullWidthVisible" : `#main { width: 100%; } #rightSide { margin-left: 25%; width: 100%; }
								@media only screen and (max-width: 1600px) { #rightSide { margin-left: 30% } }
								@media only screen and (max-width: 1400px) { #rightSide { margin-left: 40% } }
								@media only screen and (max-width: 1200px) { #rightSide { margin-left: 50% } }
								@media only screen and (max-width: 1024px) { #rightSide { margin-left: auto } }`
	}

	var visibilityChoices = Array.from(document.getElementById("visibilityOptions").getElementsByClassName("btnYellow"));
	visibilityChoices.forEach(function(c) {
		document.getElementById("visibilityMode").innerHTML += css[c.id] + " ";
	})

	countSelection();
}

function loadVisibilityFromLocalStorage() {

	if(localStorage.getItem("darkMode") !== null) {
		document.getElementById("darkModeCss").disabled = !(localStorage.getItem("darkMode") === "true");
	}

	if(localStorage.getItem("lockMode") !== null) {
		document.getElementById("lockModeCss").disabled = !(localStorage.getItem("lockMode") === "true");
	}

	if(localStorage.getItem("viewMode") !== null) {
		document.getElementById("viewModeCss").disabled = !(localStorage.getItem("viewMode") === "true");
	}

	if(localStorage.getItem("visibilityMode") !== null) {
		document.getElementById(localStorage.getItem("visibilityMode")).click();
	}

	if((localStorage.getItem("datamineVisible") !== null) && (localStorage.getItem("datamineVisible") === "false")) {
		document.getElementById("datamineVisible").click();
	}

	if((localStorage.getItem("counterPercentageVisible") !== null) && (localStorage.getItem("counterPercentageVisible") === "false")) {
		document.getElementById("counterPercentageVisible").click();
	}

	if((localStorage.getItem("syncFavsVisible") !== null) && (localStorage.getItem("syncFavsVisible") === "false")) {
		document.getElementById("syncFavsVisible").click();
	}

	if((localStorage.getItem("syncInfosVisible") !== null) && (localStorage.getItem("syncInfosVisible") === "false")) {
		document.getElementById("syncInfosVisible").click();
	}

	if((localStorage.getItem("fullWidthVisible") !== null) && (localStorage.getItem("fullWidthVisible") === "false")) {
		document.getElementById("fullWidthVisible").click();
	}

}


function dateInterval() {

	searchFilters();

	var date1 = document.getElementById("date1").value;
	var date2 = document.getElementById("date2").value;

	if(date1 == "") { date1 = "2019-08-29"; }
	if(date2 == "") { date2 = "2023-12-31"; }

	var syncPairs;

	if(document.getElementsByClassName("selectedFilter").length > 0 || document.getElementById("search").value != "") {
		syncPairs = document.querySelectorAll(".syncPair.found");
	} else {
		syncPairs = document.getElementsByClassName('syncPair');
	}

	for(var i=0; i<syncPairs.length; i++) {

		var datePair = syncPairs[i].querySelector(".infoReleaseDate").textContent;

		if(FILTER_MODE == "&") {
			if(date1 <= datePair && datePair <= date2) {
				syncPairs[i].classList.add("found");
			} else {
				syncPairs[i].classList.remove("found");
				syncPairs[i].classList.add("notFound");
			}
		} else {
			if(date1 <= datePair && datePair <= date2) {
				syncPairs[i].classList.add("found");
				syncPairs[i].classList.remove("notFound");
			} else {
				syncPairs[i].classList.remove("found");
				syncPairs[i].classList.add("notFound");
			}
		}
	}

	document.getElementById("filtersUsed").innerHTML = `<span class="filterDate">📅 ${date1} → 📅 ${date2}</span>`;


	var selecteFilters = Array.from(document.getElementsByClassName("selectedFilter")).map(f => `<span>${f.innerHTML}</span>`);

	var searchValue = document.getElementById("search").value;
	if(searchValue != "") { selecteFilters.unshift(`<span>${searchValue}</span>`); }

	if(selecteFilters.length != 0) {
		document.getElementById("filtersUsed").innerHTML += " : " + selecteFilters.join(` ${FILTER_MODE} `);
	}

	document.getElementById("removeFilters").classList.add("btnRed");
	document.getElementById("mobileMenuFilters").classList.add("mobileMenu_selected");
	document.getElementById("removeFilters").innerHTML = `× filters (${selecteFilters.length + 1})`;

	countSelection();
}

function searchFiltersORdateInterval() {
	if(document.getElementById("btnDate").classList.contains("filterDateEnable")) {
		dateInterval();
	} else {
		searchFilters();
	}
}


function updateNews() {

	if(CURRENT_NEW < 0) { CURRENT_NEW = 0; }
	if(CURRENT_NEW > NEWS.length-2) { CURRENT_NEW = NEWS.length-2; }

	document.getElementById("newsList").innerHTML =
		`<li><span>${NEWS[CURRENT_NEW+1].date}</span><span>${NEWS[CURRENT_NEW+1].info.replaceAll("\n", "<br>")}</span></li>
		<li><span>${NEWS[CURRENT_NEW].date}</span><span>${NEWS[CURRENT_NEW].info.replaceAll("\n", "<br>")}</span></li>`;
}


/* takes a string to search through each syncpair outerHTML
input format : "search1,,search2,,search3"
for each syncpair outerHTML, search all filters */
function search(input) {

	var syncPairs = document.getElementsByClassName('syncPair');

	var filters = [];
	var hiddenFilters = [];

	input.split(",,").filter(Boolean).forEach(function(f) {
		if(f.charAt(0) == "!") { hiddenFilters.push(f.substring(1)); }
		else { filters.push(f); }
	})

	for(var i=0; i<syncPairs.length; i++) {
		var syncPair = syncPairs[i];
		syncPair.classList.remove("found");
		syncPair.classList.remove("notFound");

		if(FILTER_MODE == "&") {
			for(var e=0; e<filters.length; e++) {
				// replaceAll for the role of the eggs
				if(syncPair.outerHTML.replaceAll("&lt;&gt;","<>").toLowerCase().includes(filters[e].toLowerCase())) {
					syncPair.classList.add("found");
				} else {
					syncPair.classList.remove("found");
					syncPair.classList.add("notFound");
					break;
				}
			}
		} else {
			for(var e=0; e<filters.length; e++) {
				if(syncPair.classList.contains("found")) {
					continue;
				}
				// replaceAll for the role of the eggs
				if(syncPair.outerHTML.replaceAll("&lt;&gt;","<>").toLowerCase().includes(filters[e].toLowerCase())) {
					syncPair.classList.add("found");
					syncPair.classList.remove("notFound");
				} else {
					syncPair.classList.remove("found");
					syncPair.classList.add("notFound");
				}
			}			
		}
		for(var e=0; e<hiddenFilters.length; e++) {
			if(syncPair.outerHTML.replaceAll("&lt;&gt;","<>").toLowerCase().includes(hiddenFilters[e].toLowerCase())) {
				syncPair.classList.remove("found");
				syncPair.classList.add("notFound");
			} else if(!syncPair.classList.contains("found") && !syncPair.classList.contains("notFound")) {
				syncPair.classList.add("found");
			}
		}
	}
	countSelection()
}


/* get the string of all selectedFilter btn and search them
also show all filters within a span on the right place */
function searchFilters() {
	var filters = [];
	var filtersSPAN = [];

	Array.from(document.getElementsByClassName("selectedFilter")).forEach(function(f) {
		if(f.classList.contains("filterToHide")) {
			filters.push("!" + f.value);
			filtersSPAN.push(`<span class="filterHidden">${f.innerHTML}</span>`);
		} else {
			filters.push(f.value);
			filtersSPAN.push(`<span>${f.innerHTML}</span>`);
		}

	});

	var searchValue = document.getElementById("search").value;
	if(searchValue !== "") {
		filters.push('Name">'+searchValue);
		filtersSPAN.push(`<span>${searchValue}</span>`);		
	}
	
	document.getElementById("filtersUsed").innerHTML = filtersSPAN.join(` ${FILTER_MODE} `);

	search(filters.join(",,"));

	if(filters.length > 0) {
		document.getElementById("removeFilters").classList.add("btnRed");
		document.getElementById("mobileMenuFilters").classList.add("mobileMenu_selected");
		document.getElementById("removeFilters").innerHTML = `× filters (${filters.length})`;
	} else {
		document.getElementById("removeFilters").classList.remove("btnRed");
		document.getElementById("mobileMenuFilters").classList.remove("mobileMenu_selected");
		document.getElementById("removeFilters").innerHTML = `× filters`
	}
}


function filterMode() {
	if(FILTER_MODE == "&") {
		FILTER_MODE = "|";
		document.getElementById("filterMode").innerHTML = `Mode : OR<span class="tooltiptext">Search has to match at least one filter</span>`;
	}
	else if(FILTER_MODE == "|") {
		FILTER_MODE = "&";
		document.getElementById("filterMode").innerHTML = `Mode : AND<span class="tooltiptext">Search has to match all filters</span>`;
	}

	searchFiltersORdateInterval();
}


/* just remove the selectedFilter class of all current filters */
function removeFilters() {
	document.getElementById("search").value = "";
	Array.from(document.getElementsByClassName("selectedFilter")).forEach(f => f.classList.remove("selectedFilter"));
	Array.from(document.getElementsByClassName("filterToHide")).forEach(f => f.classList.remove("filterToHide"));
	document.getElementById("btnDate").classList.remove("filterDateEnable");
	searchFiltersORdateInterval();
}


/* Separators */
function showSeparator(dataToSeparate) {
	removeSeparator();

	var syncPairs = Array.from(document.getElementsByClassName("syncPair"));
	var inner = "", inner2 = "";

	for(var i=syncPairs.length-1; i>0; i--) {
		var curr_pair = syncPairs[i];
		var prev_pair = syncPairs[i-1];

		switch(dataToSeparate) {
			case ".syncStar":
				inner = `<img src="${syncStarImgs2[parseInt(curr_pair.querySelector(dataToSeparate).dataset.currentstar)-1]}">`;
				inner2 = `<img src="${syncStarImgs2[parseInt(prev_pair.querySelector(dataToSeparate).dataset.currentstar)-1]}">`;
				break;

			case ".syncLevel":
				inner = `<img src="${syncLevelImgs[parseInt(curr_pair.querySelector(dataToSeparate).dataset.currentimage)]}">`;
				inner2 = `<img src="${syncLevelImgs[parseInt(prev_pair.querySelector(dataToSeparate).dataset.currentimage)]}">`;
				break;

			case ".syncFav":
				inner = `<img src="${syncFavImgs[parseInt(curr_pair.querySelector(dataToSeparate).dataset.currentimage)]}">`;
				inner2 = `<img src="${syncFavImgs[parseInt(prev_pair.querySelector(dataToSeparate).dataset.currentimage)]}">`;
				break;

			case ".selected":
				inner = curr_pair.classList.contains("selected").toString().replace("true","Have").replace("false","Not have");
				inner2 = prev_pair.classList.contains("selected").toString().replace("true","Have").replace("false","Not have");
				break;

			default:
				inner = curr_pair.querySelector(dataToSeparate).innerHTML.replace("Special Strike", "Strike").replace("Physical Strike", "Strike");
				inner2 = prev_pair.querySelector(dataToSeparate).innerHTML.replace("Special Strike", "Strike").replace("Physical Strike", "Strike")
		}

		if(inner != inner2) {
			curr_pair.insertAdjacentHTML("beforebegin", `<div class="separator"><span>${inner}</span></div>`);
		}
	}
	syncPairs[0].insertAdjacentHTML("beforebegin", `<div class="separator"><span>${inner2}</span></div>`);
}

function removeSeparator() {
	Array.from(document.getElementsByClassName("separator")).forEach(s => s.remove());
}


function lockMode() {
	var isDisabled = document.getElementById("lockModeCss").disabled;
	document.getElementById("lockModeCss").disabled = !isDisabled;

	localStorage.setItem("lockMode", isDisabled);

	document.getElementById("selectionBtns").classList.remove("btnBlue");
	document.getElementById("increaseBtns").classList.remove("btnBlue");
	document.getElementById("increaseOptions").classList.add("hide");
	document.getElementById("selectionOptions").classList.add("hide");
}

function viewMode() {
	var isDisabled = document.getElementById("viewModeCss").disabled;
	document.getElementById("viewModeCss").disabled = !isDisabled;

	localStorage.setItem("viewMode", isDisabled);

	document.getElementById("selectionBtns").classList.remove("btnBlue");
	document.getElementById("increaseBtns").classList.remove("btnBlue");
	document.getElementById("exportImportBtns").classList.remove("btnBlue");
	document.getElementById("increaseOptions").classList.add("hide");
	document.getElementById("selectionOptions").classList.add("hide");
	document.getElementById("exportImportDiv").classList.add("hide");
}


function exportImportOptions() {
	document.getElementById("exportImportBtns").classList.toggle("btnBlue");
	document.getElementById("exportImportDiv").classList.toggle("hide");

	document.getElementById("selectionBtns").classList.remove("btnBlue");
	document.getElementById("increaseBtns").classList.remove("btnBlue");
	document.getElementById("visibilityBtns").classList.remove("btnBlue");
	document.getElementById("increaseOptions").classList.add("hide");
	document.getElementById("selectionOptions").classList.add("hide");
	document.getElementById("visibilityOptions").classList.add("hide");
}


function showSorting() {
	document.getElementById("showSorting").classList.toggle("btnBlue");
	document.getElementById("sorting").classList.toggle("sortingVisible");

	document.getElementById("selectionBtns").classList.remove("btnBlue");
	document.getElementById("increaseBtns").classList.remove("btnBlue");
	document.getElementById("visibilityBtns").classList.remove("btnBlue");
	document.getElementById("increaseOptions").classList.add("hide");
	document.getElementById("selectionOptions").classList.add("hide");
	document.getElementById("visibilityOptions").classList.add("hide");
}


/* use html2canvas to take screenshot */
function takeScreenshot(id) {
	document.getElementById("image_rotate").classList.remove("hide");
	document.getElementById("image_done").classList.add("hide");

	document.getElementById("screenshot").classList.add("hide");
	document.getElementById("counter").classList.add("forScreenshot");
	document.getElementById("syncPairs").classList.add("forScreenshot");
	document.getElementById("linkTool").classList.remove("hide");

	if(document.getElementsByClassName("selectedFilter").length > 0) {
		document.getElementById("counterSelected").classList.add("hide");
		document.getElementById("counterTotal").classList.add("hide");
	}

	html2canvas(document.getElementById('rightSide'),{
			backgroundColor:null,
			windowWidth:1920,
			windowHeight:1080,
			scale:1
		}).then(canvas => {

			canvas.toBlob((blob) => {

				if(id == "takeScreenshot") {
					document.getElementById("screenshot").classList.remove("hide");
					document.getElementById("screenshot").innerHTML = "<p>Your image :</p>";
				
					var url = URL.createObjectURL(blob);
					var img = document.createElement('img');

					img.src = url;
					img.setAttribute("draggable", "false");

					document.getElementById("screenshot").appendChild(img);
					document.getElementById("screenshot").scrollIntoView(true);

				} else if(id == "takeScreenshot2") {
					document.getElementById("screenshot").classList.add("hide");
					document.getElementById("screenshot").innerHTML = "";
					
					var url = URL.createObjectURL(blob);
					var link = document.createElement('a');

					link.onload = () => { URL.revokeObjectURL(url); };
					link.href = url;
					link.download = "SyncPairsTracker.png";

					document.body.appendChild(link);
					link.click();
					document.body.removeChild(link);
				}
			});

			document.getElementById("counter").classList.remove("forScreenshot");
			document.getElementById("syncPairs").classList.add("forScreenshot");
			document.getElementById("linkTool").classList.add("hide");

			document.getElementById("counterSelected").classList.remove("hide");
			document.getElementById("counterTotal").classList.remove("hide");

			document.getElementById("leftSide").classList.remove("leftSideVisible");

			document.getElementById("image_rotate").classList.add("hide");
			document.getElementById("image_done").classList.remove("hide");
	});
}



/*-----------------------------------------------------------------------------
	EVENTS LISTENERS
-----------------------------------------------------------------------------*/

/* add eventlisteners to all filters buttons */
function addEventButtonsFilters() {
	
	var filtersBtns = Array.from(document.getElementById("filters").getElementsByTagName("button"));

	filtersBtns.forEach(b => b.addEventListener("click", function() {

		if(!b.classList.contains("selectedFilter") && !b.classList.contains("filterToHide")) {
			b.classList.add("selectedFilter");
			b.classList.remove("filterToHide");

		} else if(b.classList.contains("selectedFilter") && !b.classList.contains("filterToHide")) {
			b.classList.add("filterToHide");

		} else if(b.classList.contains("selectedFilter") && b.classList.contains("filterToHide")) {
			b.classList.remove("selectedFilter");
			b.classList.remove("filterToHide");
		}
		searchFiltersORdateInterval();
	}))
}

function addEventButtonsSorting() {
	var sortBtns = Array.from(document.getElementById("sorting").getElementsByTagName("button"));
	sortBtns.forEach(b => b.addEventListener("click", function() {

		sortBtns.forEach(b => b.classList.remove("btnBlue"));

		b.classList.add("btnBlue");
	}))
}

function addEventGroupBtns() {
	Array.from(document.getElementsByClassName("buttonGroupTitle")).forEach(g => g.addEventListener("click", function() {
			var parent = g.parentElement;
			if(parent.id != "userBtns") {
				parent.classList.toggle("groupClose");
			}
		})
	)
	Array.from(document.getElementsByClassName("buttonGroupTitle2")).forEach(g => g.addEventListener("click", function() {
			g.parentElement.classList.toggle("groupClose");
		})
	)
}

/* add onerror event on all images and prevent from being draggable */
function addEventBaseImages() {
	Array.from(document.getElementsByTagName("img")).forEach(i => i.addEventListener("error", function() {
		i.src = "images/empty.png"
	}));
}

function selectionBtns() {
	document.getElementById("selectionBtns").classList.toggle("btnBlue");
	document.getElementById("selectionOptions").classList.toggle("hide");

	document.getElementById("exportImportBtns").classList.remove("btnBlue");
	document.getElementById("exportImportDiv").classList.add("hide");

	document.getElementById("showSorting").classList.remove("btnBlue");
	document.getElementById("sorting").classList.remove("sortingVisible");
}

function increaseOptions() {
	document.getElementById("increaseBtns").classList.toggle("btnBlue");
	document.getElementById("increaseOptions").classList.toggle("hide");

	document.getElementById("exportImportBtns").classList.remove("btnBlue");
	document.getElementById("exportImportDiv").classList.add("hide");

	document.getElementById("showSorting").classList.remove("btnBlue");
	document.getElementById("sorting").classList.remove("sortingVisible");
}

function visibilityOptions() {
	document.getElementById("visibilityBtns").classList.toggle("btnBlue");
	document.getElementById("visibilityOptions").classList.toggle("hide");

	document.getElementById("exportImportBtns").classList.remove("btnBlue");
	document.getElementById("exportImportDiv").classList.add("hide");

	document.getElementById("showSorting").classList.remove("btnBlue");
	document.getElementById("sorting").classList.remove("sortingVisible");
}


/* Egg Mode */
document.getElementById("btnEggs").addEventListener("click", function() {

	if(this.classList.contains("btnEggsON")) {
		EGGMONMODE = false;
		generatePairs(SYNCPAIRS);
		this.classList.remove("btnEggsON");
	} else {
		EGGMONMODE = true;
		generatePairs(EGGS);
		this.classList.add("btnEggsON");
	}
})


document.getElementById("previousNews").addEventListener("click", function() { CURRENT_NEW++; updateNews(); });
document.getElementById("nextNews").addEventListener("click", function() { CURRENT_NEW--; updateNews(); });

document.getElementById("selectionBtns").addEventListener("click", selectionBtns);

document.getElementById("fullSelection").addEventListener("click", fullSelection);
document.getElementById("resetSelection").addEventListener("click", resetSelection)
document.getElementById("invertSelection").addEventListener("click", invertSelection);

document.getElementById("increaseBtns").addEventListener("click", increaseOptions);

document.getElementById("increaseSyncStar").addEventListener("click", increaseSyncStar);
document.getElementById("increaseSyncLevel").addEventListener("click", increaseSyncLevel);
document.getElementById("increaseFavorite").addEventListener("click", increaseFavorite);

document.getElementById("decreaseSyncStar").addEventListener("click", decreaseSyncStar);
document.getElementById("decreaseSyncLevel").addEventListener("click", decreaseSyncLevel);
document.getElementById("decreaseFavorite").addEventListener("click", decreaseFavorite);

document.getElementById("resetSyncStar").addEventListener("click", resetSyncStar);
document.getElementById("resetSyncLevel").addEventListener("click", resetSyncLevel);
document.getElementById("resetFavorite").addEventListener("click", resetFavorite);

document.getElementById("visibilityBtns").addEventListener("click", visibilityOptions);

document.getElementById("allVisible").addEventListener("click", function() { pairsVisible(this.id); });
document.getElementById("selectedVisible").addEventListener("click", function() { pairsVisible(this.id); });
document.getElementById("notSelectedVisible").addEventListener("click", function() { pairsVisible(this.id); });

document.getElementById("datamineVisible").addEventListener("click", datamineVisible);

document.getElementById("counterPercentageVisible").addEventListener("click", function() { elementVisible(this.id); });
document.getElementById("syncFavsVisible").addEventListener("click", function() { elementVisible(this.id); });
document.getElementById("syncInfosVisible").addEventListener("click", function() { elementVisible(this.id); });
document.getElementById("fullWidthVisible").addEventListener("click", function() { elementVisible(this.id); });

document.getElementById("exportImportBtns").addEventListener("click", exportImportOptions);

document.getElementById("exportSelection").addEventListener("click", exportSelection);

document.getElementById("importSelection").addEventListener("click", importSelection);

document.getElementById("takeScreenshot").addEventListener("click", function() { takeScreenshot(this.id); });
document.getElementById("takeScreenshot2").addEventListener("click", function() { takeScreenshot(this.id); });

document.getElementById("lockMode").addEventListener("click", lockMode);
document.getElementById("viewMode").addEventListener("click", viewMode);

document.getElementById("showSorting").addEventListener("click", showSorting);

document.getElementById("filterMode").addEventListener("click", filterMode);

document.getElementById("removeFilters").addEventListener("click", removeFilters);
document.getElementById("removeFilters2").addEventListener("click", removeFilters);

document.getElementById("btnDate").addEventListener("click",  function() {
	document.getElementById("btnDate").classList.toggle("filterDateEnable");
	searchFiltersORdateInterval();
});

document.getElementById("date1").addEventListener("change", searchFiltersORdateInterval);
document.getElementById("date2").addEventListener("change", searchFiltersORdateInterval);


document.getElementById("sortByDexNumber").addEventListener("click", function() {
	var ord;
	if(this.dataset.asc === "true") { ord = "asc"; }
	else { ord = "desc"; }

	tinysort('.syncPair',{attr:'data-id',order:ord});

	this.dataset.asc = !(this.dataset.asc === "true");

	if(document.getElementById("showSeparator").checked) { showSeparator(".infoDexNum"); }
})

/* contains all pair of [btn_id, class_el_to_sort] */
var sortBtns = [
	["sortByPokemonNumber","infoPokemonNum"],
	["sortByTrainer","infoTrainerName"],
	["sortByDate","infoReleaseDate"]
]

/* for each sort button, add an eventlistener that call a function that
sort the related class with asc/desc order stored in data attribute */
sortBtns.forEach(btn => document.getElementById(btn[0]).addEventListener("click", function() {

	if(this.dataset.asc === "true") {
		tinysort('.syncPair',{sortFunction:function(a,b){
			var lenA = a.elm.querySelector(".syncInfos ." + btn[1]).innerHTML;
			var lenB = b.elm.querySelector(".syncInfos ." + btn[1]).innerHTML;
			return lenA===lenB?0:(lenA>lenB?1:-1);
		}});
	} else {
		tinysort('.syncPair',{sortFunction:function(a,b){
			var lenA = a.elm.querySelector(".syncInfos ." + btn[1]).innerHTML;
			var lenB = b.elm.querySelector(".syncInfos ." + btn[1]).innerHTML;
			return lenA===lenB?0:(lenA<lenB?1:-1);
		}});
	}
	this.dataset.asc = !(this.dataset.asc === "true");

	if(document.getElementById("showSeparator").checked) { showSeparator("."+btn[1]); }
}))

/* contains all pair of [btn_id, class_el_to_sort] */
var sortTypes = [
	["sortByType","infoPokemonType"],
	["sortByWeakness","infoPokemonWeak"],
	["sortByRole","infoSyncPairRole"],
	["sortByRegion","infoSyncPairRegion"]
]

/* for each sort button, add an eventlistener that call a function that
sort the related class with asc/desc order stored in data attribute */
sortTypes.forEach(btn => document.getElementById(btn[0]).addEventListener("click", function() {

	if(this.dataset.asc === "true") {
		tinysort('.syncPair',{sortFunction:function(a,b){
			var lenA = a.elm.querySelector(".syncInfos ." + btn[1]).dataset.order;
			var lenB = b.elm.querySelector(".syncInfos ." + btn[1]).dataset.order;
			return lenA===lenB?0:(lenA>lenB?1:-1);
		}});
	} else {
		tinysort('.syncPair',{sortFunction:function(a,b){
			var lenA = a.elm.querySelector(".syncInfos ." + btn[1]).dataset.order;
			var lenB = b.elm.querySelector(".syncInfos ." + btn[1]).dataset.order;
			return lenA===lenB?0:(lenA<lenB?1:-1);
		}});
	}
	this.dataset.asc = !(this.dataset.asc === "true");

	if(document.getElementById("showSeparator").checked) { showSeparator("."+btn[1]); }
}))

document.getElementById("sortByStar").addEventListener("click", function() {
	tinysort('.syncPair',{sortFunction:funByCurrentStar});

	function funByCurrentStar(a,b){
		var lenA = parseInt(a.elm.querySelector(".syncStar").dataset.currentstar);
		var lenB = parseInt(b.elm.querySelector(".syncStar").dataset.currentstar);
		if(document.getElementById("sortByStar").dataset.asc === "true") {
			return lenA===lenB?0:(lenA>lenB?1:-1);
		} else {
			return lenA===lenB?0:(lenA<lenB?1:-1);
		}
	}
	this.dataset.asc = !(this.dataset.asc === "true");

	if(document.getElementById("showSeparator").checked) { showSeparator(".syncStar"); }
})

document.getElementById("sortBySyncLevel").addEventListener("click", function() {
	tinysort('.syncPair',{sortFunction:funBySyncLevel});

	function funBySyncLevel(a,b){
		var lenA = parseInt(a.elm.querySelector(".syncLevel").dataset.currentimage);
		var lenB = parseInt(b.elm.querySelector(".syncLevel").dataset.currentimage);
		if(document.getElementById("sortBySyncLevel").dataset.asc === "true") {
			return lenA===lenB?0:(lenA>lenB?1:-1);
		} else {
			return lenA===lenB?0:(lenA<lenB?1:-1);
		}
	}
	this.dataset.asc = !(this.dataset.asc === "true");

	if(document.getElementById("showSeparator").checked) { showSeparator(".syncLevel"); }
})

document.getElementById("sortByFavorite").addEventListener("click", function() {
	tinysort('.syncPair',{sortFunction:funByFavorite});

	function funByFavorite(a,b){
		var lenA = parseInt(a.elm.querySelector(".syncFav").dataset.currentimage);
		var lenB = parseInt(b.elm.querySelector(".syncFav").dataset.currentimage);
		if(document.getElementById("sortByFavorite").dataset.asc === "true") {
			return lenA===lenB?0:(lenA>lenB?1:-1);
		} else {
			return lenA===lenB?0:(lenA<lenB?1:-1);
		}
	}
	this.dataset.asc = !(this.dataset.asc === "true");

	if(document.getElementById("showSeparator").checked) { showSeparator(".syncFav"); }
})

document.getElementById("sortBySelected").addEventListener("click", function() {
	
	if(this.dataset.asc === "true") {
		tinysort('.syncPair',{attr:'class',order:'asc'});
	} else {
		tinysort('.syncPair',{attr:'class',order:'desc'});
	}
	this.dataset.asc = !(this.dataset.asc === "true");

	if(document.getElementById("showSeparator").checked) { showSeparator(".selected"); }
})

document.getElementById("showSeparator").addEventListener("click", function() {

	removeSeparator();

	var selectedBtn = document.getElementById("sorting").querySelector(".btnBlue");

	selectedBtn.dataset.asc = !(selectedBtn.dataset.asc === "true");
	selectedBtn.click();
})


/* Search Bar */
document.getElementById("search").addEventListener("keyup", function() {
	if(document.getElementById("btnDate").classList.contains("filterDateEnable")) {
		setTimeout(dateInterval, 250);
	} else {
		setTimeout(searchFilters, 250);
	}
})


/* Dark Mode button */
document.getElementById("btnDarkMode").addEventListener("click", function() {

	var isDisabled = document.getElementById("darkModeCss").disabled;
	document.getElementById("darkModeCss").disabled = !isDisabled;

	localStorage.setItem("darkMode", isDisabled);
})


const observer = new IntersectionObserver( 
  ([e]) => e.target.classList.toggle("optionsSticky", e.intersectionRatio < 1),
  { threshold: [1] }
);

observer.observe(document.getElementById("options"));


/* Mobile Menu */
document.getElementById("mobileMenuHome").addEventListener("click", function() {

	document.getElementById("leftSide").classList.remove("leftSideVisible");
})

document.getElementById("mobileMenuFilters").addEventListener("click", function() {

	document.getElementById("leftSide").classList.add("leftSideVisible");

	document.getElementById("leftSideTop").innerHTML = "<p>Filters</p>"
	document.getElementById("removeFilters2").classList.remove("hide");

	document.getElementById("version").classList.add("hide");
	document.getElementById("btnEggs").classList.add("hide");
	document.getElementById("news").classList.add("hide");
	document.getElementById("filters").classList.remove("hide");
	document.getElementById("options").classList.add("hide");
	document.getElementById("credits").classList.add("hide");
	document.getElementById("btnDarkMode").classList.add("hide");
})

document.getElementById("mobileMenuOptions").addEventListener("click", function() {

	document.getElementById("leftSide").classList.add("leftSideVisible");

	document.getElementById("leftSideTop").innerHTML = "<p>Options</p>"
	document.getElementById("removeFilters2").classList.add("hide");

	document.getElementById("version").classList.remove("hide");
	document.getElementById("btnEggs").classList.remove("hide");
	document.getElementById("news").classList.remove("hide");
	document.getElementById("filters").classList.add("hide");
	document.getElementById("options").classList.remove("hide");
	document.getElementById("credits").classList.remove("hide");
	document.getElementById("btnDarkMode").classList.remove("hide");
})


/*-----------------------------------------------------------------------------
	INIT
-----------------------------------------------------------------------------*/

function generatePairs(pairs) {
	generatePairsHTML(pairs);

	addSyncPairsEvents();

	addEventBaseImages();

	countSelection();

	removeFilters();
}


function init() {

	document.getElementById("version").innerHTML = VERSION;
	document.getElementById("linkToolVer").innerHTML = VERSION;

	document.getElementById('date1').valueAsDate = new Date("2019-08-29");
	document.getElementById('date2').valueAsDate = new Date();

	loadVisibilityFromLocalStorage();

	updateNews();

	generatePairs(SYNCPAIRS);

	addEventButtonsFilters();

	addEventButtonsSorting();

	addEventGroupBtns();
}


window.onload = init;
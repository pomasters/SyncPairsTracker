import {SYNCPAIRS} from './syncpairs.js';
import {EGGS} from './eggs.js';

const syncLevelImgs = ["images/1.png","images/2.png","images/3.png","images/4.png","images/5.png"];
const syncStarImgs = ["images/star/1.png","images/star/2.png","images/star/3.png","images/star/4.png","images/star/5.png"];
const syncFavImgs = ["images/favorite1.png","images/favoriteG.png","images/favoriteY.png","images/favoriteO.png","images/favoriteR.png","images/favoriteV.png","images/favoriteB.png","images/favorite2.png"];
const typesOrder = {"normal":"01","fire":"02","water":"03","electric":"04","grass":"05","ice":"06","fighting":"07","poison":"08","ground":"09","flying":"10","psychic":"11","bug":"12","rock":"13","ghost":"14","dragon":"15","dark":"16","steel":"17","fairy":"18"};


/*-----------------------------------------------------------------------------
	GENERATE ALL HTML ELEMENTS ABOUT THE SYNCPAIRS
-----------------------------------------------------------------------------*/

/* parameter "pairs" is the array containing all {syncpair} -- see syncpairs.js/eggs.js */
function generatePairsHTML(pairs, eggs) {

	var result = "";
	var hideStar = "";

	if(! eggs) { hideStar = "hide" }

	for(var i=0; i<pairs.length; i++) {
		var syncPair = pairs[i];
		var keySyncPairStorage = syncPair.trainerName + "|" + syncPair.pokemonNumber;

		var selected = ""; //to enable the selected class or not
		var innerHtmlImages = 
			`<div class="syncStar ${hideStar}" data-currentImage="0">
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

			selected = " selected";
			innerHtmlImages = 
				`<div class="syncStar ${hideStar}" data-currentImage="${currentSyncStar}">
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
		}


		result += `
			<div class="syncPair${selected}" data-id="${i}">

				${innerHtmlImages}

				<div class="syncInfos">
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
					<p class="infoSyncPairRole">${syncPair.syncPairRole}</p>
					<p class="infoSyncPairRarity">${syncPair.syncPairRarity}</p>
					<p class="infoReleaseDate">${syncPair.releaseDate}</p>
					<p class="infoSyncPairRegion">${syncPair.syncPairRegion}</p>
					<p class="infoSyncPairTags">${tags(syncPair.tags)}</p>
				</div>
			</div>
		`;
	}

	/* generate all <img> of an array of images src and
	add the "currentImage" class to image at index "current_i" */
	function genImages(imgs, current_i) {
		var im = "";
		var current_im = current_i;
		if(current_im >= imgs.length) { current_im = imgs.length-1; }
		if(imgs.length == 0) return `<img draggable="false" src="images/empty.png" class="currentImage">`

		for(var i=0; i<imgs.length; i++) {
			if(i==current_im) { im += `<img draggable="false" src="${imgs[i]}" class="currentImage">`
			} else { im += `<img  draggable="false" src="${imgs[i]}">`	}
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

		if(! (localStorage.getItem("viewMode") === "true")) {
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
		if(si.parentElement.classList.contains("selected") && ! (localStorage.getItem("viewMode") === "true")) {
			swapImages(si)
			addToLocalStorage(si.parentElement);
		}
	}
}


/* takes a <div> containing <img> elements and move the "currentImage" class through the images */
function swapImages(imagesContainer) {
	var images = Array.from(imagesContainer.children);
	var nextImageNumber = parseInt(imagesContainer.dataset.currentimage) + 1;

	if(nextImageNumber >= images.length) {
		nextImageNumber = "0";
	}
	if(nextImageNumber < 0) {
		nextImageNumber = ""+images.length-1;
	}

	images.forEach(i => i.removeAttribute("class"));

	images[nextImageNumber].classList.add("currentImage");

	imagesContainer.dataset.currentimage = nextImageNumber + "";
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
	var totalSyncPairs = parseInt(Array.from(document.getElementsByClassName("syncPair")).length);
	var allSelected = parseInt(Array.from(document.getElementsByClassName("selected")).length);
	var allSelectedFound = parseInt(Array.from(document.getElementsByClassName("selected found")).length);
	var allFound = parseInt(Array.from(document.getElementsByClassName("found")).length);

	document.getElementById("counterSelected").innerHTML = `${allSelected} / ${totalSyncPairs} (${((allSelected/totalSyncPairs)*100).toFixed(1)}%)`;

	if(allFound > 0) {
		document.getElementById("counterFound").innerHTML = `${allSelectedFound} / ${allFound} (${((allSelectedFound/allFound)*100).toFixed(1)}%)`;
		document.getElementById("counterFoundTotal").innerHTML = `${allFound} / ${totalSyncPairs} (${((allFound/totalSyncPairs)*100).toFixed(1)}%)`;
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

	document.getElementById("exportImportZone").classList.remove("hide");

	importSelection();
}


/* takes the string (with the format from the export function) in the import textarea
go through all syncpairs and apply the need change to the elements */
function importSelection() {
	if(document.getElementById("exportImportZone").classList.contains("hide")) {
		document.getElementById("exportImportZone").classList.remove("hide");

	} else {
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
}


function increaseFavorite() {

	var filters = Array.from(document.getElementsByClassName("selectedFilter"));

	var searchValue = document.getElementById("search").value;
	if(searchValue !== "") { filters.push(searchValue); }

	if(parseInt(filters.length) > 0 && confirm("Change the current favorite color of all filtered sync pairs to the next color ?")) {

		Array.from(document.getElementsByClassName("syncPair selected found")).forEach(function(s) {
			swapImages(s.querySelector(".syncFav"))
			select(s);
		})
	} else if(parseInt(filters.length) == 0 && confirm("Change the current favorite color of all your sync pairs to the next color ?")) {
		Array.from(document.getElementsByClassName("syncPair selected")).forEach(function(s) {
			swapImages(s.querySelector(".syncFav"))
			select(s);
		});
	}
}


function increaseSyncLevel() {

	var filters = Array.from(document.getElementsByClassName("selectedFilter"));

	var searchValue = document.getElementById("search").value;
	if(searchValue !== "") { filters.push(searchValue); }

	if(parseInt(filters.length) > 0 && confirm("Do you really want to increase the sync level of all filtered sync pairs ?")) {

		Array.from(document.getElementsByClassName("syncPair selected found")).forEach(function(s) {
			swapImages(s.querySelector(".syncLevel"))
			select(s);
		})
	} else if(parseInt(filters.length) == 0 && confirm("Do you really want to increase the sync level of all selected sync pairs ?")) {
		Array.from(document.getElementsByClassName("syncPair selected")).forEach(function(s) {
			swapImages(s.querySelector(".syncLevel"))
			select(s);
		});
	}
}


function increaseSyncStar() {

	var filters = Array.from(document.getElementsByClassName("selectedFilter"));

	var searchValue = document.getElementById("search").value;
	if(searchValue !== "") { filters.push(searchValue); }

	if(parseInt(filters.length) > 0 && confirm("Do you really want to increase the potential of all filtered sync pairs ?")) {

		Array.from(document.getElementsByClassName("syncPair selected found")).forEach(function(s) {
			if(s.querySelector(".syncStar").classList.contains("hide")) {
				swapImages(s.querySelector(".syncImages"))
				select(s);
			} else {
				swapImages(s.querySelector(".syncStar"))
				select(s);
			}
		})
	} else if(parseInt(filters.length) == 0	&& confirm("Do you really want to increase the potential of all selected sync pairs ?")) {
		Array.from(document.getElementsByClassName("syncPair selected")).forEach(function(s) {
			if(s.querySelector(".syncStar").classList.contains("hide")) {
				swapImages(s.querySelector(".syncImages"))
				select(s);
			} else {
				swapImages(s.querySelector(".syncStar"))
				select(s);
			}
		});
	}
}


/* takes a string to search through each syncpair outerHTML
input format : "search1,,search2,,search3"
for each syncpair outerHTML, search all filters */
function search(input) {
	var filter = input.split(",,").filter(Boolean);

	var syncPairs = document.getElementsByClassName('syncPair');

	// if search for "", just remove all "found" "notFound" classes
	if(filter.length == 0) {
		for(var s=0; s<syncPairs.length; s++) {
			syncPairs[s].classList.remove("found");
			syncPairs[s].classList.remove("notFound");
		}
		countSelection()
		return;
	}

	for(var i=0; i<syncPairs.length; i++) {

		for(var e=0; e<filter.length; e++) {
			// replaceAll for the role of the eggs
			if(syncPairs[i].outerHTML.replaceAll("&lt;&gt;","<>").toLowerCase().indexOf(filter[e].toLowerCase()) > -1) {
				syncPairs[i].classList.add("found");
			} else {
				syncPairs[i].classList.remove("found");
				syncPairs[i].classList.add("notFound");
				break;
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
		filters.push(f.value);
		filtersSPAN.push(`<span>${f.innerHTML}</span>`)
	});

	var searchValue = document.getElementById("search").value;
	if(searchValue !== "") {
		filters.push('Name">'+searchValue);
		filtersSPAN.push(`<span>${searchValue}</span>`);		
	}
	
	document.getElementById("filtersUsed").innerHTML = filtersSPAN.join(" & ");

	search(filters.join(",,"));

	if(filters.length > 0) {
		document.getElementById("removeFilters").classList.add("btnRed");
		document.getElementById("removeFilters").innerHTML = `× filters (${filters.length})`;
	} else {
		document.getElementById("removeFilters").classList.remove("btnRed");
		document.getElementById("removeFilters").innerHTML = `× filters`
	}
}


/* just remove the selectedFilter class of all current filters */
function removeFilters() {
	document.getElementById("search").value = "";
	Array.from(document.getElementsByClassName("selectedFilter")).forEach(f => f.classList.remove("selectedFilter"));
	searchFilters();
}


function viewMode() {
	var isDisabled = document.getElementById("viewModeCss").disabled;
	document.getElementById("viewModeCss").disabled = !isDisabled;

	localStorage.setItem("viewMode", isDisabled);
}


function showSorting() {
	document.getElementById("showSorting").classList.toggle("btnBlue");
	document.getElementById("sorting").classList.toggle("sortingVisible");
}



/* use sortablejs to enable drag drop of syncpair
!! See at bottom of the file for initiate */
var sortable;
function editOrderMode() {
	if(sortable.options.disabled) {
		sortable.options.disabled = false;
		document.getElementById("editOrderMode").innerHTML = `Edit order <img src="images/on.png">`
	} else {
		sortable.options.disabled = true;
		document.getElementById("editOrderMode").innerHTML = `Edit order <img src="images/off.png">`
	}
}


/* use html2canvas to take screenshot */
function takeScreenshot() {
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
			windowHeight:1080
		}).then(canvas => {
			document.getElementById("screenshot").innerHTML = "<p>Your image :</p>";

			var img = document.createElement('img');
			img.src = canvas.toDataURL("image/png");

			document.getElementById("screenshot").appendChild(img);

			document.getElementById("screenshot").classList.remove("hide");
			document.getElementById("counter").classList.remove("forScreenshot");
			document.getElementById("syncPairs").classList.add("forScreenshot");
			document.getElementById("linkTool").classList.add("hide");

			document.getElementById("counterSelected").classList.remove("hide");
			document.getElementById("counterTotal").classList.remove("hide");
	});
}



/*-----------------------------------------------------------------------------
	EVENTS LISTENERS
-----------------------------------------------------------------------------*/

/* add eventlisteners to all filters buttons */
function addEventButtonsFilters() {
	var filtersBtns = Array.from(document.getElementById("filters").getElementsByTagName("button"));
	var syncLevelBtns = Array.from(document.getElementsByClassName("syncUserBtnSyncLevel"));
	var favBtns = Array.from(document.getElementsByClassName("syncUserBtnFav"));

	filtersBtns.forEach(b => b.addEventListener("click", function() {

		[syncLevelBtns, favBtns].forEach(function(btns) {
			if(btns.indexOf(b) > -1) {
				btns.forEach(function(b2) {
					if(b != b2) { b2.classList.remove("selectedFilter"); }
				});
			}
		})

		b.classList.toggle("selectedFilter");

		searchFilters();
	}))
}

function addEventButtonsSorting() {
	var sortBtns = Array.from(document.getElementById("sorting").getElementsByTagName("button"));
	sortBtns.forEach(b => b.addEventListener("click", function() {

		sortBtns.forEach(b => b.classList.remove("btnBlue"));

		b.classList.add("btnBlue");
	}))
}

/* add onerror event on all images and prevent from being draggable */
function addEventBaseImages() {
	Array.from(document.getElementsByTagName("img")).forEach(i => i.addEventListener("error", function() {
		i.src = "images/empty.png"
	}));
}


/* Egg Mode */
document.getElementById("btnEggs").addEventListener("click", function() {

	sortable.destroy();
	document.getElementById("editOrderMode").classList.remove("selectedOption")

	if(this.classList.contains("btnEggsON")) {
		generatePairs(SYNCPAIRS, false);
		this.classList.remove("btnEggsON");
	} else {
		generatePairs(EGGS, true);
		this.classList.add("btnEggsON");
	}
})


document.getElementById("fullSelection").addEventListener("click", fullSelection);

document.getElementById("resetSelection").addEventListener("click", resetSelection);

document.getElementById("invertSelection").addEventListener("click", invertSelection);

document.getElementById("exportSelection").addEventListener("click", exportSelection);

document.getElementById("importSelection").addEventListener("click", importSelection);

document.getElementById("takeScreenshot").addEventListener("click", takeScreenshot);

document.getElementById("increaseSyncStar").addEventListener("click", increaseSyncStar);

document.getElementById("increaseSyncLevel").addEventListener("click", increaseSyncLevel);

document.getElementById("increaseFavorite").addEventListener("click", increaseFavorite);

document.getElementById("editOrderMode").addEventListener("click", editOrderMode);

document.getElementById("viewMode").addEventListener("click", viewMode);

document.getElementById("showSorting").addEventListener("click", showSorting);

document.getElementById("removeFilters").addEventListener("click", removeFilters);


/* contains all pair of [btn_id, class_el_to_sort] */
var sortBtns = [
	["sortByDexNumber","infoDexNum"],
	["sortByPokemonNumber","infoPokemonNum"],
	["sortByTrainer","infoTrainerName"],
	["sortByStar","infoSyncPairRarity"],
	["sortByRole","infoSyncPairRole"],
	["sortByDate","infoReleaseDate"],
	["sortByRegion","infoSyncPairRegion"]
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
		this.dataset.asc = false;
	} else {
		tinysort('.syncPair',{sortFunction:function(a,b){
			var lenA = a.elm.querySelector(".syncInfos ." + btn[1]).innerHTML;
			var lenB = b.elm.querySelector(".syncInfos ." + btn[1]).innerHTML;
			return lenA===lenB?0:(lenA<lenB?1:-1);
		}});
		this.dataset.asc = true;
	}
}))

/* contains all pair of [btn_id, class_el_to_sort] */
var sortTypes = [
	["sortByType","infoPokemonType"],
	["sortByWeakness","infoPokemonWeak"]
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
		this.dataset.asc = false;
	} else {
		tinysort('.syncPair',{sortFunction:function(a,b){
			var lenA = a.elm.querySelector(".syncInfos ." + btn[1]).dataset.order;
			var lenB = b.elm.querySelector(".syncInfos ." + btn[1]).dataset.order;
			return lenA===lenB?0:(lenA<lenB?1:-1);
		}});
		this.dataset.asc = true;
	}
}))

document.getElementById("sortBySyncLevel").addEventListener("click", function() {
	tinysort('.syncPair',{sortFunction:funBySyncLevel});
})

function funBySyncLevel(a,b){
	var lenA = parseInt(a.elm.querySelector(".syncLevel").dataset.currentimage);
	var lenB = parseInt(b.elm.querySelector(".syncLevel").dataset.currentimage);
	return lenA===lenB?0:(lenA<lenB?1:-1);
}

document.getElementById("sortByFavorite").addEventListener("click", function() {
	tinysort('.syncPair',{sortFunction:funByFavorite});
})

function funByFavorite(a,b){
	var lenA = parseInt(a.elm.querySelector(".syncFav").dataset.currentimage);
	var lenB = parseInt(b.elm.querySelector(".syncFav").dataset.currentimage);
	return lenA===lenB?0:(lenA<lenB?1:-1);
}

document.getElementById("sortBySelected").addEventListener("click", function() {
	tinysort('.syncPair',{attr:'class',order:'desc'});
})

document.getElementById("sortByCustom").addEventListener("click", function() {
	if(localStorage.getItem(sortable.options.group.name) !== null) {
		sortable.sort(localStorage.getItem(sortable.options.group.name).split("|"), true);		
	}
})


/* Search Bar */
document.getElementById("search").addEventListener("keyup", function() {
	setTimeout(searchFilters, 250);	
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



/*-----------------------------------------------------------------------------
	INIT
-----------------------------------------------------------------------------*/

function generatePairs(pairs, eggmons) {
	generatePairsHTML(pairs, eggmons);

	addSyncPairsEvents();

	addEventBaseImages();

	countSelection();

	removeFilters();

	sortable = Sortable.create(document.getElementById("syncPairs"), {
		group: "syncPairsTrackerOrder",
		disabled: true,
		store: {
			get: function (sortable) {
				return
			},
			set: function (sortable) {
				var order = sortable.toArray();
				localStorage.setItem(sortable.options.group.name, order.join('|'));
			}
		}
	})
}


function init() {
	if(localStorage.getItem("darkMode") !== null) {
		document.getElementById("darkModeCss").disabled = !(localStorage.getItem("darkMode") === "true");
	}

	if(localStorage.getItem("viewMode") !== null) {
		document.getElementById("viewModeCss").disabled = !(localStorage.getItem("viewMode") === "true");
	}

	document.getElementById("linkToolVer").innerHTML = document.getElementById("version").innerHTML;

	generatePairs(SYNCPAIRS);

	addEventButtonsFilters();

	addEventButtonsSorting();
}


window.onload = init;
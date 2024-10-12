import {SYNCPAIRS, VERSION} from './syncpairs.js';
import {EGGS} from './eggs.js';
import {NEWS} from './news.js';
import {ITEMS} from './items.js';

const syncLevelImgs = ["images/1.png","images/2.png","images/3.png","images/4.png","images/5.png"];
const syncStarImgs = ["images/star/1.png","images/star/2.png","images/star/3.png","images/star/4.png","images/star/5.png"];
const syncStarImgs2 = ["images/star1.png","images/star2.png","images/star3.png","images/star4.png","images/star5.png","images/star6ex.png"];
const syncFavImgs = ["images/favoriteG.png","images/favoriteL.png","images/favoriteY.png","images/favoriteO.png","images/favoriteM.png","images/favoriteR.png","images/favoriteP.png","images/favoriteV.png","images/favoriteW.png","images/favoriteD.png","images/favoriteB.png","images/favoriteC.png"];
const syncGridImgs = ["images/grid60.png","images/grid62.png","images/grid64.png","images/grid66.png","images/grid68.png","images/grid70_2.png"];
const typesOrder = {"normal":"01","fire":"02","water":"03","electric":"04","grass":"05","ice":"06","fighting":"07","poison":"08","ground":"09","flying":"10","psychic":"11","bug":"12","rock":"13","ghost":"14","dragon":"15","dark":"16","steel":"17","fairy":"18"};
const rolesOrder = {"":"10","strike (physical)":"01","strike (special)":"01","tech":"02","support":"03","sprint":"04","field":"05","multi":"06"};
const regionsOrder = {"pasio":"00","kanto":"01","johto":"02","hoenn":"03","sinnoh":"04","unova":"05","kalos":"06","alola":"07","galar":"08","paldea":"09"}
const acquisitionOrder = {"spotlight scout / general pool":"01","poké fair scout":"02","master fair scout":"03","seasonal scout":"04","special costume scout":"05","variety scout":"06","main story: pml arc":"07","legendary adventures":"08","event reward":"09","battle points exchange":"10","trainer lodge exchange":"11","mix scout":"12", "training ticket exchange":"13", "arc suit fair scout":"14"}
const syncRoleImgs = {"strike (physical)": ["images/role_strike.png","images/role_ex_strike.png"],"strike (special)": ["images/role_strike.png","images/role_ex_strike.png"],"tech": ["images/role_tech.png","images/role_ex_tech.png"],"support": ["images/role_support.png","images/role_ex_support.png"],"sprint": ["images/role_sprint.png","images/role_ex_sprint.png"],"field": ["images/role_field.png","images/role_ex_field.png"], "multi": ["images/role_multi.png"], "strike<>tech<>support": ["images/role_egg.png"]}
const sortIdToSyncpairInfo = {"sortByDexNumber": ".infoDexNum", "sortByPokemonNumber": ".infoPokemonNum", "sortByTrainer": ".infoTrainerName", "sortByStar": ".syncStar", "sortByRole": ".infoSyncPairRole", "sortByRoleEX": ".infoSyncPairRoleEX", "sortByType": ".infoPokemonType", "sortByWeakness": ".infoPokemonWeak", "sortByRegion": ".infoSyncPairRegion", "sortByDate": ".infoReleaseDate", "sortBySyncLevel": ".syncLevel", "sortBySelected": ".selected", "sortByFavorite": ".syncFav", "sortByAcquisition": ".infoSyncPairAcquisition", "sortByGrid": ".syncGrid", "sortByEXRoleUnlock": ".syncRoleEX", "sortByRoleCombi": ".infoSyncPairRoleCombi"}
const roleCombis = {"strike,":"N/A","strike,strike":"1111","strike,tech":"1221","strike,support":"1331","strike,sprint":"1441","strike,field":"1551","strike,multi":"6116","tech,":"N/A","tech,tech":"2222","tech,strike":"1221","tech,support":"2332","tech,sprint":"2442","tech,field":"2552","tech,multi":"6226","support,":"N/A","support,support":"3333","support,strike":"1331","support,tech":"2332","support,sprint":"3443","support,field":"3553","support,multi":"6336","sprint,":"N/A","sprint,sprint":"4444","sprint,strike":"1441","sprint,tech":"2442","sprint,support":"3443","sprint,field":"4554","sprint,multi":"6446","field,":"N/A","field,field":"5555","field,strike":"1551","field,tech":"2552","field,support":"3553","field,sprint":"4554","field,multi":"6556","multi,":"N/A","multi,multi":"6666","multi,strike":"6116","multi,tech":"6226","multi,support":"6336","multi,sprint":"6446","multi,field":"6556"}


/*-----------------------------------------------------------------------------
	GENERATE ALL HTML ELEMENTS ABOUT THE SYNCPAIRS
-----------------------------------------------------------------------------*/

var EGGMONMODE = document.getElementById("btnEggs").classList.contains("btnEggsON");

var CURRENT_NEW = 0;

var FILTER_MODE = "&";

var DEFAULT_FAVS_VALUES = Array(syncFavImgs.length).fill("0").join(""); // 00000000


/* parameter "pairs" is the array containing all {syncpair} -- see syncpairs.js/eggs.js */
function generatePairsHTML(pairs) {

	var dateNow = new Date();
	var result = "";
	var hideStar = "";
	var hideGrid = " hide";

	if(! EGGMONMODE) { hideStar = " hide"; hideGrid = ""; }

	for(var i=0; i<pairs.length; i++) {
		var syncPair = pairs[i];
		var keySyncPairStorage = syncPair.trainerName + "|" + syncPair.pokemonNumber;

		var selected = ""; //to enable the selected class or not

		var datamine = "";
		var dateRelease = new Date(syncPair.releaseDate + "T23:00:00-07:00"); //add 23:00:00 PDT
		// -86400000 => the previous day
		if(dateRelease.getTime()-86400000 > dateNow.getTime()) {
			datamine = " datamine"
		}

		var innerHtmlImages;

		var roleCombi = "roleCombi" + roleCombis[syncPair.syncPairRole.toLowerCase().replace(" (physical)","").replace(" (special)","")+","+syncPair.syncPairRoleEX.toLowerCase().replace(" (physical)","").replace(" (special)","")];

		/* if the current syncpair is in localstorage,
		generate the images with current selected image */
		if(localStorage.getItem(keySyncPairStorage) !== null) {
			// you get "X|Y|Z|W".split("|"), X index of sync level, Y index of syncpair image, Z sync star & W favorite
			var currentData = localStorage.getItem(keySyncPairStorage).split("|");

			var currentSyncLevel = parseInt(currentData[0]);
			var currentSyncImage = parseInt(currentData[1]);
			var currentSyncStar = parseInt(currentData[2]);
			var currentSyncFav = convertFav(currentData[3]);
			var currentSyncRoleEX = parseInt(currentData[4]);
			var currentSyncGrid = parseInt(currentData[5]);

			if(isNaN(currentSyncLevel)) { currentSyncLevel = "0" }
			if(isNaN(currentSyncImage)) { currentSyncImage = "0" }
			if(isNaN(currentSyncStar)) { currentSyncStar = "0" }
			if("" == currentSyncFav) { currentSyncFav = DEFAULT_FAVS_VALUES }
			if(isNaN(currentSyncRoleEX)) { currentSyncRoleEX = "0" }
			if(isNaN(currentSyncGrid)) { currentSyncGrid = "0" }

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
				`<div class="syncStar${hideStar}" data-currentImage="${currentSyncStar}" data-currentstar="${currentStar}">
					${genImages(syncStarImgs, currentSyncStar)}
				</div>
				<div class="syncFav" data-currentValues="${currentSyncFav}" data-html2canvas-ignore="true">
					${genImages2(syncFavImgs, currentSyncFav)}
				</div>
				<div class="syncLevel" data-currentImage="${currentSyncLevel}">
					${genImages(syncLevelImgs, currentSyncLevel)}
				</div>
				<div class="syncRoles">
					<div class="syncRole">${genImages([syncRoleImgs[syncPair.syncPairRole.toLowerCase()][0]], 0)}</div>
					<div class="syncRoleEX" data-currentImage="${currentSyncRoleEX}">${genImages(syncRoleImgs[syncPair.syncPairRoleEX.toLowerCase()], currentSyncRoleEX)}</div>
				</div>
				<div class="syncImages" data-currentImage="${currentSyncImage}">
					${genImages(syncPair.images, currentSyncImage)}
				</div>				
				<div class="syncGrid${hideGrid}" data-currentImage="${currentSyncGrid}">
					${genImages(syncGridImgs, currentSyncGrid)}
				</div>`;

		} else {
			innerHtmlImages = 
				`<div class="syncStar${hideStar}" data-currentImage="0" data-currentstar="${syncPair.syncPairRarity}">
					${genImages(syncStarImgs, 0)}
				</div>
				<div class="syncFav" data-currentValues="${DEFAULT_FAVS_VALUES}" data-html2canvas-ignore="true">
					${genImages2(syncFavImgs, DEFAULT_FAVS_VALUES)}
				</div>
				<div class="syncLevel" data-currentImage="0">
					${genImages(syncLevelImgs, 0)}
				</div>
				<div class="syncRoles">
					<div class="syncRole">${genImages([syncRoleImgs[syncPair.syncPairRole.toLowerCase()][0]], 0)}</div>
					<div class="syncRoleEX" data-currentImage="0">${genImages(syncRoleImgs[syncPair.syncPairRoleEX.toLowerCase()], 0)}</div>
				</div>
				<div class="syncImages" data-currentImage="0">
					${genImages(syncPair.images, 0)}
				</div>
				<div class="syncGrid${hideGrid}" data-currentImage="0">
					${genImages(syncGridImgs, 0)}
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
					<p class="infoPokemonForms">${tags(syncPair.pokemonForm, "")}</p>
					<p data-order="${typesOrder[syncPair.pokemonType.toLowerCase()]}" class="infoPokemonType">${syncPair.pokemonType}</p>
					<p data-order="${typesOrder[syncPair.pokemonWeak.toLowerCase()]}" class="infoPokemonWeak">${syncPair.pokemonWeak}</p>
					<p data-order="${rolesOrder[syncPair.syncPairRole.toLowerCase()]}" class="infoSyncPairRole">${syncPair.syncPairRole}</p>
					<p data-order="${rolesOrder[syncPair.syncPairRoleEX.toLowerCase()]}" class="infoSyncPairRoleEX">${syncPair.syncPairRoleEX}</p>
					<p data-order="${roleCombi}" class="infoSyncPairRoleCombi">${roleCombi}</p>
					<p class="infoSyncPairRarity">${syncPair.syncPairRarity}</p>
					<p class="infoReleaseDate">${syncPair.releaseDate}</p>
					<p data-order="${acquisitionOrder[syncPair.syncPairAcquisition.toLowerCase()]}" class="infoSyncPairAcquisition">${syncPair.syncPairAcquisition}</p>
					<p data-order="${regionsOrder[syncPair.syncPairRegion.toLowerCase()]}" class="infoSyncPairRegion">${syncPair.syncPairRegion}</p>
					<p class="infoSyncPairThemes">${tags(syncPair.themes, "theme_")}</p>
					<p class="infoSyncPairTags">${tags(syncPair.tags, "")}</p>
				</div>
			</div>`;
	}

	/* generate all <img> of an array of images src and
	add the "currentImage" class to image at index "current_i" */
	function genImages(imgs, current_i) {
		var im = "";
		if(imgs == undefined) return im;

		var current_im = current_i;
		if(current_im >= imgs.length) { current_im = imgs.length-1; }
		if(imgs.length == 0) return `<img draggable="false" loading="lazy" src="images/empty.png" class="currentImage">`

		for(var i=0; i<imgs.length; i++) {
			if(i==current_im) { im += `<img draggable="false" loading="lazy" src="${imgs[i]}" class="currentImage">`
			} else { im += `<img  draggable="false" loading="lazy" src="${imgs[i]}">` }
		}
		return im;
	}

	function genImages2(imgs, current_v) {
		var im = "";
		var current_va = convertFav(current_v).split("");

		for(var i=0; i<imgs.length; i++) {
			if(current_va[i] == "0") { im += `<img draggable="false" loading="lazy" src="${imgs[i]}">`
			} else { im += `<img  draggable="false" loading="lazy" src="${imgs[i]}" class="currentImage">` }
		}
		return im;
	}

	function tags(tags, tag_type) { return tags.map((t) => tag_type + t).join(", "); }

	document.getElementById('syncPairs').innerHTML = result;
}



var ua = window.navigator.userAgent;
var iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
var webkit = !!ua.match(/WebKit/i);
var iOSSafari = iOS && webkit && !ua.match(/CriOS/i);

/* add eventlisterner to all ".syncpair" elements, move level and images */
function addSyncPairsEvents() {

	//var syncP = Array.from(document.getElementsByClassName("syncPair"));
	var syncStars = Array.from(document.getElementsByClassName("syncStar"));
	var syncFavs = Array.from(document.getElementsByClassName("syncFav"));
	var syncLevels = Array.from(document.getElementsByClassName("syncLevel"));
	var syncImages = Array.from(document.getElementsByClassName("syncImages"));
	var syncRoles = Array.from(document.getElementsByClassName("syncRoles"));
	var syncGrids = Array.from(document.getElementsByClassName("syncGrid"));

	var syncStarLevels = syncStars.concat(syncLevels.concat(syncRoles.concat(syncGrids)));
	var syncStarLevelsImages = syncImages.concat(syncStarLevels);

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

	syncStarLevels.forEach(s => s.addEventListener("click", function() { addEvents(s); }));

	syncFavs.forEach(function(s) {
		Array.from(s.children).forEach(heartImg => heartImg.addEventListener("click", function() {
			this.classList.toggle("currentImage");

			var values = [];
			Array.from(s.children).forEach(function(i) {
				if(i.classList.contains("currentImage")) {
					values.push("1");
				} else {
					values.push("0");
				}
			});
			s.dataset.currentvalues = values.join("");

			addToLocalStorage(s.parentElement);
		}))
	});


	if(iOSSafari) {
		syncStarLevelsImages.forEach(s => s.addEventListener("long-press", function() { addEvents(s); }));
	}
	else {
		syncStarLevelsImages.forEach(s => s.addEventListener("contextmenu", function(e) {

			e.preventDefault();	e.stopPropagation();

			addEvents(s);

			return false;
		}));
	}

	function addEvents(si) {
		if(si.parentElement.classList.contains("selected") && !(localStorage.getItem("viewMode") === "true") && !(localStorage.getItem("lockMode") === "true")) {
			swapImages(si, 1);
			addToLocalStorage(si.parentElement);
		}
	}
}


/* takes a <div> containing <img> elements and move the "currentImage" class through the images */
function swapImages(imgsContainer, step) {

	if(imgsContainer.children.length == 0) { return; }

	var imagesContainer = imgsContainer;

	if(imagesContainer.classList.contains("syncRoles")) {
		imagesContainer = imagesContainer.querySelector(".syncRoleEX");
	}
	var imagesContainerParent = imagesContainer.parentElement;

	var images = Array.from(imagesContainer.children);
	var nextImageNumber = parseInt(imagesContainer.dataset.currentimage) + step;

	if(nextImageNumber >= images.length) { nextImageNumber = 0; }
	if(nextImageNumber < 0) { nextImageNumber = images.length-1; }

	if(imagesContainer.classList.contains("syncGrid")) {
		var syncLvlCurr = parseInt(imagesContainerParent.querySelector(".syncLevel").dataset.currentimage);
		
		nextImageNumber = parseInt(imagesContainer.dataset.currentimage) + step;
		if(step > 0 && nextImageNumber > syncLvlCurr+1) { nextImageNumber = 0; }
		if(step < 0 && nextImageNumber < 0) { nextImageNumber = syncLvlCurr+1; }
	}
	if(imagesContainer.classList.contains("syncLevel") && parseInt(imagesContainer.dataset.currentimage) == 4) {
		imagesContainerParent.querySelector(".syncGrid").dataset.currentimage = "0";
		swapImages(imagesContainerParent.querySelector(".syncGrid"), 0);
	}

	images.forEach(i => i.removeAttribute("class"));

	images[nextImageNumber].classList.add("currentImage");

	imagesContainer.dataset.currentimage = nextImageNumber;

	var basestar;

	if(imagesContainer.classList.contains("syncRoleEX")) {
		basestar = parseInt(imagesContainerParent.parentElement.querySelector(".infoSyncPairRarity").textContent);
	} else {
		basestar = parseInt(imagesContainerParent.querySelector(".infoSyncPairRarity").textContent);
	}

	if(imagesContainer.classList.contains("syncStar") && EGGMONMODE) {
		imagesContainer.dataset.currentstar = basestar + nextImageNumber;
	}
	if(imagesContainer.classList.contains("syncImages") && !EGGMONMODE) {
		if(imagesContainerParent.querySelector(".infoTrainerName").textContent == "Player") {
			imagesContainerParent.querySelector(".syncStar").dataset.currentstar = Math.floor(nextImageNumber/2) + basestar;
		} else {
			imagesContainerParent.querySelector(".syncStar").dataset.currentstar = basestar + nextImageNumber;
		}

		if(imagesContainer.innerHTML.indexOf(`EX.png" class="currentImage">`) == -1) {
			imagesContainerParent.querySelector(".syncRoleEX").dataset.currentimage = "0";
			var rolesImgs = Array.from(imagesContainerParent.querySelector(".syncRoleEX").children);
			if(rolesImgs.length > 0) {
				rolesImgs.forEach(i => i.removeAttribute("class"));
				rolesImgs[0].classList.add("currentImage");
			}
		}
	}
}


function convertFav(f) {
	if(f.length == 1) {
		var temp = Array(DEFAULT_FAVS_VALUES.length).fill("0");
		temp[parseInt(f)] = "1";
		if(""+f == "0") { temp[0] = "0"; }
		return temp.join("");
	}
	return f;
}

function chooseImages(imagesContainer, values) {
	var images = Array.from(imagesContainer.children);
	var vals = convertFav(values);

	for(var i=0; i<images.length; i++) {
		if(vals.charAt(i) == "1") { images[i].classList.add("currentImage"); }
		else { images[i].classList.remove("currentImage"); }
	}

	imagesContainer.dataset.currentvalues = ""+values;
}


function showCandy() {

	//document.getElementById('itemsCounter').classList.toggle("hide");
	document.getElementById("btnItems").classList.toggle("btnItemsON");
	document.getElementById('items').classList.toggle("hide");

	if(document.getElementById('items').innerHTML == "") {
		generateItemsHTML(ITEMS);
	}

	document.getElementById("items").scrollIntoView(true);
}

function generateItemsHTML(items) {

	var result = "";

	if(localStorage.getItem("syncPairsTrackerItems") !== null) {
		var storedItems = JSON.parse(localStorage.getItem("syncPairsTrackerItems"));

		for(var i=0; i<items.length; i++) {
			var count = storedItems[items[i].name];
			var noIt = "";
			if(count == undefined || isNaN(parseInt(count))) { count = "0"; }
			if(count == "0") { noIt = " noItem"; }

			result += `<div class="item itemBg_${items[i].background}${noIt}">
							<div class="itemInfos">
								<img draggable="false" class="itemImg" src="${items[i].image}">
								<p class="itemName">${items[i].name}</p>
								<p class="itemCount">${count}</p>
							</div>
							<div class="itemIncrDrec" data-html2canvas-ignore="true">
								<button type="button" class="btnIncreaseItem">+</button>
								<button type="button" class="btnDecreaseItem">-</button>
							</div>
						</div>`;
		}
	} else {
		for(var i=0; i<items.length; i++) {

			result += `<div class="item itemBg_${items[i].background} noItem">
							<div class="itemInfos">
								<img draggable="false" class="itemImg" src="${items[i].image}">
								<p class="itemName">${items[i].name}</p>
								<p class="itemCount">0</p>
							</div>
							<div class="itemIncrDrec" data-html2canvas-ignore="true">
								<button type="button" class="btnIncreaseItem">+</button>
								<button type="button" class="btnDecreaseItem">-</button>
							</div>
						</div>`;
		}
	}

	document.getElementById('items').innerHTML = result;

	function saveItems() {
		var items = {}
		Array.from(document.getElementById('items').getElementsByClassName("item")).forEach(function(i) {
			items[i.getElementsByClassName("itemName")[0].innerHTML] = i.getElementsByClassName("itemCount")[0].innerHTML;
		})
		localStorage.setItem("syncPairsTrackerItems", JSON.stringify(items));
	}

	function plusItem(itemHtml) {
		itemHtml.classList.remove("noItem");
		itemHtml.getElementsByClassName("itemCount")[0].innerHTML = parseInt(itemHtml.getElementsByClassName("itemCount")[0].innerHTML) + 1;
		saveItems();
	}

	function minusItem(itemHtml) {
		itemHtml.getElementsByClassName("itemCount")[0].innerHTML = parseInt(itemHtml.getElementsByClassName("itemCount")[0].innerHTML) - 1;
		if(parseInt(itemHtml.getElementsByClassName("itemCount")[0].innerHTML) <= 0) { resetItem(itemHtml);	}
		saveItems();
	}

	function resetItem(itemHtml) {
		itemHtml.classList.add("noItem");
		itemHtml.getElementsByClassName("itemCount")[0].innerHTML = "0";
		saveItems();
	}

	Array.from(document.getElementById('items').getElementsByClassName("itemInfos")).forEach(function(i) {

		i.addEventListener("click", function() { plusItem(this.parentElement); })

		if(iOSSafari) {
			i.addEventListener("long-press", function(e) { minusItem(this.parentElement); })
		} else {
			i.addEventListener("contextmenu", function(e) {
				e.preventDefault();	e.stopPropagation(); minusItem(this.parentElement); return false;
			})
		}
	})

	Array.from(document.getElementById('items').getElementsByClassName("btnIncreaseItem")).forEach(function(i) {
		i.addEventListener("click", function() { plusItem(this.parentElement.parentElement); })
	})

	Array.from(document.getElementById('items').getElementsByClassName("btnDecreaseItem")).forEach(function(i) {
		i.addEventListener("click", function() { minusItem(this.parentElement.parentElement); })
	})
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
	Array.from(syncpair.querySelector(".syncGrid").children).forEach(c => c.classList.remove("currentImage"));

	syncpair.querySelector(".syncStar").children[0].classList.add("currentImage");
	syncpair.querySelector(".syncLevel").children[0].classList.add("currentImage");
	syncpair.querySelector(".syncImages").children[0].classList.add("currentImage");
	syncpair.querySelector(".syncGrid").children[0].classList.add("currentImage");

	syncpair.querySelector(".syncStar").dataset.currentstar = syncpair.querySelector(".infoSyncPairRarity").textContent;
	syncpair.querySelector(".syncStar").dataset.currentimage = "0";
	syncpair.querySelector(".syncFav").dataset.currentvalues = DEFAULT_FAVS_VALUES;
	syncpair.querySelector(".syncLevel").dataset.currentimage = "0";
	syncpair.querySelector(".syncImages").dataset.currentimage = "0";
	syncpair.querySelector(".syncGrid").dataset.currentimage = "0";

	var syncRoleEXDIVchildren = Array.from(syncpair.querySelector(".syncRoleEX").children);
	if(syncRoleEXDIVchildren.length > 0) {
		syncRoleEXDIVchildren.forEach(c => c.classList.remove("currentImage"));
		syncpair.querySelector(".syncRoleEX").children[0].classList.add("currentImage");
		syncpair.querySelector(".syncRoleEX").dataset.currentimage = "0";
	}

	var keySyncPairStorage = syncpair.querySelector(".syncInfos .infoTrainerName").innerHTML + "|" + syncpair.querySelector(".syncInfos .infoPokemonNum").innerHTML;

	localStorage.removeItem(keySyncPairStorage);
}


/* takes a ".syncpair" html element and store the essentials informations in the data attribute in localstorage */
function addToLocalStorage(syncpair) {
	var keySyncPairStorage = syncpair.querySelector(".syncInfos .infoTrainerName").innerHTML + "|" + syncpair.querySelector(".syncInfos .infoPokemonNum").innerHTML;

	var currentSyncStar = syncpair.querySelector(".syncStar").dataset.currentimage;
	var currentSyncFav = syncpair.querySelector(".syncFav").dataset.currentvalues;
	var currentSyncLevel = syncpair.querySelector(".syncLevel").dataset.currentimage;
	var currentSyncImage = syncpair.querySelector(".syncImages").dataset.currentimage;
	var currentSyncRoleEX = syncpair.querySelector(".syncRoleEX").dataset.currentimage;
	var currentSyncGrid = syncpair.querySelector(".syncGrid").dataset.currentimage;

	localStorage.setItem(keySyncPairStorage, currentSyncLevel + "|" + currentSyncImage + "|" + currentSyncStar + "|" + currentSyncFav + "|" + currentSyncRoleEX + "|" + currentSyncGrid);
}


/* takes all elements with a specific class (all, selected, found, notfound)
and insert the count in the corresponding output element */
function countSelection() {
	var totalSyncPairs, allSelected, allSelectedFound, allFound, allNotFound, allNotSelected, allNotSelectedFound;

	if(document.getElementById("datamineVisible").classList.contains("btnYellow")) {
		totalSyncPairs = parseInt(Array.from(document.querySelectorAll(".syncPair:not(.datamine)")).length);
		allSelected = parseInt(Array.from(document.querySelectorAll(".syncPair.selected:not(.datamine)")).length);
		allSelectedFound = parseInt(Array.from(document.querySelectorAll(".syncPair.selected.found:not(.datamine)")).length);
		allFound = parseInt(Array.from(document.querySelectorAll(".syncPair.found:not(.datamine)")).length);
		allNotFound = parseInt(Array.from(document.querySelectorAll(".syncPair.notFound:not(.datamine)")).length);
		allNotSelected = totalSyncPairs-allSelected;
		allNotSelectedFound = allFound-allSelectedFound;
	} else {
		totalSyncPairs = parseInt(Array.from(document.querySelectorAll(".syncPair")).length);
		allSelected = parseInt(Array.from(document.querySelectorAll(".syncPair.selected")).length);
		allSelectedFound = parseInt(Array.from(document.querySelectorAll(".syncPair.selected.found")).length);
		allFound = parseInt(Array.from(document.querySelectorAll(".syncPair.found")).length);
		allNotFound = parseInt(Array.from(document.querySelectorAll(".syncPair.notFound")).length);
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

	if(allFound > 0) {
		document.getElementById("pairsCounterFound").innerHTML = `${allSelectedFound} / ${allFound}<span class="pairsCounterPercentage"> (${((allSelectedFound/allFound)*100).toFixed(1)}%)</span>`;
		document.getElementById("pairsCounterFoundTotal").innerHTML = `${allFound} / ${totalSyncPairs}<span class="pairsCounterPercentage"> (${((allFound/totalSyncPairs)*100).toFixed(1)}%)</span>`;
		document.getElementById("pairsCounterSelected").innerHTML = "";
		document.getElementById("pairsCounterTotal").innerHTML = "";
		return;
	}	
	if(allFound==allNotFound) {
		document.getElementById("pairsCounterFound").innerHTML = "";
		document.getElementById("pairsCounterFoundTotal").innerHTML = "";
		document.getElementById("pairsCounterSelected").innerHTML = `${allSelected} / ${totalSyncPairs}<span class="pairsCounterPercentage"> (${((allSelected/totalSyncPairs)*100).toFixed(1)}%)</span>`;
		document.getElementById("pairsCounterTotal").innerHTML = `${totalSyncPairs} / ${totalSyncPairs}<span class="pairsCounterPercentage"> (100.0%)</span>`;
		return;
	}
	if(allNotFound==totalSyncPairs) {
		document.getElementById("pairsCounterFound").innerHTML = `0 / 0<span class="pairsCounterPercentage"> (0.0%)</span>`;
		document.getElementById("pairsCounterFoundTotal").innerHTML = `0 / ${totalSyncPairs}<span class="pairsCounterPercentage"> (0.0%)</span>`;
		document.getElementById("pairsCounterSelected").innerHTML = "";
		document.getElementById("pairsCounterTotal").innerHTML = "";
		return;
	}
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

	var pairs = [];
	if(parseInt(filters.length) > 0) {
		pairs = Array.from(document.getElementsByClassName("syncPair selected found"));
	} else {
		pairs = Array.from(document.getElementsByClassName("syncPair selected"));
	}
	pairs.forEach(function(s) {
		var key = s.querySelector(".syncInfos .infoDexNum").innerHTML + "|" + s.querySelector(".syncInfos .infoPokemonNum").innerHTML;
		var synLevel = s.querySelector(".syncLevel").dataset.currentimage;
		var synImage = s.querySelector(".syncImages").dataset.currentimage;
		var synStar = s.querySelector(".syncStar").dataset.currentimage;
		var synFavHEX = parseInt(s.querySelector(".syncFav").dataset.currentvalues, 2).toString(16).toUpperCase().padStart(3, '0');
		var synRoleEX = s.querySelector(".syncRoleEX").dataset.currentimage;
		var synGrid = s.querySelector(".syncGrid").dataset.currentimage;

		var value = synLevel + "|" + synImage + "|" + synStar + "|" + synFavHEX + "|" + synRoleEX + "|" + synGrid;

		exported[key] = value;
	})

	if(pairs.length == 0 && localStorage.getItem("syncPairsTrackerBackup") !== null) {
		document.getElementById("exportImportZone").value = localStorage.getItem("syncPairsTrackerBackup");
	} else {
		localStorage.setItem("syncPairsTrackerBackup", JSON.stringify(exported));
		document.getElementById("exportImportZone").value = JSON.stringify(exported);
	}

	importSelection();

}


/* takes the string (with the format from the export function) in the import textarea
go through all syncpairs and apply the need change to the elements */
function importSelection() {

	var imported;
	var importedTextAreaValue = document.getElementById("exportImportZone").value;

	try {
		if(importedTextAreaValue == "") {
			imported = JSON.parse(localStorage.getItem("syncPairsTrackerBackup"));
		} else {
			imported = JSON.parse(importedTextAreaValue);
		}

		var isOldFormat = false;
		if(importedTextAreaValue.indexOf("a") > -1 || importedTextAreaValue.indexOf("i") > -1 || 
			 importedTextAreaValue.indexOf("u") > -1 || importedTextAreaValue.indexOf("e") > -1 || 
			 importedTextAreaValue.indexOf("o") > -1) {
			isOldFormat = true;
		}

		Array.from(document.getElementsByClassName("syncPair")).forEach(function(s) {
			var key = s.querySelector(".syncInfos .infoDexNum").innerHTML + "|" + s.querySelector(".syncInfos .infoPokemonNum").innerHTML;

			if(isOldFormat) {
				var key = s.querySelector(".syncInfos .infoTrainerName").innerHTML + "|" + s.querySelector(".syncInfos .infoPokemonNum").innerHTML;
			}

			unselect(s);

			if(key in imported) {
				var currentSyncData = imported[key].split("|");
				var importedSyncLevel = currentSyncData[0];
				var importedSyncImage = currentSyncData[1];
				var importedSyncStar = currentSyncData[2];
				var importedSyncFav = convertFav(parseInt(currentSyncData[3], 16).toString(2).padStart(12, '0'));
				var importedSyncRoleEX = currentSyncData[4];
				var importedSyncGrid = currentSyncData[5];

				if(isNaN(importedSyncLevel)) { importedSyncLevel = "0" }
				if(isNaN(importedSyncImage)) { importedSyncImage = "0" }
				if(isNaN(importedSyncStar)) { importedSyncStar = "0" }
				if("" == importedSyncFav) { importedSyncFav = DEFAULT_FAVS_VALUES }
				if(isNaN(importedSyncRoleEX)) { importedSyncRoleEX = "0" }
				if(isNaN(importedSyncGrid)) { importedSyncGrid = "0" }

				var syncLevelDIV = s.querySelector(".syncLevel");
				var syncImagesDIV = s.querySelector(".syncImages");
				var syncStarDIV = s.querySelector(".syncStar");
				var syncFavDIV = s.querySelector(".syncFav");
				var syncRoleEXDIV = s.querySelector(".syncRoleEX");
				var syncGridDIV = s.querySelector(".syncGrid");

				syncLevelDIV.dataset.currentimage = parseInt(importedSyncLevel);
				syncImagesDIV.dataset.currentimage = parseInt(importedSyncImage);
				syncStarDIV.dataset.currentimage = parseInt(importedSyncStar);
				syncFavDIV.dataset.currentvalues = importedSyncFav;
				syncRoleEXDIV.dataset.currentimage = parseInt(importedSyncRoleEX);
				syncGridDIV.dataset.currentimage = parseInt(importedSyncGrid);

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
				Array.from(syncGridDIV.children).forEach(c => c.classList.remove("currentImage"))

				syncLevelDIV.children[importedSyncLevel].classList.add("currentImage");
				syncImagesDIV.children[importedSyncImage].classList.add("currentImage");
				syncStarDIV.children[importedSyncStar].classList.add("currentImage");
				syncGridDIV.children[importedSyncGrid].classList.add("currentImage");

				var syncRoleEXDIVchildren = Array.from(syncRoleEXDIV.children);
				if(syncRoleEXDIVchildren.length > 0) {
					syncRoleEXDIVchildren.forEach(c => c.classList.remove("currentImage"));
					syncRoleEXDIV.children[importedSyncRoleEX].classList.add("currentImage");
				}

				chooseImages(syncFavDIV, importedSyncFav);

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

	var pairs = [];
	if(parseInt(filters.length) > 0 && confirm(message1)) {
		pairs = Array.from(document.getElementsByClassName("syncPair selected found"));
	} else if(parseInt(filters.length) == 0 && confirm(message2)) {
		pairs = Array.from(document.getElementsByClassName("syncPair selected"));
	}
	pairs.forEach(function(s) {
		swapImages(s.querySelector(element), step);
		select(s);
	});
}

function chooseElem(element, message1, message2, step, indexToChange) {

	var filters = Array.from(document.getElementsByClassName("selectedFilter"));

	var searchValue = document.getElementById("search").value;
	if(searchValue !== "") { filters.push(searchValue); }

	var pairs = [];
	if(parseInt(filters.length) > 0 && confirm(message1)) {
		pairs = Array.from(document.getElementsByClassName("syncPair selected found"));
	} else if(parseInt(filters.length) == 0 && confirm(message2)) {
		pairs = Array.from(document.getElementsByClassName("syncPair selected"));
	}
	pairs.forEach(function(s) {
		var nextVals = DEFAULT_FAVS_VALUES;
		var currVals = convertFav(s.querySelector(element).dataset.currentvalues);

		nextVals = currVals.slice(step) + currVals.slice(0,step);

		if(indexToChange != "none") {
			var newValue = (currVals[indexToChange] == "0") ? "1" : "0";
			nextVals = currVals.substring(0, indexToChange) + newValue + currVals.substring(indexToChange + 1);
		}

		chooseImages(s.querySelector(element), nextVals);
		select(s);
	});
}

function resetDefault(element, message1, message2) {

	var filters = Array.from(document.getElementsByClassName("selectedFilter"));

	var searchValue = document.getElementById("search").value;
	if(searchValue !== "") { filters.push(searchValue); }

	var pairs = [];
	if(parseInt(filters.length) > 0 && confirm(message1)) {
		pairs = Array.from(document.getElementsByClassName("syncPair selected found"));
	} else if(parseInt(filters.length) == 0 && confirm(message2)) {
		pairs = Array.from(document.getElementsByClassName("syncPair selected"));
	}
	pairs.forEach(function(s) {
		var imgs = Array.from(s.querySelector(element).children);
		if(imgs.length == 0) { return; }

		imgs.forEach(f => f.removeAttribute("class"));
		if(element != ".syncFav") {
			imgs[0].classList.add("currentImage");
			s.querySelector(element).dataset.currentimage = "0";
		} else {
			s.querySelector(element).dataset.currentvalues = DEFAULT_FAVS_VALUES;
		}
		select(s);
	});
}


function increaseFavorite() {
	var message1 = "Shift the heart color of all filtered sync pairs to the next color ?";
	var message2 = "Shift the heart color of all sync pairs to the next color ?";

	chooseElem(".syncFav", message1, message2, 1, "none");
}
function decreaseFavorite() {
	var message1 = "Shift the heart color of all filtered sync pairs to the previous color ?";
	var message2 = "Shift the heart color of all sync pairs to the previous color ?";

	chooseElem(".syncFav", message1, message2, -1, "none");
}
function resetFavorite() {
	var message1 = "Reset the heart color of all filtered sync pairs ?";
	var message2 = "Reset the heart color of all sync pairs ?";

	resetDefault(".syncFav", message1, message2);
}

function selectHeart(heart) {
	var message1 = "Apply the selected heart color to all filtered sync pairs ?";
	var message2 = "Apply the selected heart color to all sync pairs ?";

	var hearts = {"favoriteG": 0,"favoriteL": 1,"favoriteY": 2,"favoriteO": 3,"favoriteM": 4,"favoriteR": 5,"favoriteP": 6,"favoriteW": 7,"favoriteV": 8,"favoriteD": 9,"favoriteB": 10,"favoriteC": 11}

	chooseElem(".syncFav", message1, message2, 0, hearts[heart]);
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

function increaseSyncGrid() {
	var message1 = "Increase the sync grid energy cap of all filtered sync pairs ?";
	var message2 = "Increase the sync grid energy cap of all sync pairs ?";

	swapElem(".syncGrid", message1, message2, 1);
}
function decreaseSyncGrid() {
	var message1 = "Decrease the sync grid energy cap of all filtered sync pairs ?";
	var message2 = "Decrease the sync grid energy cap of all sync pairs ?";

	swapElem(".syncGrid", message1, message2, -1);
}
function resetSyncGrid() {
	var message1 = "Reset the sync grid energy cap of all filtered sync pairs ?";
	var message2 = "Reset the sync grid energy cap of all sync pairs ?";

	resetDefault(".syncGrid", message1, message2);
}

function unlockEXRole() {
	var message1 = "Switch the EX Role state of all filtered sync pairs ?";
	var message2 = "Switch the EX Role state of all sync pairs ?";

	swapElem(".syncRoleEX", message1, message2, 1);
}

function resetEXRole() {
	var message1 = "Reset the EX Role state of all filtered sync pairs ?";
	var message2 = "Reset the EX Role state of all sync pairs ?";

	resetDefault(".syncRoleEX", message1, message2);
}


function elementVisible(id) {
	if(id == "allVisible" || id == "selectedVisible" || id == "notSelectedVisible") {
		document.getElementById("allVisible").classList.remove("btnYellow");
		document.getElementById("selectedVisible").classList.remove("btnYellow");
		document.getElementById("notSelectedVisible").classList.remove("btnYellow");		
	}

	if(id == "datamineVisible") {
		Array.from(document.getElementsByClassName("datamine")).forEach(d => unselect(d));
	}

	document.getElementById(id).classList.toggle("btnYellow");

	visibility();
}

function visibility() {

	var userChoices = []

	Array.from(document.getElementById("visibilityOptions").getElementsByClassName("btnYellow")).forEach(function(choice) {
		userChoices.push(choice.id);
	})

	setVisibility(userChoices);

	countSelection();
}

function setVisibility(choices) {
	localStorage.setItem("visibilityOptions", JSON.stringify(choices));

	var css = {
		"allVisible": "",

		"selectedVisible" : `.syncPair:not([class*="selected"]) { display: none !important; }`,

		"notSelectedVisible": `.syncPair[class*="selected"] { display: none !important; }`,

		"datamineVisible": `.datamine { display: none !important; } #datamineVisible { text-decoration: line-through; text-decoration-thickness: 2px; }`,

		"pairsCounterPercentageVisible" : `.pairsCounterPercentage { display: none; }`,

		"syncInfosVisible" : `.syncPair:hover > .syncInfos { display: none !important; }`,

		"syncFavsVisible" : `.syncFav { display: none !important; }`,

		"syncRoleVisible" : `.syncRole { display: none !important; }`,

		"syncRoleEXVisible" : `.syncRoleEX { display: none !important; }`,

		"syncGridVisible" : `.syncGrid { display: none !important; }`,

		"fullWidthVisible" : `#main { width: 100%; } #rightSide { margin-left: 25%; width: 100%; }\n@media only screen and (max-width: 1600px) { #rightSide { margin-left: 30% } }\n@media only screen and (max-width: 1400px) { #rightSide { margin-left: 40% } }\n@media only screen and (max-width: 1200px) { #rightSide { margin-left: 50% } }\n@media only screen and (max-width: 1024px) { #rightSide { margin-left: auto } }`
	}

	var theCSS = [];
	choices.forEach(function(choice) {
		theCSS.push(css[choice]);
		document.getElementById(choice).checked = true;
		document.getElementById(choice).classList.add("btnYellow");
	})

	document.getElementById("visibilityMode").innerHTML = theCSS.join("\n");
}

function loadVisibilityFromLocalStorage() {

	var options = ["allVisible", "syncRoleVisible", "syncInfosVisible"];

	if("visibilityOptions" in localStorage) {
		options = JSON.parse(localStorage.getItem("visibilityOptions"));
	}

	setVisibility(options);

	if(localStorage.getItem("lockMode") !== null) {
		document.getElementById("lockModeCss").disabled = !(localStorage.getItem("lockMode") === "true");
	}

	if(localStorage.getItem("viewMode") !== null) {
		document.getElementById("viewModeCss").disabled = !(localStorage.getItem("viewMode") === "true");
	}
}


function dateInterval() {

	searchFilters();

	var date1 = document.getElementById("date1").value;
	var date2 = document.getElementById("date2").value;

	if(date1 == "") { date1 = "2019-08-29"; }
	if(date2 == "") { date2 = "2024-12-31"; }

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

	var selecteFiltersLength = Array.from(document.getElementsByClassName("selectedFilter")).length;

	if(document.getElementById("search").value != "") { selecteFiltersLength++; }

	document.getElementById("filtersUsed").innerHTML = `<span class="filterDate">📅 ${date1} → 📅 ${date2}</span> : ` + document.getElementById("filtersUsed").innerHTML;

	document.getElementById("removeFilters").classList.add("btnRed");
	document.getElementById("mobileMenuFilters").classList.add("mobileMenu_selected");
	document.getElementById("removeFilters").innerHTML = `× filters (${selecteFiltersLength + 1})`;

	countSelection();
}

function searchFiltersORdateInterval() {
	if(document.getElementById("btnDate").classList.contains("filterDateEnable")) {
		dateInterval();
	} else {
		searchFilters();
	}
	removeEmptySeparators();
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
		var toSearch = searchValue.replace("  ","").replace(" , ",",").replace(", ",",").replace(" ,",",").split(",");
		toSearch.forEach(function(el) {
			filters.push('Name">'+el);
			filtersSPAN.push(`<span>${el}</span>`);
		})
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

	if(document.getElementById("hideEmptySeparators").checked) {
		showSeparator(sortIdToSyncpairInfo[document.getElementById("sorting").querySelector(".btnBlue").id]);
	}
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
				var cur = []; var pre = [];
				Array.from(curr_pair.querySelector(dataToSeparate).getElementsByClassName("currentImage")).forEach(i => cur.push(i.outerHTML));
				Array.from(prev_pair.querySelector(dataToSeparate).getElementsByClassName("currentImage")).forEach(i => pre.push(i.outerHTML));

				if(cur.length == 0) { cur.push(`<img draggable="false" loading="lazy" src="images/favorite1.png">`) }
				if(pre.length == 0) { pre.push(`<img draggable="false" loading="lazy" src="images/favorite1.png">`) }

				inner = cur.join("");
				inner2 = pre.join("");
				break;

			case ".selected":
				inner = curr_pair.classList.contains("selected").toString().replace("true","Have").replace("false","Not have");
				inner2 = prev_pair.classList.contains("selected").toString().replace("true","Have").replace("false","Not have");
				break;

			case ".infoReleaseDate":
				inner = curr_pair.querySelector(dataToSeparate).innerHTML;
				inner2 = prev_pair.querySelector(dataToSeparate).innerHTML;

				if(document.getElementById("separateByYear").checked) {
					inner = inner.substring(0,4);
					inner2 = inner2.substring(0,4);
				} else if(document.getElementById("separateByMonth").checked) {
					inner = inner.substring(0,7);
					inner2 = inner2.substring(0,7);
				}
				break;

			case ".infoPokemonType":
				var t = curr_pair.querySelector(dataToSeparate).textContent;
				inner = `<img src="images/type_${t.toLowerCase()}.png">&nbsp;${t}`;

				t = prev_pair.querySelector(dataToSeparate).textContent;
				inner2 = `<img src="images/type_${t.toLowerCase()}.png">&nbsp;${t}`
				break;

			case ".infoSyncPairRole":
				var r = curr_pair.querySelector(dataToSeparate).textContent.replace(" (Special)","").replace(" (Physical)","");
				inner = `<img src="images/role_${r.toLowerCase()}.png">&nbsp;${r}`;
				
				r = prev_pair.querySelector(dataToSeparate).textContent.replace(" (Special)","").replace(" (Physical)","");
				inner2 = `<img src="images/role_${r.toLowerCase()}.png">&nbsp;${r}`
				break;

			case ".infoSyncPairRoleEX":
				var r = curr_pair.querySelector(dataToSeparate).textContent.replace(" (Special)","").replace(" (Physical)","");
				inner = `<img src="images/role_ex_${r.toLowerCase()}.png">&nbsp;${r}`;
				
				r = prev_pair.querySelector(dataToSeparate).textContent.replace(" (Special)","").replace(" (Physical)","");
				inner2 = `<img src="images/role_ex_${r.toLowerCase()}.png">&nbsp;${r}`;

				if(inner.indexOf("role_ex_.png") > -1) { inner = ""; }
				if(inner2.indexOf("role_ex_.png") > -1) { inner2 = ""; }
				break;

			case ".infoSyncPairRoleCombi":
				inner = document.getElementById(curr_pair.querySelector(dataToSeparate).textContent).innerHTML.replace('png">/','png">&nbsp;/');
				inner2 = document.getElementById(prev_pair.querySelector(dataToSeparate).textContent).innerHTML.replace('png">/','png">&nbsp;/');
				break;

			case ".syncGrid":
				inner = `<img src="${syncGridImgs[parseInt(curr_pair.querySelector(dataToSeparate).dataset.currentimage)]}">`;
				inner2 = `<img src="${syncGridImgs[parseInt(prev_pair.querySelector(dataToSeparate).dataset.currentimage)]}">`;
				break;

			case ".syncRoleEX":
				inner = curr_pair.querySelector(dataToSeparate).dataset.currentimage.replace("1",`<img src="images/icon_role_ex.png">`).replace("0",`<img src="images/icon_role_ex_2.png">`);
				inner2 = prev_pair.querySelector(dataToSeparate).dataset.currentimage.replace("1",`<img src="images/icon_role_ex.png">`).replace("0",`<img src="images/icon_role_ex_2.png">`);
				break;

			default:
				inner = curr_pair.querySelector(dataToSeparate).innerHTML.replace(" (Special)","").replace(" (Physical)","").replaceAll("|2","");
				inner2 = prev_pair.querySelector(dataToSeparate).innerHTML.replace(" (Special)","").replace(" (Physical)","").replaceAll("|2","");
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

function removeEmptySeparators() {
	if(document.getElementById("hideEmptySeparators").checked && document.getElementsByClassName("selectedFilter").length > 0) {

		showSeparator(sortIdToSyncpairInfo[document.getElementById("sorting").querySelector(".btnBlue").id]);

		var pairs = document.getElementById("syncPairs").children;

		var pairFound = false;
		for(var i=pairs.length-1; i>=0; i--) {
			var element = pairs[i];

			if(element.classList.contains('found')) {
				pairFound = true;
			}
			if(element.classList.contains('separator')) {
				if(!pairFound) {
					element.remove();
				} else {
					pairFound = false;
				}
			}
		}
	}
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
	document.getElementById("pairsCounter").classList.add("forScreenshot");
	document.getElementById("syncPairs").classList.add("forScreenshot");
	document.getElementById("items").classList.add("forScreenshot");
	document.getElementById("linkTool").classList.remove("hide");

	if(document.getElementsByClassName("selectedFilter").length > 0) {
		document.getElementById("pairsCounterSelected").classList.add("hide");
		document.getElementById("pairsCounterTotal").classList.add("hide");
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

			document.getElementById("pairsCounter").classList.remove("forScreenshot");
			document.getElementById("syncPairs").classList.remove("forScreenshot");
			document.getElementById("items").classList.remove("forScreenshot");
			document.getElementById("linkTool").classList.add("hide");

			document.getElementById("pairsCounterSelected").classList.remove("hide");
			document.getElementById("pairsCounterTotal").classList.remove("hide");

			document.getElementById("leftSide").classList.remove("leftSideVisible");

			document.getElementById("image_rotate").classList.add("hide");
			document.getElementById("image_done").classList.remove("hide");
	});
}



/*-----------------------------------------------------------------------------
	EVENTS LISTENERS
-----------------------------------------------------------------------------*/

function addEventLeftSide() {

	Array.from(document.getElementById("filters").getElementsByTagName("button")).forEach(b => b.addEventListener("click", function() {

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


	var sortBtns = Array.from(document.getElementById("sorting").getElementsByTagName("button"));
	sortBtns.forEach(b => b.addEventListener("click", function() {

		sortBtns.forEach(b => b.classList.remove("btnBlue"));

		b.classList.add("btnBlue");

		removeEmptySeparators();
	}))


	Array.from(document.getElementsByClassName("buttonGroupTitle")).concat(Array.from(document.getElementsByClassName("buttonGroupTitle2"))).forEach(g => g.addEventListener("click", function() {
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

document.getElementById("btnItems").addEventListener("click", showCandy);

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
document.getElementById("increaseSyncGrid").addEventListener("click", increaseSyncGrid);

document.getElementById("decreaseSyncStar").addEventListener("click", decreaseSyncStar);
document.getElementById("decreaseSyncLevel").addEventListener("click", decreaseSyncLevel);
document.getElementById("decreaseFavorite").addEventListener("click", decreaseFavorite);
document.getElementById("decreaseSyncGrid").addEventListener("click", decreaseSyncGrid);

document.getElementById("resetSyncStar").addEventListener("click", resetSyncStar);
document.getElementById("resetSyncLevel").addEventListener("click", resetSyncLevel);
document.getElementById("resetFavorite").addEventListener("click", resetFavorite);
document.getElementById("resetSyncGrid").addEventListener("click", resetSyncGrid);

document.getElementById("unlockEXRole").addEventListener("click", unlockEXRole);
document.getElementById("resetEXRole").addEventListener("click", resetEXRole);


Array.from(document.getElementById("selectionHearts2").getElementsByClassName("btn")).forEach(b => 
	b.addEventListener("click", function() { selectHeart(this.value); }))

document.getElementById("visibilityBtns").addEventListener("click", visibilityOptions);

document.getElementById("allVisible").addEventListener("click", function() { elementVisible(this.id); });
document.getElementById("selectedVisible").addEventListener("click", function() { elementVisible(this.id); });
document.getElementById("notSelectedVisible").addEventListener("click", function() { elementVisible(this.id); });

document.getElementById("datamineVisible").addEventListener("click", function() { elementVisible(this.id); });

document.getElementById("pairsCounterPercentageVisible").addEventListener("click", function() { elementVisible(this.id); });
document.getElementById("syncFavsVisible").addEventListener("click", function() { elementVisible(this.id); });
document.getElementById("syncInfosVisible").addEventListener("click", function() { elementVisible(this.id); });
document.getElementById("syncRoleVisible").addEventListener("click", function() { elementVisible(this.id); });
document.getElementById("syncRoleEXVisible").addEventListener("click", function() { elementVisible(this.id); });
document.getElementById("syncGridVisible").addEventListener("click", function() { elementVisible(this.id); });
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


Array.from(document.getElementById("sorting").getElementsByClassName("btn")).forEach(b => 
	b.addEventListener("click", function() {
		if(document.getElementById("showSeparator").checked && this.id == "sortByDate") {
			document.getElementById("separateByDateOptions").classList.remove("hide");
		} else { document.getElementById("separateByDateOptions").classList.add("hide"); }
}))
document.getElementById("showSeparator").addEventListener("change", function() {
	if(document.getElementById("sortByDate").classList.contains("btnBlue")) {
		if(this.checked) { document.getElementById("separateByDateOptions").classList.remove("hide");
		} else { document.getElementById("separateByDateOptions").classList.add("hide"); }
	}
})
document.getElementById("separateByYear").addEventListener("click", function() { showSeparator(".infoReleaseDate"); removeEmptySeparators(); });
document.getElementById("separateByMonth").addEventListener("click", function() { showSeparator(".infoReleaseDate"); removeEmptySeparators(); });
document.getElementById("separateByDay").addEventListener("click", function() { showSeparator(".infoReleaseDate"); removeEmptySeparators(); });



document.getElementById("sortingOrder").addEventListener("click", function() {

	if(this.dataset.asc == "true") {
		this.dataset.asc = false; this.innerHTML = "⬆";
	} else {
		this.dataset.asc = true; this.innerHTML = "⬇";
	}

	document.querySelector("#sorting .btnBlue").click();
})


document.getElementById("sortByDexNumber").addEventListener("click", function() {
	var ord;
	if(document.getElementById("sortingOrder").dataset.asc === "true") { ord = "asc"; }
	else { ord = "desc"; }

	tinysort('.syncPair',{attr:'data-id',order:ord});

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
	tinysort('.syncPair',{sortFunction:function(a,b){
		var lenA = a.elm.querySelector(".syncInfos ." + btn[1]).innerHTML;
		var lenB = b.elm.querySelector(".syncInfos ." + btn[1]).innerHTML;

		if(document.getElementById("sortingOrder").dataset.asc === "true") {
			if(btn[0] == "sortByDate") { return lenA===lenB?0:(lenA<lenB?1:-1); }
			return lenA===lenB?0:(lenA>lenB?1:-1);
		} else {
			if(btn[0] == "sortByDate") { return lenA===lenB?0:(lenA>lenB?1:-1); }
			return lenA===lenB?0:(lenA<lenB?1:-1);
		}

	}});

	if(document.getElementById("showSeparator").checked) { showSeparator("."+btn[1]); }
}))

/* contains all pair of [btn_id, class_el_to_sort] */
var sortTypes = [
	["sortByType","infoPokemonType"],
	["sortByWeakness","infoPokemonWeak"],
	["sortByRole","infoSyncPairRole"],
	["sortByRoleEX","infoSyncPairRoleEX"],
	["sortByRegion","infoSyncPairRegion"],
	["sortByAcquisition","infoSyncPairAcquisition"],
	["sortByRoleCombi","infoSyncPairRoleCombi"]
]

/* for each sort button, add an eventlistener that call a function that
sort the related class with asc/desc order stored in data attribute */
sortTypes.forEach(btn => document.getElementById(btn[0]).addEventListener("click", function() {
	tinysort('.syncPair',{sortFunction:function(a,b){
		var lenA = a.elm.querySelector(".syncInfos ." + btn[1]).dataset.order;
		var lenB = b.elm.querySelector(".syncInfos ." + btn[1]).dataset.order;

		if(document.getElementById("sortingOrder").dataset.asc === "true") {
			return lenA===lenB?0:(lenA>lenB?1:-1);
		} else {
			return lenA===lenB?0:(lenA<lenB?1:-1);
		}
	}});

	if(document.getElementById("showSeparator").checked) { showSeparator("."+btn[1]); }
}))

document.getElementById("sortByStar").addEventListener("click", function() {
	tinysort('.syncPair',{sortFunction:function(a,b){
		var lenA = parseInt(a.elm.querySelector(".syncStar").dataset.currentstar);
		var lenB = parseInt(b.elm.querySelector(".syncStar").dataset.currentstar);

		if(document.getElementById("sortingOrder").dataset.asc === "true") {
			return lenA===lenB?0:(lenA<lenB?1:-1);
		} else {
			return lenA===lenB?0:(lenA>lenB?1:-1);
		}
	}});


	if(document.getElementById("showSeparator").checked) { showSeparator(".syncStar"); }
})


var sortTypes2 = [
	["sortBySyncLevel","syncLevel"],
	["sortByGrid","syncGrid"],
	["sortByEXRoleUnlock","syncRoleEX"]
]

sortTypes2.forEach(btn => document.getElementById(btn[0]).addEventListener("click", function() {
	tinysort('.syncPair',{sortFunction:function(a,b){
		var lenA = parseInt(a.elm.querySelector("." + btn[1]).dataset.currentimage);
		var lenB = parseInt(b.elm.querySelector("." + btn[1]).dataset.currentimage);

		if(document.getElementById("sortingOrder").dataset.asc === "true") {
			return lenA===lenB?0:(lenA<lenB?1:-1);
		} else {
			return lenA===lenB?0:(lenA>lenB?1:-1);
		}
	}});

	if(document.getElementById("showSeparator").checked) { showSeparator("."+btn[1]); }
}))


document.getElementById("sortByFavorite").addEventListener("click", function() {
	tinysort('.syncPair',{sortFunction:function(a,b){
		var lenA = parseInt(a.elm.querySelector(".syncFav").dataset.currentvalues);
		var lenB = parseInt(b.elm.querySelector(".syncFav").dataset.currentvalues);

		if(document.getElementById("sortingOrder").dataset.asc === "true") {
			return lenA===lenB?0:(lenA>lenB?1:-1);
		} else {
			return lenA===lenB?0:(lenA<lenB?1:-1);
		}
	}});

	if(document.getElementById("showSeparator").checked) { showSeparator(".syncFav"); }
})

document.getElementById("sortBySelected").addEventListener("click", function() {
	
	if(document.getElementById("sortingOrder").dataset.asc === "true") {
		tinysort('.syncPair',{attr:'class',order:'desc'});
	} else {
		tinysort('.syncPair',{attr:'class',order:'asc'});
	}

	if(document.getElementById("showSeparator").checked) { showSeparator(".selected"); }
})


document.getElementById("showSeparator").addEventListener("click", function() {

	document.getElementById("hideEmptySeparatorsParentDiv").classList.toggle("hide");
	if(!this.checked) { document.getElementById("hideEmptySeparators").checked = false; }

	removeSeparator();

	var selectedBtn = document.getElementById("sorting").querySelector(".btnBlue");

	selectedBtn.dataset.asc = !(selectedBtn.dataset.asc === "true");
	selectedBtn.click();
})

document.getElementById("hideEmptySeparators").addEventListener("click", function() {
	removeEmptySeparators();

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

	document.getElementById("leftSideHead").classList.add("hide");
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

	document.getElementById("leftSideHead").classList.remove("hide");
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

	try { generatePairs(SYNCPAIRS);	} catch(e) {
		console.log(e);
		document.getElementById("syncPairs").innerHTML = "<p>Something went wrong, try to hard refresh the page.<br>or<br>Go to <a target='_blank' href='https://pomasters.github.io/SyncPairsTrackerOld/'>https://pomasters.github.io/SyncPairsTrackerOld/</a> to get your export code.</p>";
	}

	addEventLeftSide();
}


window.onload = init;
import {SYNCPAIRS, VERSION} from "./syncpairs.js";
import {EGGS} from "./eggs.js";
import {NEWS} from "./news.js";
import {ITEMS} from "./items.js";

const SYNCLEVELIMGS = ["images/1.png","images/2.png","images/3.png","images/4.png","images/5.png"];
const SYNCSTARIMGS = ["images/star/1.png","images/star/2.png","images/star/3.png","images/star/4.png","images/star/5.png"];
const SYNCSTARIMGS2 = ["images/star1.png","images/star2.png","images/star3.png","images/star4.png","images/star5.png","images/star6ex.png"];
const syncFavImgs = ["images/favoriteG.png","images/favoriteL.png","images/favoriteY.png","images/favoriteO.png","images/favoriteM.png","images/favoriteR.png","images/favoriteP.png","images/favoriteV.png","images/favoriteW.png","images/favoriteD.png","images/favoriteB.png","images/favoriteC.png"];
const SYNCGRIDIMGS = ["images/grid60.png","images/grid62.png","images/grid64.png","images/grid66.png","images/grid68.png","images/grid70_2.png"];
const SYNCSUPERAWAKENINGIMGS = ["images/1_2.png","images/2_2.png","images/3_2.png","images/4_2.png","images/5_2.png"];
const TYPESORDER = {"normal":"01","fire":"02","water":"03","electric":"04","grass":"05","ice":"06","fighting":"07","poison":"08","ground":"09","flying":"10","psychic":"11","bug":"12","rock":"13","ghost":"14","dragon":"15","dark":"16","steel":"17","fairy":"18"};
const ROLESORDER = {"":"10","strike (physical)":"01","strike (special)":"01","tech":"02","support":"03","sprint":"04","field":"05","multi":"06"};
const REGIONSORDER = {"pasio":"99","kanto":"01","johto":"02","hoenn":"03","sinnoh":"04","unova":"05","kalos":"06","alola":"07","galar":"08","paldea":"09"}
const ACQUISITIONORDER = {"spotlight scout / general pool":"01","poké fair scout":"02","master fair scout":"03","seasonal scout":"04","special costume scout":"05","variety scout":"06","main story: pml arc":"07","legendary adventures":"08","event reward":"09","battle points exchange":"10","trainer lodge exchange":"11","mix scout":"12", "training ticket exchange":"13", "arc suit fair scout":"14", "gym scout":"15"}
const SYNCROLEIMGS = {"strike (physical)": ["images/role_strike.png","images/role_ex_strike.png"],"strike (special)": ["images/role_strike.png","images/role_ex_strike.png"],"tech": ["images/role_tech.png","images/role_ex_tech.png"],"support": ["images/role_support.png","images/role_ex_support.png"],"sprint": ["images/role_sprint.png","images/role_ex_sprint.png"],"field": ["images/role_field.png","images/role_ex_field.png"], "multi": ["images/role_multi.png"], "strike<>tech<>support": ["images/role_egg.png"]}
const SORTIDTOSYNCPAIRINFO = {"sortByDexNumber": ".infoDexNum", "sortByPokemonNumber": ".infoPokemonNum", "sortByTrainer": ".infoTrainerName", "sortByStar": ".syncStar", "sortByRole": ".infoSyncPairRole", "sortByRoleEX": ".infoSyncPairRoleEX", "sortByType": ".infoPokemonType", "sortByWeakness": ".infoPokemonWeak", "sortByRegion": ".infoSyncPairRegion", "sortByDate": ".infoReleaseDate", "sortBySyncLevel": ".syncLevel", "sortBySyncSuperawakening": ".syncLevel2", "sortBySelected": ".selected", "sortByFavorite": ".syncFav", "sortByAcquisition": ".infoSyncPairAcquisition", "sortByGrid": ".syncGrid", "sortByEXRoleUnlock": ".syncRoleEX", "sortByRoleCombi": ".infoSyncPairRoleCombi"}
const ROLECOMBIS = {"strike,":"N/A","strike,strike":"1111","strike,tech":"1221","strike,support":"1331","strike,sprint":"1441","strike,field":"1551","strike,multi":"6116","tech,":"N/A","tech,tech":"2222","tech,strike":"1221","tech,support":"2332","tech,sprint":"2442","tech,field":"2552","tech,multi":"6226","support,":"N/A","support,support":"3333","support,strike":"1331","support,tech":"2332","support,sprint":"3443","support,field":"3553","support,multi":"6336","sprint,":"N/A","sprint,sprint":"4444","sprint,strike":"1441","sprint,tech":"2442","sprint,support":"3443","sprint,field":"4554","sprint,multi":"6446","field,":"N/A","field,field":"5555","field,strike":"1551","field,tech":"2552","field,support":"3553","field,sprint":"4554","field,multi":"6556","multi,":"N/A","multi,multi":"6666","multi,strike":"6116","multi,tech":"6226","multi,support":"6336","multi,sprint":"6446","multi,field":"6556"}
const MAPPINGLEVELS = [1,2,3,4,5,5,5,5,5,5]

/*-----------------------------------------------------------------------------
	GENERATE ALL HTML ELEMENTS ABOUT THE SYNCPAIRS
-----------------------------------------------------------------------------*/

var DATENOW = new Date();

var EGGMONMODE = document.getElementById("btnEggs").classList.contains("btnEggsON");

var CURRENT_NEW = 0;

var FILTER_MODE = "&";

var DEFAULT_FAVS_VALUES = Array(syncFavImgs.length).fill("0").join(""); // 00000000


/* parameter "pairs" is the array containing all {syncpair} -- see syncpairs.js/eggs.js */
function generatePairsHTML(pairs) {
	var result = "";

	if(EGGMONMODE) {
		document.getElementById("syncPairs").classList.add("modeEgg");
	} else {
		document.getElementById("syncPairs").classList.remove("modeEgg");
	}

	pairs.forEach((pair, index) => { result += generatePairHTML(pair, index) });

	document.getElementById("syncPairs").innerHTML = result;
}


function generatePairHTML(pair, i) {

	var datamine = "";
	var dateRelease = new Date(pair.releaseDate + "T23:00:00-07:00"); //add 23:00:00 PDT
	if(dateRelease.getTime()-86400000 > DATENOW.getTime()) { datamine = " datamine"; } // -86400000 => the previous day

	var roleCombi = "roleCombi" + ROLECOMBIS[pair.syncPairRole.toLowerCase().split(" ")[0]+","+pair.syncPairRoleEX.toLowerCase().split(" ")[0]];

	var imagesData = getImagesDataFromLocalStorage(pair);
	var innerHtmlImages = generateImagesPairHTML(pair, imagesData);

	function tags(tags, tag_type) { return tags.map((t) => tag_type + t).join(", "); }

	return `<div class="syncPair${imagesData["selectionValue"]}${datamine}" data-id="${i}">

			${innerHtmlImages}

			<div class="syncInfos" data-html2canvas-ignore="true">
				<p class="infoDexNum">${pair.dexNumber}</p>
				<p class="infoTrainerName">${pair.trainerName}</p>
				<p class="infoTrainerAltName">${pair.trainerAlt}</p>
				<p class="infoPokemonNum">${pair.pokemonNumber}</p>
				<p class="infoPokemonName">${pair.pokemonName}
					<span class="infoPokemonGender">${pair.pokemonGender}</span>
				</p>
				<p class="infoPokemonForms">${tags(pair.pokemonForm, "")}</p>
				<p data-order="${TYPESORDER[pair.pokemonType.toLowerCase()]}" class="infoPokemonType">${pair.pokemonType}</p>
				<p data-order="${TYPESORDER[pair.pokemonWeak.toLowerCase()]}" class="infoPokemonWeak">${pair.pokemonWeak}</p>
				<p data-order="${ROLESORDER[pair.syncPairRole.toLowerCase()]}" class="infoSyncPairRole">${pair.syncPairRole}</p>
				<p data-order="${ROLESORDER[pair.syncPairRoleEX.toLowerCase()]}" class="infoSyncPairRoleEX">${pair.syncPairRoleEX}</p>
				<p data-order="${roleCombi}" class="infoSyncPairRoleCombi">${roleCombi}</p>
				<p class="infoSyncPairRarity">${pair.syncPairRarity}</p>
				<p class="infoSyncPairEXPose">${pair.syncPairEXPose}</p>
				<p class="infoSyncPairEXColor">${pair.syncPairEXColor}</p>
				<p class="infoSyncPairSuperawakening">${pair.syncPairSuperawakening}</p>
				<p class="infoReleaseDate">${pair.releaseDate}</p>
				<p data-order="${ACQUISITIONORDER[pair.syncPairAcquisition.toLowerCase()]}" class="infoSyncPairAcquisition">${pair.syncPairAcquisition}</p>
				<p data-order="${REGIONSORDER[pair.syncPairRegion.toLowerCase()]}" class="infoSyncPairRegion">${pair.syncPairRegion}</p>
				<p class="infoSyncPairThemes">${tags(pair.themes, "theme_")}</p>
				<p class="infoSyncPairTags">${tags(pair.tags, "")}</p>
			</div>
		</div>`;
}


function getImagesDataFromLocalStorage(pair) {

	var keySyncPairStorage = pair.trainerName + "|" + pair.pokemonNumber;

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

		if(isNaN(currentSyncLevel)) { currentSyncLevel = 0 }
		if(isNaN(currentSyncImage)) { currentSyncImage = 0 }
		if(isNaN(currentSyncStar)) { currentSyncStar = 0 }
		if("" == currentSyncFav) { currentSyncFav = DEFAULT_FAVS_VALUES }
		if(isNaN(currentSyncRoleEX)) { currentSyncRoleEX = 0 }
		if(isNaN(currentSyncGrid)) { currentSyncGrid = 0 }

		/* Eggs: Adjustment for the player character because star image are separated
		Normal : Adjustment for the player character because of Bettie AND Scottie */
		var currentStar;
		if(! EGGMONMODE) {
			if(pair.trainerName == "Player") {
				currentStar = Math.floor(currentSyncImage/2) + parseInt(pair.syncPairRarity);
			} else {
				currentStar = parseInt(pair.syncPairRarity) + parseInt(currentSyncImage);
			}
		} else { currentStar = parseInt(pair.syncPairRarity) + parseInt(currentSyncStar); }

		return {
			"selectionValue": " selected",
			"syncStar-currentImage": currentSyncStar,
			"syncStar-currentstar": currentStar,
			"syncFav-currentValues": currentSyncFav,
			"syncLevel-currentImage": currentSyncLevel,
			"syncRole-currentImage": "",
			"syncRoleEX-currentImage": currentSyncRoleEX,
			"syncImages-currentImage": currentSyncImage,
			"syncGrid-currentImage": currentSyncGrid
		}
	}

	return {
		"selectionValue": "",
		"syncStar-currentImage": 0,
		"syncStar-currentstar": pair.syncPairRarity,
		"syncFav-currentValues": DEFAULT_FAVS_VALUES,
		"syncLevel-currentImage": 0,
		"syncRole-currentImage": "",
		"syncRoleEX-currentImage": 0,
		"syncImages-currentImage": 0,
		"syncGrid-currentImage": 0
	}
}


function generateImagesPairHTML(pair, imagesData) {

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
			} else { im += `<img draggable="false" loading="lazy" src="${imgs[i]}">` }
		}
		return im;
	}

	function genHeartsImages(imgs, current_v) {
		var im = "";
		var current_va = convertFav(current_v).split("");

		for(var i=0; i<imgs.length; i++) {
			if(current_va[i] == "0") { im += `<img draggable="false" loading="lazy" src="${imgs[i]}">`
			} else { im += `<img draggable="false" loading="lazy" src="${imgs[i]}" class="currentImage">` }
		}
		return im;
	}

	var imgsSuperawakening = pair.syncPairSuperawakening ? SYNCSUPERAWAKENINGIMGS : [];
	var superawakened = (imagesData["syncLevel-currentImage"] > 4);

	return `<div class="syncStar" data-currentImage="${imagesData["syncStar-currentImage"]}" data-currentstar="${imagesData["syncStar-currentstar"]}">
			${genImages(SYNCSTARIMGS, imagesData["syncStar-currentImage"])}
		</div>

		<div class="syncFav" data-currentValues="${imagesData["syncFav-currentValues"]}" data-html2canvas-ignore="true">
			${genHeartsImages(syncFavImgs, imagesData["syncFav-currentValues"])}
		</div>

		<div class="syncLevel" data-currentImage="${imagesData["syncLevel-currentImage"]}" data-currentlevel="${MAPPINGLEVELS[imagesData["syncLevel-currentImage"]]}" data-superawakening="${superawakened}">
			${genImages(SYNCLEVELIMGS.concat(imgsSuperawakening), imagesData["syncLevel-currentImage"])}
		</div>

		<div class="syncRoles">
			<div class="syncRole">${genImages([SYNCROLEIMGS[pair.syncPairRole.toLowerCase()][0]], 0)}</div>
			<div class="syncRoleEX" data-currentImage="${imagesData["syncRoleEX-currentImage"]}">${genImages(SYNCROLEIMGS[pair.syncPairRoleEX.toLowerCase()], imagesData["syncRoleEX-currentImage"])}</div>
		</div>

		<div class="syncImages" data-currentImage="${imagesData["syncImages-currentImage"]}">
			${genImages(pair.images, imagesData["syncImages-currentImage"])}
		</div>

		<div class="syncGrid" data-currentImage="${imagesData["syncGrid-currentImage"]}">
			${genImages(SYNCGRIDIMGS, imagesData["syncGrid-currentImage"])}
		</div>`;
}



var ua = window.navigator.userAgent;
var iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
var webkit = !!ua.match(/WebKit/i);
var iOSSafari = iOS && webkit && !ua.match(/CriOS/i);

/* add eventlisterner to all ".syncpair" elements, move level and images */
function addSyncPairsEvents() {
	const qsAll = cls => Array.from(document.getElementsByClassName(cls));

	const syncStars   = qsAll("syncStar");
	const syncFavs    = qsAll("syncFav");
	const syncLevels  = qsAll("syncLevel");
	const syncImages  = qsAll("syncImages");
	const syncRoles   = qsAll("syncRoles");
	const syncGrids   = qsAll("syncGrid");

	const syncStarLevels = [...syncStars, ...syncLevels, ...syncRoles, ...syncGrids];
	const syncStarLevelsImages = [...syncImages, ...syncStarLevels];

	const isLocked = () =>
		localStorage.getItem("viewMode") === "true" ||
		localStorage.getItem("lockMode") === "true";

	syncImages.forEach(img => img.addEventListener("click", () => {
		if(isLocked()) return;
		const pair = img.parentElement;
		pair.classList.contains("selected") ? unselect(pair) : select(pair);
		countSelection();
	}));

	const handleSwap = el => {
		if(!isLocked() && el.parentElement.classList.contains("selected")) {
			swapImages(el, 1);
			addToLocalStorage(el.parentElement);
		}
	};

	syncStarLevels.forEach(el => el.addEventListener("click", () => handleSwap(el)));

	syncFavs.forEach(fav => {
		Array.from(fav.children).forEach(heart =>
			heart.addEventListener("click", () => {
				heart.classList.toggle("currentImage");
				fav.dataset.currentvalues = Array.from(fav.children)
					.map(i => (i.classList.contains("currentImage") ? "1" : "0"))
					.join("");
				addToLocalStorage(fav.parentElement);
			})
		);
	});

	const altEvent = iOSSafari ? "long-press" : "contextmenu";

	syncStarLevelsImages.forEach(el =>
		el.addEventListener(altEvent, e => {
			if(!iOSSafari) {
				e.preventDefault();
				e.stopPropagation();
			}
			handleSwap(el);
			return false;
		})
	);
}



/* takes a <div> containing <img> elements and move the "currentImage" class through the images */
function swapImages(imgsContainer, step) {
	if(!imgsContainer || imgsContainer.children.length === 0) return;

	let container = imgsContainer.classList.contains("syncRoles")
		? imgsContainer.querySelector(".syncRoleEX")
		: imgsContainer;

	const parent = container.parentElement;
	const images = Array.from(container.children);

	const curr = parseInt(container.dataset.currentimage) || 0;
	let next = curr + step;

	const cycleIndex = (idx, len) => (idx < 0 ? len - 1 : idx >= len ? 0 : idx);

	if(container.classList.contains("syncGrid")) {
		let syncLvl = Math.min(4, parseInt(parent.querySelector(".syncLevel").dataset.currentimage));
		next = curr + step;
		if(step > 0 && next > syncLvl + 1) next = 0;
		if(step < 0 && next < 0) next = syncLvl + 1;
	} else {
		next = cycleIndex(next, images.length);
	}

	if(container.classList.contains("syncLevel")) {
		container.dataset.currentlevel = MAPPINGLEVELS[next];

		if(images.length === 5 && curr === 4) {
			parent.querySelector(".syncGrid").dataset.currentimage = "0";
			swapImages(parent.querySelector(".syncGrid"), 0);
		}

		if(images.length > 5) {
			if(curr <= 5 && step < 0) container.dataset.superawakening = "false";
			if(curr === 0 && step < 0) {
				container.dataset.superawakening = "true";
				container.dataset.currentlevel = "5";
			}
			if(curr >= 4 && step > 0) {
				container.dataset.superawakening = "true";
				container.dataset.currentlevel = "5";
			}
			if(curr === 9) {
				container.dataset.superawakening = "false";
				container.dataset.currentlevel = "1";
				parent.querySelector(".syncGrid").dataset.currentimage = "0";
				swapImages(parent.querySelector(".syncGrid"), 0);
			}
		}
	}

	images.forEach(i => i.removeAttribute("class"));
	images[next].classList.add("currentImage");
	container.dataset.currentimage = next;

	const rarity = parseInt(
		(container.classList.contains("syncRoleEX")
			? parent.parentElement
			: parent
		).querySelector(".infoSyncPairRarity").textContent
	);

	if(container.classList.contains("syncStar") && EGGMONMODE) {
		container.dataset.currentstar = rarity + next;
	}

	if(container.classList.contains("syncImages") && !EGGMONMODE) {
		const trainerName = parent.querySelector(".infoTrainerName").textContent;
		parent.querySelector(".syncStar").dataset.currentstar =
			trainerName === "Player" ? Math.floor(next / 2) + rarity : rarity + next;

		if(!container.innerHTML.includes(`EX.png" class="currentImage">`)) {
			const roleEX = parent.querySelector(".syncRoleEX");
			roleEX.dataset.currentimage = "0";
			const rolesImgs = Array.from(roleEX.children);
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

	document.getElementById("btnItems").classList.toggle("btnItemsON");
	document.getElementById("items").classList.toggle("hide");

	if(document.getElementById("items").innerHTML == "") {
		generateItemsHTML(ITEMS);
	}

	document.getElementById("items").scrollIntoView(true);
}

function generateItemsHTML(items) {
	const storedItems = JSON.parse(localStorage.getItem("syncPairsTrackerItems") || "{}");

	const result = items.map(it => {
		let count = parseInt(storedItems[it.name]) || 0;
		const noItemClass = count === 0 ? " noItem" : "";

		return `
			<div class="item itemBg_${it.background}${noItemClass}">
				<div class="itemInfos">
					<img draggable="false" class="itemImg" src="${it.image}">
					<p class="itemName">${it.name}</p>
					<p class="itemCount">${count}</p>
				</div>
				<div class="itemIncrDrec" data-html2canvas-ignore="true">
					<button type="button" class="btnIncreaseItem">+</button>
					<button type="button" class="btnDecreaseItem">-</button>
				</div>
			</div>`;
	}).join("");

	const container = document.getElementById("items");
	container.innerHTML = result;

	const saveItems = () => {
		const data = {};
		[...container.getElementsByClassName("item")].forEach(i => {
			data[i.querySelector(".itemName").textContent] = i.querySelector(".itemCount").textContent;
		});
		localStorage.setItem("syncPairsTrackerItems", JSON.stringify(data));
	};

	const updateCount = (itemHtml, delta) => {
		const countEl = itemHtml.querySelector(".itemCount");
		let count = parseInt(countEl.textContent) + delta;

		if(count <= 0) {
			count = 0;
			itemHtml.classList.add("noItem");
		} else {
			itemHtml.classList.remove("noItem");
		}
		countEl.textContent = count;
		saveItems();
	};

	[...container.getElementsByClassName("itemInfos")].forEach(info => {
		info.addEventListener("click", () => updateCount(info.parentElement, 1));

		if(iOSSafari) {
			info.addEventListener("long-press", () => updateCount(info.parentElement, -1));
		} else {
			info.addEventListener("contextmenu", e => {
				e.preventDefault();
				e.stopPropagation();
				updateCount(info.parentElement, -1);
				return false;
			});
		}
	});

	[...container.getElementsByClassName("btnIncreaseItem")].forEach(btn =>
		btn.addEventListener("click", () => updateCount(btn.closest(".item"), 1))
	);

	[...container.getElementsByClassName("btnDecreaseItem")].forEach(btn =>
		btn.addEventListener("click", () => updateCount(btn.closest(".item"), -1))
	);
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

	const resetChildren = (selector, resetFirst = true) => {
		const el = syncpair.querySelector(selector);
		if(!el) return;

		Array.from(el.children).forEach(c => c.classList.remove("currentImage"));
		if(resetFirst && el.children.length > 0) {
			el.children[0].classList.add("currentImage");
		}
		return el;
	};

	const star   = resetChildren(".syncStar");
	const fav    = resetChildren(".syncFav", false);
	const level  = resetChildren(".syncLevel");
	const images = resetChildren(".syncImages");
	const grid   = resetChildren(".syncGrid");
	const roleEX = resetChildren(".syncRoleEX");

	if(star) {
		star.dataset.currentstar  = syncpair.querySelector(".infoSyncPairRarity").textContent;
		star.dataset.currentimage = "0";
	}
	if(fav) {
		fav.dataset.currentvalues = DEFAULT_FAVS_VALUES;
	}
	if(level) {
		level.dataset.currentimage       = "0";
		level.dataset.currentlevel       = "1";
		level.dataset.superawakening     = "false";
	}
	if(images) {
		images.dataset.currentimage = "0";
	}
	if(grid) {
		grid.dataset.currentimage = "0";
	}
	if(roleEX && roleEX.children.length > 0) {
		roleEX.children[0].classList.add("currentImage");
		roleEX.dataset.currentimage = "0";
	}

	const trainer = syncpair.querySelector(".syncInfos .infoTrainerName")?.textContent;
	const pokeNum = syncpair.querySelector(".syncInfos .infoPokemonNum")?.textContent;
	if(trainer && pokeNum) {
		localStorage.removeItem(`${trainer}|${pokeNum}`);
	}
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
	const isActive = id => document.getElementById(id).classList.contains("btnYellow");

	const selector = isActive("datamineVisible") ? ".syncPair:not(.datamine)" : ".syncPair";

	const elements = [...document.querySelectorAll(selector)];
	const visibleEls = elements.filter(el => el.offsetParent !== null);
	const selectedEls = visibleEls.filter(el => el.classList.contains("selected"));

	let total = elements.length;
	let visible = visibleEls.length;
	let selected = selectedEls.length;

	if(isActive("selectedVisible")) {
		total = selected;
		visible = selected;
	} else if(isActive("notSelectedVisible")) {
		total = visible - selected;
		visible = total;
		selected = 0;
	}

	const update = (id, val) => document.getElementById(id).innerHTML = val;
	const format = (part, whole) => `${part} / ${whole}<span class="pairsCounterPercentage"> (${whole ? (part / whole * 100).toFixed(1) : "0.0"}%)</span>`;

	if(visible < total) {
		update("pairsCounterFound", format(selected, visible));
		update("pairsCounterFoundTotal", format(visible, total));
	} else {
		update("pairsCounterFound", "");
		update("pairsCounterFoundTotal", format(selected, total));
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
		var synFavHEX = parseInt(s.querySelector(".syncFav").dataset.currentvalues, 2).toString(16).toUpperCase().padStart(3, "0");
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
				var importedSyncFav = convertFav(parseInt(currentSyncData[3], 16).toString(2).padStart(12, "0"));
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
				syncLevelDIV.dataset.currentlevel = MAPPINGLEVELS[parseInt(importedSyncLevel)];
				syncLevelDIV.dataset.superawakening = (parseInt(importedSyncLevel) >= 5);
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

const CSS_RULES = {
	allVisible: "",
	selectedVisible: `.syncPair:not([class*="selected"]) { display: none !important; }`,
	notSelectedVisible: `.syncPair[class*="selected"] { display: none !important; }`,
	datamineVisible: `.datamine { display: none !important; } #datamineVisible { text-decoration: line-through; text-decoration-thickness: 2px; }`,
	pairsCounterPercentageVisible: `.pairsCounterPercentage { display: none; }`,
	syncInfosVisible: `.syncPair:hover > .syncInfos { display: none !important; }`,
	syncFavsVisible: `.syncFav { display: none !important; }`,
	syncRoleVisible: `.syncRole { display: none !important; }`,
	syncRoleEXVisible: `.syncRoleEX { display: none !important; }`,
	syncGridVisible: `.syncGrid { display: none !important; }`,
	fullWidthVisible: `
		#main { width: 100%; } 
		#rightSide { margin-left: 25%; width: 100%; }
		@media only screen and (max-width: 1600px) { #rightSide { margin-left: 30% } }
		@media only screen and (max-width: 1400px) { #rightSide { margin-left: 40% } }
		@media only screen and (max-width: 1200px) { #rightSide { margin-left: 50% } }
		@media only screen and (max-width: 1024px) { #rightSide { margin-left: auto } }
	`
};

function setVisibility(choices) {
	localStorage.setItem("visibilityOptions", JSON.stringify(choices));

	document.getElementById("visibilityMode").innerHTML = choices.map(choice => CSS_RULES[choice] || "").join("\n");

	choices.forEach(choice => {
		const el = document.getElementById(choice);
		if(el) {
			el.checked = true;
			el.classList.add("btnYellow");
		}
	});
}

function loadVisibilityFromLocalStorage() {
	const defaultOptions = ["allVisible", "syncRoleVisible", "syncInfosVisible"];
	const options = localStorage.getItem("visibilityOptions")
		? JSON.parse(localStorage.getItem("visibilityOptions"))
		: defaultOptions;

	setVisibility(options);

	["lockMode", "viewMode"].forEach(mode => {
		const el = document.getElementById(`${mode}Css`);
		if(el && localStorage.getItem(mode) !== null) {
			el.disabled = localStorage.getItem(mode) !== "true";
		}
	});
}



function dateInterval() {
	searchFilters();

	const date1 = document.getElementById("date1").value || "2019-08-29";
	const date2 = document.getElementById("date2").value || "2024-12-31";

	const hasFilters = document.getElementsByClassName("selectedFilter").length > 0 || document.getElementById("search").value !== "";
	const syncPairs = hasFilters ? document.querySelectorAll(".syncPair.found") : Array.from(document.getElementsByClassName("syncPair"));

	syncPairs.forEach(pair => {
		const datePair = pair.querySelector(".infoReleaseDate").textContent;
		const inRange = date1 <= datePair && datePair <= date2;

		pair.classList.toggle("found", inRange);
		pair.classList.toggle("notFound", !inRange);
	});

	let selectedFiltersCount = document.getElementsByClassName("selectedFilter").length;
	if(document.getElementById("search").value !== "") selectedFiltersCount++;

	const filtersUsedEl = document.getElementById("filtersUsed");
	filtersUsedEl.innerHTML = `<span class="filterDate">📅 ${date1} → 📅 ${date2}</span>${filtersUsedEl.innerHTML}`;

	const removeFiltersEl = document.getElementById("removeFilters");
	removeFiltersEl.classList.add("btnRed");
	removeFiltersEl.innerHTML = `× filters (${selectedFiltersCount + 1})`;

	document.getElementById("mobileMenuFilters").classList.add("mobileMenu_selected");

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
	const rawFilters = input.split(",,").map(s => s.trim()).filter(Boolean);

	const tokens = rawFilters.map(f => {
		const neg = f.startsWith("!");
		const val = (neg ? f.slice(1) : f).trim().toLowerCase();
		return val ? { neg, val } : null;
	}).filter(Boolean);

	const hasTokens = tokens.length > 0;

	Array.from(document.getElementsByClassName("syncPair")).forEach(syncPair => {
		syncPair.classList.remove("found", "notFound");

		const text = syncPair.outerHTML.replaceAll("&lt;&gt;", "<>").toLowerCase();

		if(!hasTokens) return;

		const matches = tokens.map(t => t.neg ? !text.includes(t.val) : text.includes(t.val));

		const overallMatch = FILTER_MODE === "&" ? matches.every(Boolean) : matches.some(Boolean);

		if(overallMatch) syncPair.classList.add("found");
		else syncPair.classList.add("notFound");
	});

	countSelection();
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

	const searchValue = document.getElementById("search").value.trim();
	if(searchValue) {
		const toSearch = searchValue
			.replace(/\s*,\s*/g, ",")
			.split(",")
			.filter(Boolean);

		toSearch.forEach(el => {
			filters.push('Name">' + el);
			filtersSPAN.push(`<span>${el}</span>`);
		});
	}

	document.getElementById("filtersUsed").innerHTML = filtersSPAN.join(` ${FILTER_MODE} `);

	search(filters.join(",,"));

	const removeBtn = document.getElementById("removeFilters");
	const mobileMenu = document.getElementById("mobileMenuFilters");

	if(filters.length > 0) {
		removeBtn.classList.add("btnRed");
		mobileMenu.classList.add("mobileMenu_selected");
		removeBtn.innerHTML = `× filters (${filters.length})`;
	} else {
		removeBtn.classList.remove("btnRed");
		mobileMenu.classList.remove("mobileMenu_selected");
		removeBtn.innerHTML = `× filters`
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
	Array.from(document.getElementsByClassName("selectedFilter")).forEach(f => f.classList.remove("selectedFilter", "filterToHide"));
	document.getElementById("btnDate").classList.remove("filterDateEnable");
	searchFiltersORdateInterval();

	if(document.getElementById("hideEmptySeparators").checked) {
		showSeparator(SORTIDTOSYNCPAIRINFO[document.getElementById("sorting").querySelector(".btnBlue").id]);
	}
}


/* Separators */
function showSeparator(dataToSeparate) {
	removeSeparator();

	const syncPairs = Array.from(document.getElementsByClassName("syncPair"));
	if(!syncPairs.length) return;

	const handlers = {
		".syncStar": el => `<img src="${SYNCSTARIMGS2[Math.max(parseInt(el.dataset.currentstar)-1,0)]}">`,

		".syncLevel": el => {
			const idx = Math.min(parseInt(el.dataset.currentimage), 4);
			return `<img src="${SYNCLEVELIMGS[idx]}">`;
		},

		".syncLevel2": el => {
			const levelEl = el.closest(".syncPair").querySelector(".syncLevel");
			const idx = parseInt(levelEl.dataset.currentimage);
			const src = idx <= 4 ? "images/0.png" : SYNCLEVELIMGS.concat(SYNCSUPERAWAKENINGIMGS)[idx];
			return `<img src="${src}">`;
		},

		".syncFav": el => {
			const imgs = Array.from(el.getElementsByClassName("currentImage")).map(i => i.outerHTML);
			return imgs.length ? imgs.join("") : `<img draggable="false" loading="lazy" src="images/favorite1.png">`;
		},

		".selected": el => el.classList.contains("selected") ? "Have" : "Not have",

		".infoReleaseDate": el => {
			let val = el.textContent;
			if(document.getElementById("separateByYear").checked) val = val.substring(0,4);
			else if(document.getElementById("separateByMonth").checked) val = val.substring(0,7);
			return val;
		},

		".infoPokemonType": el => `<img src="images/type_${el.textContent.toLowerCase()}.png">&nbsp;${el.textContent}`,

		".infoSyncPairRole": el => {
			const r = el.textContent.replace(/ \((Special|Physical)\)/,"");
			return `<img src="images/role_${r.toLowerCase()}.png">&nbsp;${r}`;
		},

		".infoSyncPairRoleEX": el => {
			const r = el.textContent.replace(/ \((Special|Physical)\)/,"");
			const html = `<img src="images/role_ex_${r.toLowerCase()}.png">&nbsp;${r}`;
			return html.includes("role_ex_.png") ? "" : html;
		},

		".infoSyncPairRoleCombi": el => document.getElementById(el.textContent).innerHTML.replace('png">/','png">&nbsp;/'),

		".syncGrid": el => `<img src="${SYNCGRIDIMGS[parseInt(el.dataset.currentimage)]}">`,

		".syncRoleEX": el => el.dataset.currentimage.replace("1",`<img src="images/icon_role_ex.png">`).replace("0",`<img src="images/icon_role_ex_2.png">`),

		default: el => el.textContent.replace(/ \((Special|Physical)\)|\|2/g,"")
	};

	const getInner = el => (handlers[dataToSeparate] || handlers.default)(el);

	let prevValue = getInner(syncPairs[0].querySelector(dataToSeparate) || syncPairs[0]);
	syncPairs[0].insertAdjacentHTML("beforebegin", `<div class="separator"><span>${prevValue}</span></div>`);

	for(let i = 1; i < syncPairs.length; i++) {
		const currEl = syncPairs[i].querySelector(dataToSeparate) || syncPairs[i];
		const currValue = getInner(currEl);

		if(currValue !== prevValue) {
			syncPairs[i].insertAdjacentHTML("beforebegin", `<div class="separator"><span>${currValue}</span></div>`);
			prevValue = currValue;
		}
	}
}


function removeSeparator() {
	Array.from(document.getElementsByClassName("separator")).forEach(s => s.remove());
}

function removeEmptySeparators() {
	const hideEmpty = document.getElementById("hideEmptySeparators").checked;
	const hasFilters = document.getElementsByClassName("selectedFilter").length > 0;

	if(!hideEmpty || !hasFilters) return;

	const sortBtn = document.getElementById("sorting").querySelector(".btnBlue");
	showSeparator(SORTIDTOSYNCPAIRINFO[sortBtn.id]);

	const pairs = Array.from(document.getElementById("syncPairs").children).reverse();
	let pairFound = false;

	for(const el of pairs) {
		if(el.classList.contains("separator") && !el.previousElementSibling?.classList.contains("found")) {
			el.remove();
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

	html2canvas(document.getElementById("rightSide"),{
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
					var img = document.createElement("img");

					img.src = url;
					img.setAttribute("draggable", "false");

					document.getElementById("screenshot").appendChild(img);
					document.getElementById("screenshot").scrollIntoView(true);

				} else if(id == "takeScreenshot2") {
					document.getElementById("screenshot").classList.add("hide");
					document.getElementById("screenshot").innerHTML = "";

					var url = URL.createObjectURL(blob);
					var link = document.createElement("a");

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

			document.getElementById("leftSide").classList.remove("leftSideVisible");

			document.getElementById("image_rotate").classList.add("hide");
			document.getElementById("image_done").classList.remove("hide");
	});
}



/*-----------------------------------------------------------------------------
	EVENTS LISTENERS
-----------------------------------------------------------------------------*/

function addEventLeftSide() {
	const filterButtons = [...document.getElementById("filters").getElementsByTagName("button")];
	filterButtons.forEach(b => b.addEventListener("click", () => {
		if(!b.classList.contains("selectedFilter")) {
			b.classList.add("selectedFilter");
			b.classList.remove("filterToHide");
		} else {
			b.classList.toggle("filterToHide");
			if(!b.classList.contains("filterToHide")) {
				b.classList.remove("selectedFilter");
			}
		}
		searchFiltersORdateInterval();
	}));

	const sortButtons = [...document.getElementById("sorting").getElementsByTagName("button")];
	sortButtons.forEach(b => b.addEventListener("click", () => {
		sortButtons.forEach(btn => btn.classList.remove("btnBlue"));
		b.classList.add("btnBlue");
		removeEmptySeparators();
	}));

	const groupTitles = [
		...document.getElementsByClassName("buttonGroupTitle"),
		...document.getElementsByClassName("buttonGroupTitle2")
	];
	groupTitles.forEach(g => g.addEventListener("click", () => g.parentElement.classList.toggle("groupClose")));
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

document.getElementById("btnDate").addEventListener("click", function() {
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
		this.dataset.asc = false; this.classList.remove("bi-sort-down-alt"); this.classList.add("bi-sort-up-alt");
	} else {
		this.dataset.asc = true; this.classList.add("bi-sort-down-alt"); this.classList.remove("bi-sort-up-alt");
	}

	document.querySelector("#sorting .btnBlue").click();
})


document.getElementById("sortByDexNumber").addEventListener("click", function() {
	var ord;
	if(document.getElementById("sortingOrder").dataset.asc === "true") { ord = "asc"; }
	else { ord = "desc"; }

	tinysort(".syncPair",{attr:"data-id",order:ord});

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
	["sortBySyncSuperawakening","syncLevel2"],
	["sortByGrid","syncGrid"],
	["sortByEXRoleUnlock","syncRoleEX"]
]

sortTypes2.forEach(btn => document.getElementById(btn[0]).addEventListener("click", function() {
	tinysort('.syncPair',{sortFunction:function(a,b){
		var lenA = parseInt(a.elm.querySelector("." + btn[1].replace("2","")).dataset.currentimage);
		var lenB = parseInt(b.elm.querySelector("." + btn[1].replace("2","")).dataset.currentimage);

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
			return lenA===lenB?0:(lenA<lenB?1:-1);
		} else {
			return lenA===lenB?0:(lenA>lenB?1:-1);
		}
	}});

	if(document.getElementById("showSeparator").checked) { showSeparator(".syncFav"); }
})

document.getElementById("sortBySelected").addEventListener("click", function() {

	if(document.getElementById("sortingOrder").dataset.asc === "true") {
		tinysort(".syncPair",{attr:"class",order:"desc"});
	} else {
		tinysort(".syncPair",{attr:"class",order:"asc"});
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
		dateInterval();
	} else {
		searchFilters();
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

	removeFilters();
}


function init() {

	document.getElementById("version").innerHTML = VERSION;
	document.getElementById("linkToolVer").innerHTML = VERSION;

	document.getElementById("date1").valueAsDate = new Date("2019-08-29");
	document.getElementById("date2").valueAsDate = new Date();

	loadVisibilityFromLocalStorage();

	updateNews();

	try { generatePairs(SYNCPAIRS);	} catch(e) {
		console.log(e);
		document.getElementById("syncPairs").innerHTML = '<p>Something went wrong, try to hard refresh the page.<br>or<br>Go to <a target="_blank" href="https://pomasters.github.io/SyncPairsTrackerOld/">https://pomasters.github.io/SyncPairsTrackerOld/</a> to get your export code.</p>';
	}

	addEventLeftSide();
}


window.onload = init;
const now = new Date();
const april1 = new Date("2026-04-01T06:00:00Z");
const april2 = new Date("2026-04-02T05:59:59Z");

const ITS_TIME = april1.getTime() < now.getTime() && now.getTime() < april2.getTime();


export function createStyleAFD() {
	if(!ITS_TIME) return;

	let styleAFD = document.createElement("style");
	styleAFD.innerHTML = `
		.syncpairAFD, .syncpairAFD2, .pauseAFD { width: 100px; height: 100px; aspect-ratio: 1; position: relative; }
		.syncpairAFD2 { opacity: 0.2; }
		.pauseAFD:hover { cursor: pointer; }
		.syncimagesAFD { width: 100%; height: 100%; transition-duration: 100ms; }
		.syncimagesAFD:hover { transform: scale(0.96); }
		.syncimagesAFD:active { transform: scale(0.92); }
		.synclevelAFD { position: absolute; left: 0%; bottom: 4%; z-index: 1; width: 26%; aspect-ratio: 1; display: flex; }
		.syncpairAFD2 .synclevelAFD { display: none; }
		@media only screen and (max-width: 1024px) {
			.syncpairAFD, .syncpairAFD2, .pauseAFD { max-width: 24%; height: auto; aspect-ratio: 1; }
			.synclevelAFD { width: 25%; aspect-ratio: 1; }
		}`;
	return styleAFD;
}



const NEW_SYNCPAIRS = [];


const CUSTOM_ICONS_SYNCPAIRS = {}

const CUSTOM_ICONS_KEYS = Object.keys(CUSTOM_ICONS_SYNCPAIRS);



export function hasCustomIcon(syncPair) {
	if(!ITS_TIME) return;

	const key = `${syncPair.dexNumber}|${syncPair.pokemonNumber}`

	return CUSTOM_ICONS_KEYS.includes(key);
}

export function replaceSyncPairImages(htmlImages) {
	if(!ITS_TIME) return;

	return htmlImages.replace('class="syncImages"','class="syncImages syncimagesAFDcustom"').replaceAll("icons/","icons/afd/")
}



export function addNewSyncPairs(container) {
	if(!ITS_TIME) return;

	const staticChildren = Array.from(container.children);

	NEW_SYNCPAIRS.forEach(characterArr => {
		const targetIndex = parseInt(characterArr[0], 10);

		const referenceNode = staticChildren[targetIndex];

		const possibleImages = characterArr.slice(1);
		if(possibleImages.length === 0) return;

		const divAFD = document.createElement("div");
		const className = Math.random() < 0.64 ? "syncpairAFD" : "syncpairAFD2";
		divAFD.classList.add(className);

		const imageAFD = document.createElement("img");
		const randomIndex = className == "syncpairAFD" ? Math.floor(Math.random() * possibleImages.length) : 0;
		const randomImage = possibleImages[randomIndex];
		imageAFD.src = "icons/afd/" + randomImage;
		imageAFD.classList.add("syncimagesAFD");

		const levelAFD = document.createElement("img");
		levelAFD.src = `images/${Math.floor(Math.random() * 5) + 1}.png`;
		levelAFD.classList.add("synclevelAFD");

		divAFD.appendChild(imageAFD);
		divAFD.appendChild(levelAFD);

		imageAFD.oncontextmenu = (e) => { e.preventDefault(); };

		container.insertBefore(divAFD, referenceNode);
	});
}



export function addPauseButton(container) {
	if(!ITS_TIME) return;
	if(!container) return;

	const divPauseAFD = document.createElement("div");
	divPauseAFD.classList.add("pauseAFD");

	const imagePauseAFD = document.createElement("img");
	imagePauseAFD.src = "icons/afd/0_AFD_Pause1.png";
	imagePauseAFD.classList.add("syncimagesAFD");
	divPauseAFD.appendChild(imagePauseAFD);

	const imageMap = {
		over: { "Pause1": "Pause2", "Pause3": "Pause4" },
		out:  { "Pause1": "Pause1", "Pause2": "Pause1", "Pause3": "Pause3", "Pause4": "Pause3" },
		click: { "Pause1": "Pause3", "Pause2": "Pause3", "Pause3": "Pause1", "Pause4": "Pause1" }
	};

	function updateButtonImage(action) {
		const currentSrc = imagePauseAFD.src;
		const mapping = imageMap[action];

		for(const [key, value] of Object.entries(mapping)) {
			if(currentSrc.includes(key)) {
				imagePauseAFD.src = `icons/afd/0_AFD_${value}.png`;
				break;
			}
		}
	}

	divPauseAFD.addEventListener("mouseenter", () => updateButtonImage("over"));
	divPauseAFD.addEventListener("mouseleave", () => updateButtonImage("out"));

	divPauseAFD.addEventListener('click', () => {
		document.querySelectorAll('.syncimagesAFDcustom img').forEach((img) => {

			if(img.src.includes('/afd/')) {
				img.src = img.src.replace('/icons/afd/', '/icons/');
			} else {
				img.src = img.src.replace('/icons/', '/icons/afd/');
			}
		});
		document.querySelectorAll('.syncpairAFD').forEach(el => el.classList.toggle("hide"));
		document.querySelectorAll('.syncpairAFD2').forEach(el => el.classList.toggle("hide"));

		divPauseAFD.remove();
		divPauseAFD.classList.add("hide");
	});

	const randomIndex = 100 + Math.floor(Math.random() * 400);
	const targetChild = container.children[randomIndex] || null;
	container.insertBefore(divPauseAFD, targetChild);
}
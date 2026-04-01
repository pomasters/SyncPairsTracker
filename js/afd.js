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



const NEW_SYNCPAIRS = [/*
	["AetherF_4.png","AetherF_5.png","AetherM_4.png","AetherM_5.png"],
	["AquaF_4.png","AquaF_5.png","AquaM_4.png","AquaM_5.png"],
	["FlareF_4.png","FlareF_5.png","FlareM_4.png","FlareM_5.png"],
	["GalaxyF_4.png","GalaxyF_5.png","GalaxyM_4.png","GalaxyM_5.png"],
	["MagmaF_4.png","MagmaF_5.png","MagmaM_4.png","MagmaM_5.png"],
	["PlasmaF_4.png","PlasmaF_5.png","PlasmaM_4.png","PlasmaM_5.png"],
	["RocketF_4.png","RocketF_5.png","RocketM_4.png","RocketM_5.png"],
	["YellF_4.png","YellF_5.png","YellM_4.png","YellM_5.png"],*/
	["11", "b1.png","b2.png","b3.png","b4.png","b5.png","b6.png","b7.png","b8.png","s1.png","s2.png","s3.png","s4.png","s5.png","s6.png","s7.png","s8.png"],
	["11", "Bellis_0029_5.png","Bellis_0029_EX.png"],
	["81", "Byron_5.png","Byron_EX.png"],
	["516", "Brandon_0377_5.png","Brandon_0377_EX.png","Brandon_0378_5.png","Brandon_0378_EX.png","Brandon_0379_5.png","Brandon_0379_EX.png"],
	["541", "Mars_0432_5.png","Mars_0432_EX.png"],
	["541", "Jupiter_0435_5.png","Jupiter_0435_EX.png"],
	["541", "Saturn_0454_5.png","Saturn_0454_EX.png"],
	["464", "Shelly_0319_5.png","Shelly_0319_EX.png"],
	["479", "Matt_0319_5.png","Matt_0319_EX.png"],
	["479", "Tabitha_0323_5.png","Tabitha_0323_EX.png"],
	["435", "Tricia_0242_5.png","Tricia_0242_EX.png"],
	["435", "Trinnia_0440_5.png","Trinnia_0440_EX.png"],
	["435", "Trista_0113_5.png","Trista_0113_EX.png"],
	["538", "Geeta_0956_5.png","Geeta_0956_EX.png"],
	["572", "Clavell_0909_5.png","Clavell_0909_EX.png"],
	["607", "Katy_0217_5.png","Katy_0217_EX.png"],
	["-", "Canari_5.png","Canari_EX.png"],
	["-", "Gwynn_5.png","Gwynn_EX.png"],
	["-", "Ditto_0131_2_5.png","Ditto_0131_2_EX.png","Ditto_0131_5.png","Ditto_0131_EX.png","Ditto_0149_2_5.png","Ditto_0149_2_EX.png","Ditto_0149_5.png","Ditto_0149_EX.png"]
];


const CUSTOM_ICONS_SYNCPAIRS = {"002|0141":"0|0|0|000|0|0","003|0054":"0|0|0|000|0|0","004|0026":"0|0|0|000|0|0","005|0764":"0|0|0|000|0|0","005|0114":"0|0|0|000|0|0","006|0078":"0|0|0|000|0|0","012|0241":"0|0|0|000|0|0","014|0780":"0|0|0|000|0|0","015|0168":"0|0|0|000|0|0","015|0169":"0|0|0|000|0|0","016|0080":"0|0|0|000|0|0","018|0381":"0|0|0|000|0|0","020|0297":"0|0|0|000|0|0","022|0289":"0|0|0|000|0|0","026|0302":"0|0|0|000|0|0","028|0291":"0|0|0|000|0|0","030|0409":"0|0|0|000|0|0","031|0407":"0|0|0|000|0|0","035|0392":"0|0|0|000|0|0","037|0242":"0|0|0|000|0|0","039|0648":"0|0|0|000|0|0","041|0189":"0|0|0|000|0|0","042|0365":"0|0|0|000|0|0","056|0788":"0|0|0|000|0|0","059|0733":"0|0|0|000|0|0","062|0169":"0|0|0|000|0|0","064|0509":"0|0|0|000|0|0","064|0510":"0|0|0|000|0|0","065|0009":"0|0|0|000|0|0","066|0154":"0|0|0|000|0|0","066|0251":"0|1|0|000|0|0","067|0503":"0|0|0|000|0|0","068|0853":"0|0|0|000|0|0","068|0494":"0|0|0|000|0|0","069|0595":"0|0|0|000|0|0","070|0302":"0|0|0|000|0|0","071|0658":"0|0|0|000|0|0","071|0700":"0|0|0|000|0|0","074|0053":"0|0|0|000|0|0","074|0799":"0|0|0|000|0|0","076|0133":"0|0|0|000|0|0","077|0149":"0|0|0|000|0|0","078|0784":"0|0|0|000|0|0","081|0386":"0|0|0|000|0|0","082|0151":"0|0|0|000|0|0","084|0025|2":"0|0|0|000|0|0","085|0065":"0|0|0|000|0|0","088|0794":"0|0|0|000|0|0","089|0695":"0|0|0|000|0|0","090|0350":"0|0|0|000|0|0","094|0389":"0|0|0|000|0|0","095|0175":"0|0|0|000|0|0","096|0655":"0|0|0|000|0|0","096|0658":"0|0|0|000|0|0","099|0354":"0|0|0|000|0|0","100|0484":"0|0|0|000|0|0","100|0491":"0|0|0|000|0|0","101|0350":"0|0|0|000|0|0","102|0773":"0|0|0|000|0|0","102|0474":"0|0|0|000|0|0","103|0035":"0|0|0|000|0|0","105|0405":"0|0|0|000|0|0","107|0078":"0|0|0|000|0|0","109|0628":"0|0|0|000|0|0","111|0815|2":"0|0|0|000|0|0","112|0644":"0|0|0|000|0|0","112|0643":"0|0|0|000|0|0","113|0428":"0|0|0|000|0|0","115|0717":"0|0|0|000|0|0","116|0716":"0|0|0|000|0|0","118|0006":"0|0|0|000|0|0","119|0877":"0|0|0|000|0|0","120|0282":"0|0|0|000|0|0","120|0719":"0|0|0|000|0|0","121|0793":"0|0|0|000|0|0","125|0875":"0|1|0|000|0|0","127|0383":"0|0|0|000|0|0","128|0382":"0|0|0|000|0|0","131|0740":"0|0|0|000|0|0","133|0609":"0|0|0|000|0|0","134|0604":"0|0|0|000|0|0","136|0720":"0|0|0|000|0|0","136|1000":"0|0|0|000|0|0","140|0359":"0|0|0|000|0|0","142|0094":"0|0|0|000|0|0","144|0835":"0|0|0|000|0|0","145|0483":"0|0|0|000|0|0","147|0450":"0|0|0|000|0|0","152|0025":"0|0|0|000|0|0","154|0028":"0|0|0|000|0|0","155|0839":"0|0|0|000|0|0","157|0897":"0|0|0|000|0|0","157|0820":"0|0|0|000|0|0","158|0093":"0|0|0|000|0|0","163|0143":"0|0|0|000|0|0","165|0100":"0|0|0|000|0|0","166|0700":"0|0|0|000|0|0","167|0136":"0|0|0|000|0|0","169|0879":"0|1|0|000|0|0","170|0569":"0|1|0|000|0|0","183|0503":"0|0|0|000|0|0","187|0700":"0|0|0|000|0|0","188|0133":"0|0|0|000|0|0","191|0939":"0|0|0|000|0|0","191|0940":"0|0|0|000|0|0","191|0941":"0|0|0|000|0|0","196|0970":"0|0|0|000|0|0","199|0487":"0|0|0|000|0|0","201|0980":"0|0|0|000|0|0","205|0982":"0|0|0|000|0|0","209|0286":"0|0|0|000|0|0","210|0943":"0|0|0|000|0|0","210|0819":"0|0|0|000|0|0","215|0983":"0|0|0|000|0|0","216|0914":"0|0|0|000|0|0","224|1024":"0|0|0|000|0|0","225|0915":"0|0|0|000|0|0","227|0210":"0|0|0|000|0|0","227|0869":"0|0|0|000|0|0","232|0103":"0|0|0|000|0|0","233|1025":"0|0|0|000|0|0","237|0058":"0|0|0|000|0|0"}

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
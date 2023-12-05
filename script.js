// Function to fetch word from API
const Dictonaryword = async (word) => {
    try {
        const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${decodeURIComponent(word)}`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const wordData = await response.json();
        console.log(wordData);
        return wordData;

    } catch (error) {
        console.log(error);
    }
}

const searchBtn = document.querySelector(".search-btn");
const userInput = document.querySelector(".user-input");
const loaderContainer = document.querySelector(".loader-container");

searchBtn.addEventListener("click", () => {
    let userValue = userInput.value;
    loaderContainer.style.display = "block"
    Dictonaryword(userValue).then(allData => {
        // Check if there are nounMeaning and definitions
        let nounMeaning = [];
        let allSound = [];
        let allPhoneticOralSOund = [];
        let soundBtn = document.querySelector(".sound-btn");
       
        soundBtn.style.display = "block";
        // Remove existing event listeners
        // soundBtn.remov(playAudioHandler(allSound));

        if (allData) {
            allData.forEach(ele => {

                // Fetching all nounMeaning(noun)
                if (ele.meanings
                    && ele.meanings
                        .length > 0 && ele.meanings
                        [0].definitions && ele.meanings[0].partOfSpeech === "noun") {
                    ele.meanings
                    [0].definitions.forEach(definition => {
                        if (definition.definition.length > 0) {
                            nounMeaning.push(definition.definition);
                        }
                    });
                }



                //fetching all sound
                if (ele.phonetics && ele.phonetics.length > 0) {
                    allSound = [];
                    ele.phonetics.forEach(phonetic => {
                        let audio = phonetic.audio;
                        if (audio.length > 0) {
                            allSound.push(audio);
                        }
                    });
                }



                //fetching all phonetic oral sound
                if (ele.phonetic && ele.phonetic.length > 0) {
                    allPhoneticOralSOund.push(ele.phonetic)
                }

            });


            loaderContainer.style.display = "none";
            console.log(nounMeaning);
            soundBtn.addEventListener("click", () => playAudioHandler(allSound));
            createMeaningDiv(nounMeaning)

            let searchForWord = document.querySelector(".word-for-search");
            let speechType = document.querySelector(".speech-type");
            let phoneticOral = document.querySelector(".phonetic-oral");
            phoneticOral.innerText = allPhoneticOralSOund[0];
            searchForWord.textContent = userValue
        } else {

            loaderContainer.style.display = "none";
            let allMeaningContainer = document.querySelector(".all-meaning");
            allMeaningContainer.innerHTML = "";
        allMeaningContainer.classList.add("word-not-found");
            allMeaningContainer.textContent = `${userValue} not found `
        }
    }).catch(err => {
        loaderContainer.style.display = "none";
        let allMeaningContainer = document.querySelector(".all-meaning");
        allMeaningContainer.innerHTML = "";
        allMeaningContainer.classList.add("word-not-found")
        allMeaningContainer.textContent = `${userValue} not found `
        console.log(err);
    });
});



userInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        searchBtn.click();
    }
});


//function 
// Function to create all meaning div
function createMeaningDiv(nounMeaning) {
    let i = 0;
    let allMeaningContainer = document.querySelector(".all-meaning");

    // Check if the container exists
    if (!allMeaningContainer) {
        let eachMeaning = document.createElement("div");
        eachMeaning.innerText = "No defination found";
        eachMeaning.classList.add("word-not-found")
        allMeaningContainer.appendChild(eachMeaning);
        return;
    }

    // Clear previous content in the container
    allMeaningContainer.innerHTML = "";
    

    nounMeaning.forEach(ele => {
        if (i == 4) {
            return
        }
        let eachMeaning = document.createElement("div");
        eachMeaning.innerText = `• ${ele}`;
        eachMeaning.classList.add("each-meaning")
        allMeaningContainer.appendChild(eachMeaning);
        i++;
    });
}



//function to play sound
function playAudioHandler(allSound) {
    const audio = new Audio(allSound[0]); // Adjust this line based on your logic for playing audio
    audio.play();
}
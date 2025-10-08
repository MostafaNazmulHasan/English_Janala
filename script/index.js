// 🔐 Function: Handles user login and shows main website content (except banner)
const showWebsite = () => {
  const inputUsername = document.getElementById("input-username").value;
  const inputPassword = parseInt(document.getElementById("input-password").value);

  // ✅ Validate username & password
  if (inputUsername !== "" && inputPassword === 123456) {
    const showElements = document.getElementsByClassName("showElement");
    const hideElement = document.getElementsByClassName("hideElement");

    // Show elements tagged with "showElement"
    for (let i = 0; i < showElements.length; i++) {
      showElements[i].classList.remove("hidden");
    }

    // Hide elements tagged with "hideElement"
    for (let i = 0; i < hideElement.length; i++) {
      hideElement[i].classList.add("hidden");
    }

    // Success alert and load lessons
    sweetAlert();
    loadAllLevels();
  } else {
    // ❌ Wrong credentials
    alert("Wrong Username or Password. Please try again.");
    document.getElementById("input-username").value = "";
    document.getElementById("input-password").value = "";
  }
};

// 🚪 Function: Logs the user out and resets the page to initial state
const logout = () => {
  const showElements = document.getElementsByClassName("showElement");
  const hideElement = document.getElementsByClassName("hideElement");
  const noLessonFoundSection = document.getElementById("no-lesson-found");
  const lessonCardContainer = document.getElementById("lesson-card-container");

  // Clear old content
  noLessonFoundSection.innerHTML = "";
  lessonCardContainer.innerHTML = "";

  // Hide main content again
  for (let i = 0; i < showElements.length; i++) {
    showElements[i].classList.add("hidden");
  }

  // Show login section again
  for (let i = 0; i < hideElement.length; i++) {
    hideElement[i].classList.remove("hidden");
  }

  // Reset login inputs
  document.getElementById("input-username").value = "";
  document.getElementById("input-password").value = "";
};

// 📚 Function: Fetches all vocabulary levels from API and displays buttons
const loadAllLevels = () => {
  showSpinner(); // Show loading spinner before data load

  fetch("https://openapi.programming-hero.com/api/levels/all")
    .then((response) => response.json())
    .then((res) => {
      showLesson(res.data);
    })
    .catch((error) => {
      console.error("Error fetching lessons:", error);
    })
    .finally(() => {
      // Hide spinner after short delay for smooth experience
      setTimeout(() => hideSpinner(), 300);
    });
};

// 🎓 Function: Dynamically displays lesson buttons based on fetched levels
const showLesson = (levels) => {
  const vocabularyButtonContainer = document.getElementById("vocabulary-button-container");

  for (const level of levels) {
    const vocabularyButtonDiv = document.createElement("div");
    vocabularyButtonDiv.innerHTML = `
      <button id='btn-${level.level_no}' class="btn btn-outline btn-primary" 
        onClick="loadWordsByLevels(${level.level_no})">
        <img src="./assets/fa-book-open.png" />Lesson ${level.level_no}
      </button>
    `;
    vocabularyButtonContainer.appendChild(vocabularyButtonDiv);
  }
};

// 🧠 Function: Loads all vocabulary words for a specific lesson level
const loadWordsByLevels = (id) => {
  showSpinner(); // Show spinner while fetching

  const url = `https://openapi.programming-hero.com/api/level/${id}`;
  fetch(url)
    .then((response) => response.json())
    .then((res) => {
      showWordsByLevels(res.data);
    })
    .catch((error) => {
      console.error("Error fetching words:", error);
    })
    .finally(() => {
      setTimeout(() => hideSpinner(), 300);
    });

  activateButton(id); // Highlight active lesson button
};

// 📝 Function: Displays vocabulary words and handles "no lesson found" scenario
const showWordsByLevels = (words) => {
  const lessonCardContainer = document.getElementById("lesson-card-container");
  const noLessonFoundSection = document.getElementById("no-lesson-found");

  // Clear old content before rendering new
  lessonCardContainer.innerHTML = "";
  noLessonFoundSection.innerHTML = "";

  // If no words found, show "No Lesson Found" message
  if (!words || words.length === 0) {
    noLessonFoundSection.classList.remove("hidden");
    const noLessonFoundSectionDiv = document.createElement("div");
    noLessonFoundSectionDiv.innerHTML = `
      <div class="bg-slate-50 w-full flex flex-col justify-center items-center p-14 gap-4">
        <img src="./assets/alert-error.png" alt="No Lesson Found" class="w-20" />
        <p class="hind-siliguri text-sm font-normal quaternary-color text-center">
          এই Lesson এ কোন Vocabulary যুক্ত হয় নি
        </p>
        <h2 class="text-color hind-siliguri text-lg md:text-4xl font-medium text-center">
          নেক্সট Lesson এ যান।
        </h2>
      </div>
    `;
    noLessonFoundSection.appendChild(noLessonFoundSectionDiv);
    return;
  }

  // Loop through each word and create a card
  for (const eachWord of words) {
    const { word, meaning, pronunciation, id } = eachWord;

    const lessonCardDiv = document.createElement("div");
    lessonCardDiv.innerHTML = `
      <div id="${id}" class="card bg-base-100 card-xl shadow-sm">
        <div class="card-body">
          <div class="flex flex-col justify-center items-center">
            <h2 class="card-title">${word}</h2>
            <p>Meaning / Pronunciation</p>
            <h2>${meaning} / ${pronunciation}</h2>
          </div>
          <div class="flex place-content-between gap-4 mt-4">
            <button id="${id}" class="btn" onclick="loadWordDetails(id)">
              <i class="fa-solid fa-circle-info"></i>
            </button>
            <button id="${word}" class="btn" onclick="pronounceWord('${word}')">
              <i class="fa-solid fa-volume-high"></i>
            </button>
          </div>
        </div>
      </div>
    `;
    lessonCardContainer.appendChild(lessonCardDiv);
  }
};

// 🎯 Function: Highlights the currently selected lesson button
const activateButton = (levelNo) => {
  removeActiveButton(); // Remove active from all buttons
  const button = document.getElementById(`btn-${levelNo}`);
  if (button) {
    button.classList.add("active");
  }
};

// 🧼 Function: Removes "active" class from all lesson buttons
const removeActiveButton = () => {
  const buttons = document.getElementsByClassName("btn");
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].classList.remove("active");
  }
};

// 🔍 Function: Fetches detailed info of a word (meaning, example, synonyms, etc.)
const loadWordDetails = (id) => {
  showSpinner(); // Show spinner while loading details
  const url = `https://openapi.programming-hero.com/api/word/${id}`;

  fetch(url)
    .then((response) => response.json())
    .then((res) => {
      showWordDetails(res.data);
    })
    .catch((error) => {
      console.error("Error fetching words:", error);
    })
    .finally(() => {
      setTimeout(() => hideSpinner(), 300);
    });
};

// 📖 Function: Displays word details inside a modal (meaning, example, synonyms)
const showWordDetails = (data) => {
  const { word, meaning, pronunciation, sentence, synonyms } = data;
  const detailInfoModalContainer = document.getElementById("detail-info-modal");

  // Create or reuse modal element
  let detailInfoModalDiv = document.getElementById("my-modal");
  if (!detailInfoModalDiv) {
    detailInfoModalDiv = document.createElement("dialog");
    detailInfoModalDiv.id = "my-modal";
    detailInfoModalDiv.className = "modal modal-bottom sm:modal-middle";
    detailInfoModalContainer.appendChild(detailInfoModalDiv);
  }

  // Generate synonym buttons
  const synonymsHTML =
    Array.isArray(synonyms) && synonyms.length > 0
      ? synonyms.map((syn) => `<button class="btn bg-green-100">${syn}</button>`).join(" ")
      : "<p>No synonyms available.</p>";

  // Update modal HTML
  detailInfoModalDiv.innerHTML = `
    <div class="modal-box border border-cyan-500 p-4">
      <div>
        <h3 class="text-lg font-bold">${word} (${pronunciation})</h3>
        <p class="py-2 font-bold">Meaning</p>
        <p class="py-2">${meaning}</p>
        <p class="py-2 font-bold">Example</p>
        <p class="py-2">${sentence}</p>
        <h4 class="py-2 font-bold">সমার্থক শব্দ গুলো</h4>
        <div class="flex flex-wrap gap-2">${synonymsHTML}</div>
      </div>

      <div class="modal-action">
        <form method="dialog">
          <button class="btn btn-primary">Complete Learning</button>
        </form>
      </div>
    </div>
  `;
  detailInfoModalDiv.showModal();
};

// 🌀 Function: Shows the global loading spinner
const showSpinner = () => {
  document.getElementById("loading-spinner").classList.remove("hidden");
};

// 🌀 Function: Hides the global loading spinner
const hideSpinner = () => {
  document.getElementById("loading-spinner").classList.add("hidden");
};

// 🎉 Function: Displays a success message when user logs in successfully
const sweetAlert = () => {
  Swal.fire({
    title: "Good job!",
    text: "You Have Successfully Logged In",
    icon: "success",
  });
};

// 🔊 Function: Pronounces the given English word using browser's Speech API
const pronounceWord = (word) => {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English pronunciation
  window.speechSynthesis.speak(utterance);
};

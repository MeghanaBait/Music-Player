const wrapper = document.querySelector(".wrapper"),
    musicImg = wrapper.querySelector(".img-area img"),
    musicName = wrapper.querySelector(".song-details .name"),
    musicArtist = wrapper.querySelector(".song-details .artist"),
    mainAudio = wrapper.querySelector("#main-audio"),
    playPauseBtn = wrapper.querySelector(".play-pause"),
    prevBtn = wrapper.querySelector("#prev"),
    nextBtn = wrapper.querySelector("#next"),
    progressArea = wrapper.querySelector(".progress-area"),
    progressBar = wrapper.querySelector(".progress-bar"),
    musicList = wrapper.querySelector(".music-list");
showMoreBtn = wrapper.querySelector("#more-music"),
    hideMoreBtn = musicList.querySelector("#close");


let musicIndex = Math.floor((Math.random() * allMusic.length) + 1);

window.addEventListener("load", () => {
    loadMusic(musicIndex);
    playingNow();
});

// load music function
function loadMusic(indexNumber) {
    musicName.innerText = allMusic[indexNumber - 1].name;
    musicArtist.innerText = allMusic[indexNumber - 1].artist;
    musicImg.src = `assets/images/${allMusic[indexNumber - 1].img}.jpg`;
    mainAudio.src = `assets/songs/${allMusic[indexNumber - 1].src}.mp3`;
}

//play music function
function playMusic() {
    wrapper.classList.add("paused");
    playPauseBtn.querySelector("i").innerText = "pause";
    mainAudio.play();
}

//pause music function
function pauseMusic() {
    wrapper.classList.remove("paused");
    playPauseBtn.querySelector("i").innerText = "play_arrow";
    mainAudio.pause();
}

// next music function
function nextMusic() {
    musicIndex++;
    musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}

function prevMusic() {
    musicIndex--;
    musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}

// events

//play or pause music button event
playPauseBtn.addEventListener("click", () => {
    const isMusicPaused = wrapper.classList.contains("paused");
    isMusicPaused ? pauseMusic() : playMusic();
    playingNow();
});

nextBtn.addEventListener("click", () => nextMusic());
prevBtn.addEventListener("click", () => prevMusic());

// update progress bar acc to music current time
mainAudio.addEventListener("timeupdate", (e) => {
    const currentTime = e.target.currentTime;
    const duration = e.target.duration;
    let progressWidth = (currentTime / duration) * 100;
    progressBar.style.width = `${progressWidth}%`;

    let musicCurrTime = wrapper.querySelector(".current");
    mainAudio.addEventListener("loadeddata", () => {
        let musicDuration = wrapper.querySelector(".duration");

        //update song total duration
        let audioDuration = mainAudio.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if (totalSec < 10) {
            totalSec = `0${totalSec}`;
        }
        musicDuration.innerText = `${totalMin}:${totalSec}`;

    })
    //update playing song current time
    let currentMin = Math.floor(currentTime / 60);
    let currentSec = Math.floor(currentTime % 60);
    if (currentSec < 10) {
        currentSec = `0${currentSec}`;
    }
    musicCurrTime.innerText = `${currentMin}:${currentSec}`;
});

//upsating playing song current time acc to the progress bar width
progressArea.addEventListener("click", (e) => {
    let progressWidthVal = progressArea.clientWidth;//width of progress bar
    let clickedOffsetX = e.offsetX; // getting offset x value
    let songDuration = mainAudio.duration;

    mainAudio.currentTime = (clickedOffsetX / progressWidthVal) * songDuration;
    playMusic();
});


// repeat, shuffle song
const repeatBtn = wrapper.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", () => {
    let getText = repeatBtn.innerText;

    switch (getText) {
        case "repeat":
            repeatBtn.innerHTML = "repeat_one";
            repeatBtn.setAttribute("title", "Song looped");
            break;
        case "repeat_one":
            repeatBtn.innerHTML = "shuffle";
            repeatBtn.setAttribute("title", "Playback shuffle");
            break;
        case "shuffle":
            repeatBtn.innerHTML = "repeat";
            repeatBtn.setAttribute("title", "playlist looped");
            break;
    }
});

//after the song ended
mainAudio.addEventListener("ended", () => {
    //acc to repeat shuffle icons
    let getText = repeatBtn.innerText;

    switch (getText) {
        case "repeat":
            nextMusic();
            break;
        case "repeat_one":
            mainAudio.currentTime = 0;
            loadMusic(musicIndex);
            playMusic();
            break;
        case "shuffle":
            let randIndex = Math.floor((Math.random() * allMusic.length) + 1);
            do {
                randIndex = Math.floor((Math.random() * allMusic.length) + 1);
            } while (musicIndex = randIndex);
            musicIndex = randIndex;
            loadMusic(musicIndex);
            playMusic();
            playingNow();
            break;
    }
});


//show playlist
showMoreBtn.addEventListener("click", () => {
    musicList.classList.toggle("show");
});

//hide playlist
hideMoreBtn.addEventListener("click", () => {
    showMoreBtn.click();
});

const ulTag = wrapper.querySelector("ul");

for (let i = 0; i < allMusic.length; i++) {
    let liTag = `<li li-index="${i + 1}">
                <div class="row">
                <span>${allMusic[i].name}<span>
                <p>${allMusic[i].artist}</p>
                </div>
                <audio class="${allMusic[i].src}" src="assets/songs/${allMusic[i].src}.mp3"></audio>
                <span id = "${allMusic[i].src}" class="audio-duration">0:00</span>
                </li>`;
    ulTag.insertAdjacentHTML("beforeend",liTag);

    let liAudioDuration = ulTag.querySelector(`#${allMusic[i].src}`);
    let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);

    liAudioTag.addEventListener("loadeddata", ()=>{
        let audioDuration = liAudioTag.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if (totalSec < 10) {
            totalSec = `0${totalSec}`;
        }
        liAudioDuration.innerText = `${totalMin}:${totalSec}`;
        liAudioDuration.setAttribute("t-duration", `${totalMin}:${totalSec}`)
    });
}

//play particulat song on click
const allLiTags = ulTag.querySelectorAll("li");
function playingNow(){
    for(let i = 0; i < allLiTags.length; i++){
        let audioTag = allLiTags[i].querySelector(".audio-duration");
        if(allLiTags[i].classList.contains("playing")){
            allLiTags[i].classList.remove("playing");
            let adDuration = audioTag.getAttribute("t-duration");
            audioTag.innerText = adDuration;
        }
        if(allLiTags[i].getAttribute("li-index") == musicIndex){
            allLiTags[i].classList.add("playing");
            audioTag.innerText = "playing";
        }
        allLiTags[i].setAttribute("onclick","clicked(this)");
    
    }
}

function clicked(element){
    let getLiIndex = element.getAttribute("li-index");
    musicIndex = getLiIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}
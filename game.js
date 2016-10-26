// JavaScript File
/* global sounds ritual createjs*/
ritual = {};
sounds = {};

(function() {
    'use strict';
let keyMap = {
    81: 1, 87: 2, 69: 3, // qwe
    65: 4, 83: 5, 68: 6, // asd
    90: 7, 88: 8, 67: 9, // zxc
    
    73: 'i', 79: 'o', 80: 'p',
    75: 'k', 76: 'l', 186: ';',
    188: ',', 190: '.', 191: '/'
};

 let wizardNames = [
    'Idreqiprix',
    'Knoharad',
    'Tim',
    'Zigorim',
    'Elfeus',
    'Uflabiphior',
    'Strurabeus',
    'Uvvius',
    'Axium',
    'Frizahr',
    'Tritior'
];
ritual.randomWizard = function randomWizard() {
    return wizardNames[Math.floor(Math.random()*wizardNames.length)];
}


ritual.setupWizard = function() {
    ritual.wizard = {
        score: 0,
        sigil: ritual.generateSigil(5)
    }
    document.querySelector(".wizard-left span").innerHTML = 
        "Score: " + ritual.wizard.score + "\n" + 
        ritual.wizard.sigil;
}

ritual.generateSigil = function generateSigil(length) {
   return [1,2,3,4,5,6,7,8,9]
            .sort(()=> .5-Math.random())
            .sort(()=> .5-Math.random())
            .sort(()=> .5-Math.random())
            .slice(0,length);
};

sounds.setupSounds = function setupSounds() {
    sounds.Poof = "Poof";
    sounds.BackgroundMusic = "BackgroundMusic";
    sounds.Spell = "Spell";
    sounds.Fail = "Fail";
    sounds.loadSounds();
};

sounds.loadSounds = function loadSounds() {
    createjs.Sound.registerSound("sounds/poof.mp3", sounds.Poof);
    createjs.Sound.registerSound("sounds/backgroundMusic.mp3", sounds.BackgroundMusic);
    createjs.Sound.registerSound("sounds/spell.mp3", sounds.Spell);
    createjs.Sound.registerSound("sounds/fail.mp3", sounds.Fail);
    createjs.Sound.addEventListener("fileload", handleFileLoad);
};

function handleFileLoad(event) {
    if(event.id === sounds.BackgroundMusic){
        sounds.playSound(sounds.BackgroundMusic);
    }
}

sounds.playSound = function playSound(soundID) {
    createjs.Sound.play(soundID);
};

}());


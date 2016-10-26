/*global angular, ritual, createjs */
(function(){
       'use strict';
angular
  .module('Ritual', [])
  .controller('ctrl', ['$scope', '$timeout', function($scope, $timeout) {

    $scope.leftWizard = {};
    $scope.rightWizard = {}
    let keyMap = {
        81: 1, 87: 2, 69: 3, // qwe
        65: 4, 83: 5, 68: 6, // asd
        90: 7, 88: 8, 67: 9, // zxc
        
        73: 11, 79: 12, 80: 13, //iop
        75: 14, 76: 15, 186: 16, //kl;
        188: 17, 190: 18, 191: 19, //,./
        
        103: 11, 104: 12, 105: 13, //789
        100: 14, 101: 15, 102: 16, //456
        97: 17, 98: 18, 99: 19 //123
    }
    $scope.keyPress = function(e) {
        var key = e.keyCode || e.which;
        if ($scope.leftWizard.range.includes(keyMap[key]) && $scope.leftWizard.state=='rest') {
            handleWizard($scope.leftWizard, keyMap[key]);
        } else if($scope.rightWizard.range.includes(keyMap[key])  && $scope.rightWizard.state=='rest') {
            handleWizard($scope.rightWizard, keyMap[key]-10);
        }
    };
    
    
    let handleWizard = function handleWizard(wiz, key) {
        if (wiz.ready && wiz.sigil && wiz.sigil[0] === key) {
            wiz.sigilCompleted.push( wiz.sigil.shift());
            if (wiz.sigil.length === 0) {
                wiz.level += 1;
                wiz.state='win';
                ritual.miniSig(wiz);
                clearSpell(wiz);
                wiz.sigilCompleted=[];
                if (wiz.strength == 10) {
                    $scope.winner = wiz;
                    $('.modal').modal('show');
                } else {
                    $timeout(function() {
                        wiz.state='rest';
                        startNewSpell(wiz);
                        wiz.strength += 1;
                    }, 3000, true);
                }
            }
        } else if (wiz.ready && wiz.sigil) {
            wiz.level -= wiz.length ? 1 : 0;
            wiz.state = 'fail';
            wiz.ready = false;
            clearSpell(wiz);
            $timeout(function() {
                wiz.strength -= wiz.strength ? 1 : 0;
                wiz.state = 'rest';
                startNewSpell(wiz);
            }, 3000, true);
        }
    };
    
    
    let setUp = function setUp() {
        sounds.setupSounds();
        sounds.playSound(sounds.BackgroundMusic);
        $scope.leftWizard = {
            level: 1,
            name: ritual.randomWizard(),
            strength: 0,
            sigil: [],
            sigilCompleted: [],
            range: [1,2,3,4,5,6,7,8,9],
            canvas: document.getElementById('p1rc'),
            smallCanvas: document.getElementById('miniLeft'),
            monsterCanvas: document.getElementById('leftMonster'),
            monsterSuffix: "",
            cheatMap: ritual.drawLeftGrid,
            state: 'rest',
            ready: false,
            makeReady:function() {
                $scope.$evalAsync(function () {
                    $scope.leftWizard.ready = true;
                })}
        };
        $scope.rightWizard = {
            level: 1,
            name: ritual.randomWizard(),
            strength: 0,
            sigil: [],
            sigilCompleted: [],
            range: [11,12,13,14,15,16,17,18,19],
            canvas: document.getElementById('p2rc'),
            smallCanvas: document.getElementById('miniRight'),
            monsterCanvas: document.getElementById('rightMonster'),
                        monsterSuffix: "_2",
            cheatMap: ritual.drawRightGrid,
            state: 'rest',
            ready: false,
            makeReady: function() {
                $scope.$evalAsync(function () {
                    $scope.rightWizard.ready = true;
                });
            }
        };
            
        ritual.setupWizardCanvas($scope.rightWizard);
        ritual.setupWizardCanvas($scope.leftWizard);
    }

    let startNewSpell = function startNewSpell(wizard) {
       wizard.sigil = ritual.generateSigil(wizard.level);
       ritual.startSig(wizard)
    }
    
    let clearSpell = function clearSpell(wizard) {
        wizard.sigil = []
        wizard.sigilCompleted = [];
        ritual.clearStage(wizard);
        wizard.stage.removeAllChildren();
        wizard.stage.update();
    }



    setUp();    
    // don't do this.
    $('.modal').modal('show');

    $scope.begin = function begin() {
        $scope.leftWizard.level = 1;
        $scope.leftWizard.strength = 1;
        $scope.rightWizard.level = 1;
        $scope.rightWizard.strength = 1;
        startNewSpell($scope.leftWizard);
        startNewSpell($scope.rightWizard);
    }


    $scope.rightStateImage = function() {
        if ($scope.rightWizard.state === 'fail' ) {
            sounds.playSound(sounds.Fail);
            return 'mage2_fail.gif';
        } else if ($scope.rightWizard.state === 'win' ) {
            sounds.playSound(sounds.Spell);
            return 'mage2_win.gif';
        } else {
            return 'mage2_rest.gif';
        }
    }
    $scope.leftStateImage = function() {
        if ($scope.leftWizard.state === 'fail' ) {
            sounds.playSound(sounds.Fail);
            return 'mage1_fail.gif';
        } else if ($scope.leftWizard.state === 'win' ) {
            sounds.playSound(sounds.Spell);
            return 'mage1_win.gif';
        } else {
            return 'mage1_rest.gif';
        }
    }
    $scope.rightMonsterImage = function() {
        if ($scope.rightWizard.state == 'win' && ($scope.rightWizard.strength % 2 != 0)) {
            sounds.playSound(sounds.Poof);
            return 'trans_cloud2.gif';
        }
        if ($scope.rightWizard.strength > 1) {
            return 'monster' + Math.floor($scope.rightWizard.strength/2) + '_2.gif';
        }
        return 'blank.gif';
    }
    $scope.leftMonsterImage = function() {
        if ($scope.leftWizard.state == 'win' && ($scope.leftWizard.strength % 2 != 0)) {
            sounds.playSound(sounds.Poof);
            return 'trans_cloud.gif';
        }
        if ($scope.leftWizard.strength > 1) {
            return 'monster' + Math.floor($scope.leftWizard.strength/2) + '.gif';
        }
        return 'blank.gif';
    }
  }]);
}());
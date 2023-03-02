

// -------------------------html definitie ----------------------
const pomodoro = document.getElementById('pomodoro-app');
const pomodoroBody = document.getElementsByTagName('body');

const timerAlert = document.createElement('div');
timerAlert.className = 'pomodoro-app__alert';
pomodoroBody.item(0).appendChild(timerAlert);

const alertHeader = document.createElement('p');
alertHeader.className = 'alert__header';
alertHeader.innerHTML = 'Time is up!'
timerAlert.appendChild(alertHeader);

const alertContent = document.createElement('p');
alertContent.className = 'alert__content';
timerAlert.appendChild(alertContent);

const wrapper = document.createElement("div");
wrapper.className = 'wrapper'; 
pomodoro.appendChild(wrapper);


const breakCounter = document.createElement('div');
breakCounter.className = 'break-counter'

const breakCounterText = document.createElement('p');
breakCounterText.className = 'break-counter__text';
breakCounterText.innerHTML = 'Break counter: '

const breakCounterValue = document.createElement('p');
breakCounterValue.className = 'break-counter__value'; 
breakCounterValue.innerHTML = '0';

breakCounter.appendChild(breakCounterText);
breakCounter.appendChild(breakCounterValue);

const wrapperCenter = document.createElement('div');
wrapperCenter.className = 'wrapper__center';
wrapper.appendChild(breakCounter);
wrapper.appendChild(wrapperCenter);

const timerContainer = document.createElement('div');
timerContainer.className = 'timer';
wrapperCenter.appendChild(timerContainer);

const timerDisplay = document.createElement('div');
timerDisplay.className = 'timer__display';
timerContainer.appendChild(timerDisplay);

const timerMinutes = document.createElement('p');
const timerSeconds = document.createElement('p');
const timerDevider = document.createElement('p');

timerMinutes.innerHTML = '00';
timerMinutes.className = 'minutes';
timerSeconds.innerHTML = '00';
timerSeconds.className = 'seconds';
timerDevider.innerHTML = ' : ';

timerDisplay.appendChild(timerMinutes);
timerDisplay.appendChild(timerDevider);
timerDisplay.appendChild(timerSeconds);

const buttonContainer = document.createElement('div');
buttonContainer.className = 'button-container';
wrapperCenter.appendChild(buttonContainer);

const buttons = ['startStop', 'restart', '1min', '10min']

buttons.forEach(function(el){

    var buttonDiv = document.createElement('button');
    buttonDiv.id = el;
    buttonDiv.className = 'button';
    buttonContainer.appendChild(buttonDiv);

})

let buttonContent0 = document.getElementById('startStop');
buttonContent0.innerHTML = 'Start';
const buttonContent1 = document.getElementById('restart');
buttonContent1.innerHTML = 'Restart';
const buttonContent2 = document.getElementById('1min');
buttonContent2.innerHTML = '+ 1min';
const buttonContent3 = document.getElementById('10min');
buttonContent3.innerHTML = '+ 10min';

const titleTimer = document.getElementsByTagName('title');

let breakMinutesEl = null;
let breakSecondsEl = null;
let breakDeviderEl = null;

let interval = null;

let breakCount = 0;

let breakInterval = null;

let breakTime; 
let breakTimeStart;

let titleMinutes = null;
let titleSeconds = null;

let remainingSeconds;
let remainingSecondsStart; 

let clicked;

window.addEventListener( 'DOMContentLoaded', () => {
    const userInput = prompt('how many minutes do you want to work?');
    remainingSecondsStart = userInput * 60;
    breakTime = breakTimeStart;
    remainingSeconds = remainingSecondsStart;

    if(userInput === '' || remainingSecondsStart > 3600 || remainingSecondsStart < 3){
        alertHeader.innerHTML = 'Wrong value!'
        alertContent.innerHTML = 'Reload page and give other value'
        return;
    };

    const userBreakInput = prompt('How long should your breaktime be? (after 4 brakes the break time will be doubled!)');
    breakTimeStart = userBreakInput * 60;

    if(breakTime === '' || breakTimeStart > 3600 || breakTimeStart < 3){
        alertHeader.innerHTML = 'Wrong value!'
        alertContent.innerHTML = 'Reload page and give other value'
        return;
    };


    timerAlert.style.opacity = 0.0;

    updateInterfaceTime();
    updateStartStop();
    
    buttonContent0.addEventListener('click', () => {
            if(interval === null && breakInterval === null){
                start();
                clicked = true;
            }else {
                stop('interval');
            }
        });

        buttonContent1.addEventListener('click', () => {
            if (!clicked) return;
            restart(remainingSecondsStart);
        });

        buttonContent2.addEventListener('click', () => {
            addMinutes(1);
            
        })

        buttonContent3.addEventListener('click', () => {
            addMinutes(10);
        })
    
});


// ------------------------functions--------------------!

function updateInterfaceTime() {
    updateTitletime();
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    timerMinutes.innerHTML = minutes.toString().padStart(2, '0');
    timerSeconds.innerHTML = seconds.toString().padStart(2, '0');
};
function updateBreaktime() {
    const breakMinutes = Math.floor(breakTime / 60);
    const breakSeconds = breakTime % 60;
    breakMinutesEl.innerHTML = breakMinutes.toString().padStart(2, '0');
    breakSecondsEl.innerHTML = breakSeconds.toString().padStart(2, '0');
};


function updateStartStop () {
    console.log(breakInterval)
    if (interval === null && breakInterval === null){
        buttonContent0.innerHTML = 'Start';
    }
    else if (breakCount > 0 && interval === null){
        console.log('test start stop')
        buttonContent0.innerHTML = '';
        
        breakMinutesEl = document.createElement('p');
        breakSecondsEl = document.createElement('p');
        breakDeviderEl = document.createElement('p');
        
        breakDeviderEl.innerHTML = ' : ';
        
        buttonContent0.appendChild(breakMinutesEl);    
        buttonContent0.appendChild(breakDeviderEl);    
        buttonContent0.appendChild(breakSecondsEl);    
        updateBreaktime();
    
    }
    else {
        buttonContent0.innerHTML = 'pause';
    }
}

function startBreak() {
    if (breakTime === 0) return;
    breakInterval = setInterval(() => {
        breakTime--;
        updateBreaktime();
        if(breakTime === 0){
            stop('break');
            if(breakCount >= 4) {
                updateStartStop();
                breakCount = 0;
                updateBreakCount(breakCount);
            }

        }
        updateStartStop();
    },1000);


}

function start(){
    if (remainingSeconds === 0) return;
    
    interval = setInterval(() => {
        remainingSeconds--;
        updateInterfaceTime();

        if(remainingSeconds === 0) {
            breakCount++;
            updateBreakCount(breakCount);
            if (breakCount < 4
                ){
                
                remainingSeconds = remainingSecondsStart;
                breakTime = breakTimeStart;
                startBreak();
                updateStartStop();
                showAlert(breakTime);
            }   
            else{
                remainingSeconds = remainingSecondsStart;
                breakTime = breakTimeStart * 2;
                startBreak();
                updateStartStop();
                showAlert(breakTime);
            }
            updateInterfaceTime();
            stop('interval');
        }
    }, 1000);
    updateStartStop();
}

function stop(field) {
    if(field === null) return;
    if (field === 'break'){
        clearInterval(breakInterval);
        breakInterval = null;
    }else {
        clearInterval(interval)
        interval = null;
    }
    updateStartStop();
}

function restart(startingSeconds) {
    console.log(startingSeconds);
    if(breakInterval !== null) return;
    console.log('test');
    remainingSeconds = startingSeconds
    updateInterfaceTime();
    updateStartStop();
}

function updateBreakCount(breakNumber) {
    breakCounterValue.innerHTML = breakNumber;
}

function addMinutes(minutes) {
    if(breakInterval !== null) return;
    const seconds = minutes * 60;
    remainingSeconds = remainingSeconds + seconds;
    updateInterfaceTime();
}

function updateTitletime() {

    titleTimer.item(0).innerHTML = '';
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;


    titleTimer.item(0).innerHTML = 'pomodoro app' + ' - ' + minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0');

}

function showAlert(breakTime) {
    let minutes = breakTime / 60;
    if(minutes < 1){
        minutes = +minutes.toFixed(2);
    }
    timerAlert.style.opacity = 1;
    let alertTimer = 7;
    alertContent.innerHTML = 'Take a break and start again after: ' + minutes + ' mins';
    setInterval(() => {
        alertTimer--;
        if(alertTimer === 0){
            timerAlert.style.opacity = 0;
        }
    },1000);

}


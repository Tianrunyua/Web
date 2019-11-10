/**
 * 18342090 王超
 * whac-a-mole.js - Script for Whac-a-mole Game
 */
(function() {
    const boxesContainer = document.getElementById('boxes');
    const btnElement = document.getElementById('btn');
    const messageEle = btnElement.querySelector('span.message');
    const progressEle = btnElement.querySelector('span.progress');
    const circlePath = 'M34.745,7.183C25.078,12.703,13.516,26.359,8.797,37.13 c-13.652,31.134,9.219,54.785,34.77,55.99c15.826,0.742,31.804-2.607,42.207-17.52c6.641-9.52,12.918-27.789,7.396-39.713 C85.873,20.155,69.828-5.347,41.802,13.379';
    
    let startTime = 0;
    let scores = 0;
    let animationFrameID = 0;

    function createSVG() {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttributeNS(null, 'viewBox', '0 0 100 100');
        svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        return svg;
    }

    function resetRadios() {
        document.querySelectorAll('.mole input').forEach((radio) => {
            radio.checked = false;
            radio.moleChecked = false;
            radio.parentNode.classList.remove('wrong');
            const path = radio.parentNode.querySelector('svg > path');
            if (path) {
                path.parentNode.removeChild(path);
            }
        })
    }

    function drawRadio(radio) {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        radio.parentNode.querySelector('svg').appendChild(path);
        path.setAttributeNS(null, 'd', circlePath);
        const length = path.getTotalLength();
        path.style.strokeDasharray = length + ' ' + length;
        path.style.strokeDashoffset = Math.floor(length) - 1;
        path.getBoundingClientRect();
        path.style.transition = 'stroke-dashoffset .1s ease-out 0s';
        path.style.strokeDashoffset = '0';
    }

    function createRadio(i) {
        const radio = document.createElement('input');
        radio.setAttribute('type', 'radio');
        radio.setAttribute('name', 'mole');
        radio.value = i.toString(10);
        return radio;
    }

    function createMole(i) {
        const mole = document.createElement('div');
        mole.className = 'mole';
        const moleRadio = createRadio(i);
        mole.appendChild(moleRadio);
        mole.appendChild(createSVG());
        mole.addEventListener('click', (e) => handleMoleClick(e, moleRadio));
        return mole;
    }

    function generateMoles() {
        var i, j;
        for (i = 0; i < 6; i++) {
            const lineContainer = document.createElement('div');
            lineContainer.className = 'line';
            for (j = 0; j < 10; j++) {
                lineContainer.appendChild(createMole(i * 10 + j));
            }
            boxesContainer.appendChild(lineContainer);
        }
    }

    function selectMole() {
        const moleValue = Math.floor(Math.random() * 60).toString(10);
        const currentChecked = document.querySelector(`input[name='mole']:checked`);
        if (currentChecked && moleValue === currentChecked.value) {
            return setTimeout(selectMole, 0);
        }
        const selectedMole = document.querySelector(`input[name='mole'][value='${moleValue}']`);
        resetRadios();
        selectedMole.checked = true;
        selectedMole.moleChecked = true;
        drawRadio(selectedMole);
    }

    function drawProgress(time) {
        if (startTime) {
            const percentage = (time - startTime) / 300;
            if (percentage >= 100) {
                updateProgress(false);
                boxesContainer.classList.remove('running');
                animationFrameID = 0;
                startTime = 0;
            } else {
                updateProgress(true, time);
                animationFrameID = window.requestAnimationFrame(drawProgress);
            }
        }
    }

    function updateProgress(isStart = true, time = performance.now()) {
        if (isStart) {
            messageEle.textContent = `Stop Game | Score: ${scores} | Time: ${30 - Math.floor((time - startTime) / 1000)}s`;
            progressEle.style.width = `${(time - startTime) / 300}%`;
        } else {
            messageEle.textContent = `Start Game | Last Score: ${scores}`;
            progressEle.style.transition = 'width .5s ease-in-out';
            progressEle.style.width = '0%';
        }
    }

    function handleButtonClick() {
        if (messageEle.textContent.startsWith('Start Game')) {
            boxesContainer.classList.add('running');
            startTime = performance.now();
            scores = 0;
            progressEle.style.transition = 'none';
            resetRadios();
            selectMole();
            updateProgress(true, startTime);
            animationFrameID = window.requestAnimationFrame(drawProgress);
        } else {
            boxesContainer.classList.remove('running');
            startTime = 0;
            updateProgress(false);
            window.cancelAnimationFrame(animationFrameID);
            animationFrameID = 0;
        }
    }

    function handleMoleClick(e, mole) {
        if (startTime) {
            if (mole.moleChecked) {
                mole.moleChecked = false;
                scores++;
                selectMole();
            } else {
                scores--;
                mole.parentNode.classList.add('wrong');
            }
            updateProgress();
        }
        return e.preventDefault() && false;
    }

    generateMoles();
    btnElement.addEventListener('click', handleButtonClick);
})();
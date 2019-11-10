/**
 * 18342090 王超
 * maze.js - Script of Maze Game
 * Notes:
 * - Use esnext features(const & let, async function, arrow functions, destructuring assignment)
 * - As I am working with my homework, I found Microsoft Edge really really annoying.
 */
(async function() {
    const mainCanvas = document.getElementById('mainCanvas');
    const mainCtx = mainCanvas.getContext('2d');
    const messageElement = document.getElementById('message');

    const mainCanvasRc = rough.canvas(mainCanvas);
    let mazeImage, mazeImageRed;

    let status = 'ready'; // ready; started; failed; win;

    async function prepareImageModern(isRed = false) {
        mainCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
        mainCanvasRc.rectangle(0, 0, 1920, 1080, {
            stroke: isRed ? 'red' : '#000',
            fill: isRed ? 'rgba(255, 0, 0, .75)' : 'rgba(0, 0, 0, .25)',
            hachureGap: 5,
        });
        
        mainCanvasRc.path('M-2,723.38,710.35,738.5,705,138l557.28,41.9q3.77,277,7.52,554l657.07-3.79q1.08,111.14,2.15,152.28l-731.23-19.79q-11.8-275.81-23.62-551.62L807,266l0.43,625-815-30Z', {
            stroke: isRed ? 'red' : '#000',
            fill: '#fff',
            fillStyle: 'solid',
        });
        
        mainCanvasRc.rectangle(20, 740, 100, 100, {
            fill: 'rgb(6, 120, 244)'
        });
        mainCanvasRc.rectangle(1800, 750, 100, 100, {
            fill: 'rgb(0, 128, 0)'
        });
        
        mainCtx.font = `64px 'Gloria Hallelujah'`;
        mainCtx.textAlign = 'center';
        mainCtx.fillText('S', 70, 815);
        mainCtx.fillText('E', 1850, 830);
        return mainCtx.getImageData(0, 0, mainCanvas.width, mainCanvas.height);
    }

    function prepareImageClassic(isRed) {
        return new Promise((resolve) => {
            const tempImage = new Image();
            tempImage.src = isRed ? 'mazeRed.png' : 'maze.png';
            tempImage.onload = () => {
                mainCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
                mainCtx.drawImage(tempImage, 0, 0);
                resolve(mainCtx.getImageData(0, 0, mainCanvas.width, mainCanvas.height));
            };
        });
    }

    async function prepareImage(isRed) {
        return (document.documentMode || /Edge/.test(navigator.userAgent)) ? await prepareImageClassic(isRed) : await prepareImageModern(isRed);
    }

    async function cacheImageData() {
        mazeImage = await prepareImage();
        mazeImageRed = await prepareImage(true);
    }

    function drawCanvas(isRed = false) {
        mainCanvas.style.visibility = 'visible';
        mainCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
        mainCtx.putImageData(isRed ? mazeImageRed : mazeImage, 0, 0);
    }

    function drawExampleWall() {
        rough.canvas(document.getElementById('wallExample')).rectangle(5, 5, 190, 90, {
            fill: 'rgba(0, 0, 0, .25)',
            hachureGap: 5,
        });
    }

    function pointInRect(x, y, x0, y0, width, height) {
        return (x >= x0 && x <= (x0 + width) && y >= y0 && y <= (y0 + height));
    }

    function handleMouseMove(event) {
        if (status === 'failed' || status === 'win') {
            return;
        }
        const { offsetX, offsetY } = event;
        if (pointInRect(offsetX * 2, offsetY * 2, 15, 735, 110, 110)) {
            // Enter S
            status = 'started';
            messageElement.textContent = 'Started. Now MOVE your mouse carefully!';
            return;
        }
        if (pointInRect(offsetX * 2, offsetY * 2, 1795, 745, 110, 110)) {
            // Enter E
            if (status === 'started') {
                messageElement.textContent = 'You Win!';
                status = 'win';
            } else {
                messageElement.textContent = `Don't cheat, you should start form the 'S' and move to the 'E' inside the maze!`;
                status = 'ready';
            }
            return;
        }
        const [r, g, b, a] = mainCtx.getImageData(offsetX * 2, offsetY * 2, 1, 1).data;
        if (r !== 255 && g !== 255 && b !== 255) {
            if (status === 'started') {
                messageElement.textContent = 'You Lose.';
                drawCanvas(true);
                status = 'failed';
            }
        } else {
        }
    }

    mainCanvas.addEventListener('mousemove', handleMouseMove);
    mainCanvas.addEventListener('mouseleave', () => {
        if (status === 'started') {
            messageElement.textContent = `Don't cheat, you should start form the 'S' and move to the 'E' inside the maze!`;
        } else {
            messageElement.textContent = 'Here we go!';
            if (status === 'failed') {
                drawCanvas();
            }
        }
        status = 'ready';
    })

    await new FontFaceObserver('Gloria Hallelujah').load();
    await cacheImageData();
    drawCanvas();
    drawExampleWall();
})();
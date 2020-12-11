let imageCounter = 0;

const sleep = ((s) => new Promise((resolve) => {
    setTimeout(resolve, s * 1000);
}));

async function captureScreenshot(driver, testname) {
    await driver.takeScreenshot().then(
        function (image) {
            require('fs').writeFile(`./screenshots/screenshot-failures-${testname}_${imageCounter}.png`, image, 'base64', function (err) {
                console.log(err);
            });
        },
    );
    imageCounter += 1;
}

async function runOnFailures(driver, error, testname) {
    console.log(`${testname} failed with Error -> ${error}`);
    await captureScreenshot(driver, testname)
}

async function highlightElement(driver, element, clearHL = true) {
    await driver.executeScript('arguments[0].setAttribute("style", "border: solid 5px red; background: yellow");', element);

    // -> clear the highlight after 0.5s
    if (clearHL) {
        await sleep(0.5);
        await driver.executeScript('arguments[0].setAttribute("style", "border: solid 5px white");', element);
    }
}

module.exports = {
    runOnFailures,
    highlightElement,
    sleep,
};

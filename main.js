const inputSlider = document.querySelector("[data-length-slider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-password-display]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copy-message]");
const upperCaseCheck = document.querySelector("#UpperCase");
const lowerCaseCheck = document.querySelector("#LowerCase");
const numberCheck = document.querySelector("#Numbers");
const symbolCheck = document.querySelector("#Symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector("[generateBtn]");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()-_+|}{][<>?/,.';

let password = "";
let passwordLength = 10;
let checkCount = 0;
// set strength circle color to grey

// console.log("javaScript connected ha ")

handleSlider();
// setIndicator(green);
// set passwd lenght
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerHTML = passwordLength;
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = color;
}

function getRandInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomNumber() {
    return getRandInteger(0, 9);
}

function generateLowerCase() {
    return String.fromCharCode(getRandInteger(97, 123));
}

function generateUpperCase() {
    return String.fromCharCode(getRandInteger(65, 91));
}

function generateSymbol() {
    const random = getRandInteger(0, symbols.length);
    return symbols.charAt(random);
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSymb = false;
    if (upperCaseCheck.checked) hasUpper = true;
    if (lowerCaseCheck.checked) hasLower = true;
    if (numberCheck.checked) hasNum = true;
    if (symbolCheck.checked) hasSymb = true;

    if (hasUpper && hasLower && (hasNum || hasSymb) && passwordLength >= 8) {
        setIndicator("#065F01");
    }
    else if ((hasLower || hasUpper) && (hasNum || hasSymb) && passwordLength >= 6) {
        setIndicator("#065F01");
    }
    else {
        setIndicator("#FF0000");
    }
}

async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch (e) {
        copyBtn.innerText = "failed";
    }
    // to make copy wala span visible
    copyMsg.style.display="block";

    setTimeout(() => {
        copyMsg.style.display="none";
    }, 2000);
}

function shufflePassword(array) {
    // fisher yates method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;

}

function handleCheckBox() {
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked)
            checkCount++;
    });

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}



allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBox);
})

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
});

copyBtn.addEventListener('click', () => {
    if (passwordDisplay.value)
        copyContent();
});

handleCheckBox();
generateBtn.addEventListener('click', () => {
    if (checkCount == 0)
        return;

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    password = "";
    let funcArr = [];
    if (upperCaseCheck.checked)
        funcArr.push(generateUpperCase);
    if (lowerCaseCheck.checked)
        funcArr.push(generateLowerCase);
    if (numberCheck.checked)
        funcArr.push(getRandomNumber);
    if (symbolCheck.checked)
        funcArr.push(generateSymbol);

    for (let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();
    }

    for (let i = 0; i < passwordLength - funcArr.length; i++) {
        let randIndex = getRandInteger(0, funcArr.length);
        password += funcArr[randIndex]();
    }
    password = shufflePassword(Array.from(password));

    passwordDisplay.value = password;

    calcStrength();
});
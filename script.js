// DOM Elements
const card = document.querySelector(".card")
const taskData = document.getElementById('task');
const copyButton = document.getElementById('copyButton');
const textForm = document.getElementById('textForm');
const textInput = document.getElementById('textInput');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');

const topNavBtns = document.querySelectorAll("#top-nav > p");
const subNavBtns = document.querySelectorAll(".sub-nav > p");

const taskNameField = document.querySelector("#task-name");

let category = undefined
let currentProblem = undefined

let currentCardChange = undefined
let firstChange = true
function changeCard() {
    if (firstChange) {
        firstChange = false;
        return
    }

    if (currentCardChange) {
        clearTimeout(currentCardChange);
        document.querySelector(".card").classList.remove("card-change");
    }

    document.querySelector(".card").classList.add("card-change");
        currentCardChange = setTimeout(() => {
            document.querySelector(".card").classList.remove("card-change");
            currentCardChange = undefined
        }, 1000)
}

topNavBtns.forEach(btn => {
    btn.addEventListener("click", function() {
        topNavBtns.forEach(btn => {
            if (btn.classList.contains("selected-nav")) {
                btn.classList.remove("selected-nav")
            }
        })
        btn.classList.add("selected-nav")
        
        category = btn.textContent.toLowerCase()
        const subNav = document.querySelector("#" + category + "-oppgaver")
        document.querySelectorAll(".sub-nav").forEach(nav => nav.classList.add("none"))
        subNav.classList.remove("none")
    })
})

subNavBtns.forEach((btn, index) => {
    btn.addEventListener("click", function() {
        if (currentProblem == index) {
            showToast("Du er allerede på denne oppgaven.")
            return
        }
        const height = card.offsetHeight;
        card.style.setProperty('--offset', `${height + window.innerHeight}px`);

        document.querySelector(".card").classList.remove("white")
        currentProblem = index
        setTimeout(() => {
            taskNameField.textContent = category[0].toUpperCase() + category.slice(1) + " - " + ((currentProblem % 3) + 1)
            loadTask(currentProblem)
        }, 500 * !(firstChange + 0))
        
        changeCard()
        updateTextArea()
    })
})

// Show toast notification
function showToast(message, duration = 3000) {
    toastMessage.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

// Copy text to clipboard
copyButton.addEventListener('click', async () => {
    try {
        await navigator.clipboard.writeText(taskData.textContent);
        showToast('Text copied to clipboard!');
    } catch (err) {
        showToast('Failed to copy text', 4000);
        console.error('Failed to copy text: ', err);
    }
});

function checkInput(text, qID) {
    const a = [123, 234, 345, 456, 567, 678, 789]
    if (text = a[qID]) {
        showToast("Correct answer!")
        return true
    }
    
    showToast("Wrong answer, try again in 10 seconds.")
}

let lastSubmit = -10000;
// Handle form submission
textForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (performance.now() - lastSubmit < 10000) {
        showToast(`You have to wait ${((10000 - (performance.now() - lastSubmit)) / 1000).toFixed(2)} seconds before submitting an answer`)
        return
    }

    lastSubmit = performance.now()
    const text = textInput.value.trim();
    
    if (text) {
        checkInput(text, currentProblem)
    } else {
        showToast('Please enter a value');
    }
});

// Add focus styles for better accessibility
textInput.addEventListener('focus', () => {
    textInput.parentElement.classList.add('focused');
});

textInput.addEventListener('blur', () => {
    textInput.parentElement.classList.remove('focused');
});

function loadTask(taskID) {
    const extraText = document.querySelector("#task-extra-text");
    let taskInput = tasks[taskID][0];
    document.querySelector("#task").innerHTML = taskInput;
    if (currentProblem > 2) {
        extraText.classList.remove("none");
        document.querySelector("#textInput").value = taskInput.replaceAll("<br>", "\n");
    } else {
        extraText.classList.add("none");
    }
    let taskPrompt = tasks[taskID][1];
    document.querySelector("#task-text").innerHTML = taskPrompt;
    updateTextArea()
    let extraPrompt = tasks[taskID][2];
    extraText.innerHTML = extraPrompt;
}

const tasks = [
    ["Hello<br>World!", "Sett sammen linjene.", ""],
    ["583<br>7486<br>124<br>46<br>5477<br>235<br>754<br>7542<br>463<br>1235<br>7542<br>463<br>4745<br>2356<br>43754<br>7865<br>1274<br>7246<br>6236<br>4442634<br>236743634<br>2364673625<br>246<br>6827364", "Adder sammen alle linjene.", ""],
    ["7 * 16 + 9 - 105<br>8 * 6<br>250 / 5 - 30<br>144 / 12 + 4 * 3<br>93 - 48 + 36<br>5 + 9<br>6 * 15 + 5 - 40<br>120 / 10<br>132 / 11 + 1 * 4<br>7 * 9 + 25<br>144 / 12<br>62 - 25<br>96 / 16 + 4 * 3<br>132 / 11 + 9<br>77 + 45 - 32<br>99 - 88<br>6 * 7<br>29 * 2 + 16<br>250 / 10 * 5<br>45 - 28<br>9 * 8 + 7 - 63<br>132 / 6 - 18<br>144 / 18 + 6 * 4<br>9 * 12 + 8 - 90<br>250 - 100 / 10 * 4<br>78 - 34 + 21<br>99 - 45 + 11<br>45 + 29 - 14<br>27 / 3 * 2<br>81 / 3<br>96 / 12 * 5<br>6 * 8 + 33<br>132 / 8 + 4 * 6<br>72 / 8<br>19 + 14<br>56 / 7 + 22<br>15 * 4 + 22<br>81 / 9<br>17 * 3 + 40<br>7 * 9 + 6 - 50<br>3 * 9<br>47 + 36 - 19<br>18 + 6 * 4<br>99 - 33 / 11 * 6<br>250 - 50 / 5 + 25<br>9 * 4 - 7<br>11 * 5<br>62 + 37 - 45<br>88 / 4 - 19<br>144 / 9 + 3 * 2<br>33 + 27<br>15 + 30 / 5 * 2<br>121 / 11 * 3<br>25 + 19<br>132 / 11 * 4<br>99 - 45 / 9 * 7<br>13 + 6<br>48 / 8 * 3<br>10 * 10<br>8 * 12 - 30<br>200 - 75 + 30<br>144 / 12 + 18<br>93 - 48 + 36<br>23 + 58 - 12<br>225 - 125 / 10 * 8<br>132 / 11 + 1 * 4<br>65 - 30<br>144 / 12 + 4 * 3<br>78 - 34 + 21<br>250 / 5 - 30<br>47 + 36 - 19<br>200 - 50 / 5 + 18<br>27 + 34<br>8 * 18 + 2 - 64<br>6 * 5 + 17<br>99 - 45 + 11<br>9 * 4<br>132 / 6 - 18<br>180 - 90 / 9 * 4<br>225 - 75 / 5 + 30<br>250 - 50 / 10 * 5<br>7 * 14 + 6 - 77<br>45 - 28<br>8 * 18 + 2 - 64<br>72 / 8<br>6 * 15 + 5 - 40<br>99 - 88<br>180 - 60 / 6 * 7<br>250 - 50 / 5 + 25<br>144 / 18 + 6 * 4<br>", "Regn ut hver linje ved å bruke regnerekkefølge. Summer deretter resultatene fra alle linjene.", ""],
    ["", "", ""],
    ["while true: # Kjører programmet til brukeren manuelt stopper det<br>    brukertall == int(input(\"Skriv inn et tall: )) # Får et tall fra brukeren<br><br>    function f(x): # Lager en funksjon som tar inn X som en variabel<br>        return (x+15*x)/2 # Returnerer et tall basert på X sin verdi<br><br>    print(f\"x:{brukertall}; y:{f(brukertall)}\")) # Printer både x og y verdi<br>", "Rediger programmet sånn at det ikke inneholder feil.<br>Feilmeldinger:", "Line 2:25 SyntaxError: unterminated string literal (detected at line 2)<br>Line 7:46 SyntaxError: unmatched ')'<br>Line 4:10 SyntaxError: invalid syntax<br>Line 1:8-11 NameError: name 'true' is not defined. Did you mean: 'True'?<br>Line 2:1-10 NameError: name 'brukertall' is not defined<br>"]
]

const textarea = document.querySelector('textarea');
textarea.addEventListener("input", function() {
    updateTextArea()
})

function updateTextArea() {
    function autoResize(el) {
      el.style.height = 'auto'; // Reset height
      el.style.height = el.scrollHeight + 'px'; // Set to scroll height
    }
  
    textarea.addEventListener('input', () => autoResize(textarea));
    autoResize(textarea);
}
updateTextArea()

// <div style='background-color:#f5f5f5; width:100%;'>while true: # Kjører programmet til brukeren manuelt stopper det</div><div style='background-color:#fff; width:100%;'>    brukertall == int(input(\"Skriv inn et tall: )) # Får et tall fra brukeren</div><div style='background-color:#f5f5f5;'> </div><div style='background-color:#fff;'>    function f(x): # Lager en funksjon som tar inn X som en variabel</div><div style='background-color:#f5f5f5;'>        return (x+15*x)/2 # Returnerer et tall basert på X sin verdi</div><div style='background-color:#fff;'> </div><div style='background-color:#f5f5f5;'>    print(f\"x:{brukertall}; y:{f(brukertall)}\")) # Printer både x og y verdi</div>
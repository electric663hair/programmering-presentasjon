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
    if (currentProblem > 2) {
        extraText.classList.remove("none");
        document.querySelector("#task").innerHTML = taskInput;
        document.querySelector("#textInput").value = taskInput;
    } else {
        extraText.classList.add("none");
        document.querySelector("#task").textContent = taskInput;
    }
    let taskPrompt = tasks[taskID][1];
    document.querySelector("#task-text").innerHTML = taskPrompt;
    updateTextArea()
    let extraPrompt = tasks[taskID][2];
    extraText.innerHTML = extraPrompt;
}

const tasks = [
    ["Hello\nWorld!", "Sett sammen linjene.", ""],
    ["583\n7486\n124\n46\n5477\n235\n754\n7542\n463\n1235\n7542\n463\n4745\n2356\n43754\n7865\n1274\n7246\n6236\n4442634\n236743634\n2364673625\n246\n6827364", "Adder sammen alle linjene.", ""],
    ["7 * 16 + 9 - 105\n8 * 6\n250 / 5 - 30\n144 / 12 + 4 * 3\n93 - 48 + 36\n5 + 9\n6 * 15 + 5 - 40\n120 / 10\n132 / 11 + 1 * 4\n7 * 9 + 25\n144 / 12\n62 - 25\n96 / 16 + 4 * 3\n132 / 11 + 9\n77 + 45 - 32\n99 - 88\n6 * 7\n29 * 2 + 16\n250 / 10 * 5\n45 - 28\n9 * 8 + 7 - 63\n132 / 6 - 18\n144 / 18 + 6 * 4\n9 * 12 + 8 - 90\n250 - 100 / 10 * 4\n78 - 34 + 21\n99 - 45 + 11\n45 + 29 - 14\n27 / 3 * 2\n81 / 3\n96 / 12 * 5\n6 * 8 + 33\n132 / 8 + 4 * 6\n72 / 8\n19 + 14\n56 / 7 + 22\n15 * 4 + 22\n81 / 9\n17 * 3 + 40\n7 * 9 + 6 - 50\n3 * 9\n47 + 36 - 19\n18 + 6 * 4\n99 - 33 / 11 * 6\n250 - 50 / 5 + 25\n9 * 4 - 7\n11 * 5\n62 + 37 - 45\n88 / 4 - 19\n144 / 9 + 3 * 2\n33 + 27\n15 + 30 / 5 * 2\n121 / 11 * 3\n25 + 19\n132 / 11 * 4\n99 - 45 / 9 * 7\n13 + 6\n48 / 8 * 3\n10 * 10\n8 * 12 - 30\n200 - 75 + 30\n144 / 12 + 18\n93 - 48 + 36\n23 + 58 - 12\n225 - 125 / 10 * 8\n132 / 11 + 1 * 4\n65 - 30\n144 / 12 + 4 * 3\n78 - 34 + 21\n250 / 5 - 30\n47 + 36 - 19\n200 - 50 / 5 + 18\n27 + 34\n8 * 18 + 2 - 64\n6 * 5 + 17\n99 - 45 + 11\n9 * 4\n132 / 6 - 18\n180 - 90 / 9 * 4\n225 - 75 / 5 + 30\n250 - 50 / 10 * 5\n7 * 14 + 6 - 77\n45 - 28\n8 * 18 + 2 - 64\n72 / 8\n6 * 15 + 5 - 40\n99 - 88\n180 - 60 / 6 * 7\n250 - 50 / 5 + 25\n144 / 18 + 6 * 4\n", "Regn ut hver linje ved å bruke regnerekkefølge. Summer deretter resultatene fra alle linjene.", ""],
    ["", "", ""],
    ["while true: # Kjører programmet til brukeren manuelt stopper det\n     brukertall == int(input(\"Skriv inn et tall: )) # Får et tall fra brukeren\n\n    function f(x): # Lager en funksjon som tar inn X som en variabel\n        return (x+15*x)/2 # Returnerer et tall basert på X sin verdi\n\n    print(f\"x:{brukertall}; y:{f(brukertall)}\")) # Printer både x og y verdi\n", "Rediger programmet sånn at det ikke inneholder feil.<br>Feilmeldinger:", "Line 2:25 SyntaxError: unterminated string literal (detected at line 2)<br>Line 7:46 SyntaxError: unmatched ')'<br>Line 4:10 SyntaxError: invalid syntax<br>Line 1:8-11 NameError: name 'true' is not defined. Did you mean: 'True'?<br>Line 2:1-10 NameError: name 'brukertall' is not defined<br>"]
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
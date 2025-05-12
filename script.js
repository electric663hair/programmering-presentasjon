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

let seed
if (!localStorage.getItem("seed")) {
    localStorage.setItem("seed", Math.floor(Math.random() * (65536 + 1)))
}
seed = parseFloat(localStorage.getItem("seed"));

function random(n) {
    function seedAdd(seed) {
        const str = seed.toString();

        if (parseFloat(seed) === 0) return 0.1;

        const parts = str.split(".");
        if (parts.length === 1) return seed + 0.1;

        let decimals = parts[1].replace(/0+$/, ""); // Remove trailing zeros
        if (decimals.length === 0) return seed + 0.1;

        // Get last one or two digits (but non-zero)
        const nonZeroDigits = decimals.match(/[1-9]/g);
        if (!nonZeroDigits) return seed + 0.1;

        const lastDigits = decimals.match(/[1-9][0-9]?$/);
        const addition = parseFloat("0." + lastDigits[0]);

        return seed + addition;
    }

    x = Math.sin(seed) * 10000;
    seed = seedAdd(seed)
    return Math.floor((x - Math.floor(x)) * n) + 1;
}

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

document.querySelector("#btn").addEventListener("click", function() {
    let newSeed = prompt(`Set new seed, max of 65536\nOld seed is: ${localStorage.getItem("seed")}`)
    try {
        newSeed = parseInt(newSeed)
        if (!isNaN(newSeed) && newSeed >= -65536 && newSeed <= 65536) {
            localStorage.setItem("seed", newSeed)
        } else {
            alert(`Seed of ${newSeed} could not be set, number out of range.`)
        }
    } catch (e) {
        alert(`Could not set ${newSeed} as seed, input is not a number.`)
    }
})

// Show toast notification
function showToast(message, duration = 5000) {
    toastMessage.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

// Copy text to clipboard
copyButton.addEventListener('click', async () => {
    try {
        await navigator.clipboard.writeText(taskData.innerHTML.replaceAll("<br>", "\n").replaceAll("&nbsp;", " "));
        showToast('Text copied to clipboard!');
    } catch (err) {
        showToast('Failed to copy text', 4000);
        console.error('Failed to copy text: ', err);
    }
});

function checkInput(text, qID) {
    console.log(text, asnws.values[qID], qID)
    if (text == asnws.values[qID]) {
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
    document.querySelector("#textInput").value = "";
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
    ["", "Adder alle linjene.", ""],
    ["", "Regn ut hver linje ved å bruke regnerekkefølge. Summer deretter resultatet fra alle linjene sammen.", ""],
    ["def kommenter_farge(farge)<br>    if farge = \"blå\":<br>        print(\"Blå er en rolig og fin farge!\")<br>    elif farge == \"rød\"<br>        print(\"Rød er en energisk farge!\"<br>    else<br>        print(\"Det er også en flott farge.\")<br><br>brukerfarge = input(\"Hva er favorittfargen din? \")<br>kommenter_farge(brukerfarge)", "Rediger programmet sånn at det ikke inneholder feil.<br>Feilmeldinger:", "Line 1:26 SyntaxError: expected ':'<br>Line 2:4-16 SyntaxError: invalid syntax. Maybe you meant '==' or ':=' instead of '='?<br>Line 4:20 SyntaxError: expected ':'<br>Line 5:35 SyntaxError: '(' was never closed<br>Line 6:5 SyntaxError: expected ':'<br>"],
    ["while true: # Kjører programmet til brukeren manuelt stopper det<br>    brukertall == int(input(\"Skriv inn et tall: )) # Får et tall fra brukeren<br><br>    function f(x): # Lager en funksjon som tar inn X som en variabel<br>        return (x+15*x)/2 # Returnerer et tall basert på X sin verdi<br><br>    print(f\"x:{brukertall}; y:{f(brukertall)}\")) # Printer både x og y verdi<br>", "Rediger programmet sånn at det ikke inneholder feil.<br>Feilmeldinger:", "Line 2:25 SyntaxError: unterminated string literal (detected at line 2)<br>Line 7:46 SyntaxError: unmatched ')'<br>Line 4:10 SyntaxError: invalid syntax<br>Line 1:8-11 NameError: name 'true' is not defined. Did you mean: 'True'?<br>Line 2:1-10 NameError: name 'brukertall' is not defined<br>"]
]

let asnws = {
    values : [
        "Hello World!",
        "",
        "",
        "",
        `while True: # Kjører programmet til brukeren manuelt stopper det\n    brukertall = int(input("Skriv inn et tall: ")) # Får et tall fra brukeren\n    \n    def f(x): # Lager en funksjon som tar inn X som en variabel\n        return (x+15*x)/2 # Returnerer et tall basert på X sin verdi\n\n    print(f"x:{brukertall}; y:{f(brukertall)}") # Printer både x og y verdi`
    ]
}

for (let i = 0; i<75; i++) {
    tasks[1][0] += random(1000000) + "<br/>"
}

for (let i = 0; i<75; i++) {
    let x = random(5) - 1

    if (x == 0) {
        tasks[2][0] += `${random(150) + 100} + ${random(150) + 100} - ${random(100)}`
        
    } else if (x == 1) {
        tasks[2][0] += `${random(100000)} + ${random(1000)} + ${random(10000)}`
        
    } else if (x == 2) {
        let x = [random(10000), random(10000)]
        tasks[2][0] += `${Math.max(x[0], x[1])} - ${Math.min(x[0], x[1])}`
        
    } else if (x == 3) {
        tasks[2][0] += `${random(100000)} / ${random(1000)} + ${random(10000)} * ${random(1000)} - ${random(1000)}`

    } else if (x == 4) {
        tasks[2][0] += `${random(1000000000)} * ${random(10000)} / ${random(10000)} / ${random(1000)} - ${random(10000)} + ${random(100000)}`

    }

    tasks[2][0] += "<br/>"
}

asnws.values[1] = task1();
asnws.values[2] = task2();

function task1() {
    let total = 0;
    const expressions = tasks[1][0].split("<br/>")

    for (const line of expressions) {
        if (!line.trim()) {
            continue;
        }

        try {
            if (!isNaN(line)) {
                total += parseFloat(line);
            } else {
                console.warn(`Invalid result from expression: "${line}"`);
            }
        } catch (e) {
            console.error(`Failed to evaluate expression: "${line}" - ${e.message}`);
        }
    }

    return total
}

function task2() {
    let total = 0;
    const expressions = tasks[2][0].split("<br/>")

    for (const expr of expressions) {
        if (!expr.trim()) {
            continue;
        }

        try {
            const result = eval(expr);
            if (typeof result === 'number' && !isNaN(result)) {
                total += result;
            } else {
                console.warn(`Invalid result from expression: "${expr}"`);
            }
        } catch (e) {
            console.error(`Failed to evaluate expression: "${expr}" - ${e.message}`);
        }
    }

    return total
}

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
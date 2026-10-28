const display = document.getElementById("display");

// Display clear
function clearDisplay() {
    display.value = "";
}

// Add numbers and operators
function appendToDisplay(value) {

    const current = display.value;

    // Start a new calculation after an error
    if (current === "Error") {
        display.value = "";
    }

    // Prevent multiple decimal points in one number
    if (value === ".") {

        const parts = display.value.split(/[+\-*/^%]/);
        const lastNumber = parts[parts.length - 1];

        if (lastNumber.includes(".")) {
            return;
        }
    }

    display.value += value;
}

// Delete the last character
function backspace() {

    if (display.value === "Error") {
        display.value = "";
        return;
    }

    display.value = display.value.slice(0, -1);
}

// Calculate the result
function calculate() {

    let expression = display.value;

    if (expression.trim() === "") {
        return;
    }

    try {

        // Allow only calculator characters
        if (!/^[0-9+\-*/^%.()\s]+$/.test(expression)) {
            throw new Error("Invalid expression");
        }

        // Convert percentage into division by 100
        expression = expression.replace(
            /(\d+(?:\.\d+)?)%/g,
            "($1/100)"
        );

        // Convert ^ into JavaScript exponentiation
        expression = expression.replace(/\^/g, "**");

        // Evaluate the validated mathematical expression
        const result = Function(
            '"use strict"; return (' + expression + ');'
        )();

        // Reject invalid or infinite results
        if (typeof result !== "number" || !Number.isFinite(result)) {
            throw new Error("Invalid result");
        }

        // Display a clean result
        display.value = String(
            Number(result.toPrecision(12))
        );

    } catch (error) {

        display.value = "Error";

    }
}

// Keyboard support
document.addEventListener("keydown", function (event) {

    const key = event.key;

    // Numbers and operators
    if (/^[0-9+\-*/^%.()]$/.test(key)) {

        appendToDisplay(key);

    }

    // Enter or = to calculate
    else if (key === "Enter" || key === "=") {

        event.preventDefault();
        calculate();

    }

    // Backspace to delete
    else if (key === "Backspace") {

        event.preventDefault();
        backspace();

    }

    // Escape to clear
    else if (key === "Escape") {

        clearDisplay();

    }

});
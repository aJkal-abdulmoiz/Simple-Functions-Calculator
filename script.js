const form = document.getElementById("form");
const inputArea = document.getElementById("CalArea");
const suggestionBox = document.getElementById("suggestion-box");

form.addEventListener("submit", function (event) {
  event.preventDefault();
});

// Store the previous input value
let previousInput = inputArea.value.trim();

inputArea.addEventListener("input", function (event) {
  const input = event.target.value.trim();
  const words = input.split(" ");
  const lastWord = words[words.length - 1];

  // Check if the last word is a complete variable and if it was written completely
  if (previousInput.endsWith(" " + lastWord) && !previousInput.endsWith(selectedSuggestion)) {
    const variableSuggestions = ["monthly churn rate", "customers", "monthly new customers"];

    // Check if the last word is a complete variable and exists in the variable suggestions
    if (variableSuggestions.includes(lastWord)) {
      // Remove the last word (complete variable) with a single backspace
      inputArea.value = input.slice(0, -lastWord.length).trim();
    }
  }

  previousInput = input;
  updateSuggestions(lastWord);
});

suggestionBox.addEventListener("click", function (event) {
  const selectedSuggestion = event.target.textContent;
  insertSuggestedFunction(selectedSuggestion);
});

// Predefined variable values
const variableValues = {
  "monthly churn rate": 50,
  "customers": 10,
  "monthly new customers": 20,
  "__monthly_new_customers__": 0
};

function updateSuggestions(input) {
  if (input === "") {
    suggestionBox.innerHTML = "";
    suggestionBox.style.display = "none";
    return;
  }

  const suggestedFunctionsAndVariables = getSuggestedFunctionsAndVariables(input);
  displaySuggestions(suggestedFunctionsAndVariables);
}

function getSuggestedFunctionsAndVariables(input) {
  if (input === "") {
    return [];
  }

  const functionNames = ["round", "ceil", "floor"];
  const variableSuggestions = ["monthly churn rate", "customers", "monthly new customers"];

  const lowercaseInput = input.toLowerCase();
  const suggestions = [];

  // Filter function names that contain the input text
  for (const name of functionNames) {
    if (name.includes(lowercaseInput)) {
      suggestions.push(name);
    }
  }

  // Filter variable suggestions that start with the input text (case-insensitive)
  for (const variable of variableSuggestions) {
    if (variable.toLowerCase().startsWith(lowercaseInput)) {
      suggestions.push(variable);
    }
  }

  return suggestions;
}

function insertSuggestedFunction(selectedSuggestion) {
  const words = inputArea.value.split(" ");
  const lastWord = words[words.length - 1];
  const suggestionIndex = words.length - 1;

  const lowercaseLastWord = lastWord.toLowerCase();
  const lowercaseSelectedSuggestion = selectedSuggestion.toLowerCase();

  if (lowercaseLastWord === "monthly" && lowercaseSelectedSuggestion === "churn" && words.length > 1) {
    words[suggestionIndex] = "Monthly churn rate";
    inputArea.value = words.join(" ");
  } else if (lowercaseSelectedSuggestion in variableValues) {
    const button = document.createElement("button");
    button.classList.add("variable-button");
    button.textContent = selectedSuggestion;

    variableValues[lowercaseSelectedSuggestion] = variableValues[selectedSuggestion.toLowerCase()];

    words[suggestionIndex] = words[suggestionIndex].replace(lastWord, button.outerHTML);

    inputArea.value = words.join(" ");
  } else {
    if (selectedSuggestion.startsWith(lastWord)) {
      words[suggestionIndex] = selectedSuggestion;
    } else {
      words[suggestionIndex] = selectedSuggestion;
    }
    inputArea.value = words.join(" ");
  }

  suggestionBox.style.display = "none";
  // updateVariableButtons();
}

function getOutput() {
    try {
      const calculationString = document.getElementById("CalArea").value;
  
      if (calculationString.trim() === "") {
        document.getElementById("result").value = "";
        return;
      }
  
      if (!areParenthesesBalanced(calculationString)) {
        document.getElementById("result").value = "Invalid expression: Unbalanced parentheses.";
        return;
      }
  
      let replacedCalculationString = calculationString;
      for (const variable in variableValues) {
        const regex = new RegExp(`\\b${variable}\\b`, "g");
        replacedCalculationString = replacedCalculationString.replace(regex, variableValues[variable]);
      }
  
      // Add spaces around operators and parentheses to separate them from variables
      replacedCalculationString = replacedCalculationString.replace(/([-+*/()])/g, " $1 ");
  
      const mathScope = {
        round: Math.round,
        ceil: Math.ceil,
        floor: Math.floor,
        ...variableValues, // Add predefined variables to the math scope
      };
  
     
  
      const result = math.evaluate(replacedCalculationString, mathScope);
      document.getElementById("result").value = result;
    } catch (error) {
      document.getElementById("result").value = "Invalid input. Please enter a valid calculation.";
    }
  

  }

function displaySuggestions(suggestions) {
  suggestionBox.innerHTML = "";

  suggestions.forEach((suggestion) => {
    const suggestionElement = document.createElement("div");
    suggestionElement.classList.add("suggestion");
    suggestionElement.textContent = suggestion;
    suggestionBox.appendChild(suggestionElement);
  });

  suggestionBox.style.display = suggestions.length > 0 ? "block" : "none";
}

function areParenthesesBalanced(expression) {
  const stack = [];
  for (const char of expression) {
    if (char === "(") {
      stack.push(char);
    } else if (char === ")") {
      if (stack.length === 0 || stack.pop() !== "(") {
        return false;
      }
    }
  }
  return stack.length === 0;
}


  



  


  
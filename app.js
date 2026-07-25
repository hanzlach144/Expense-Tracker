const expenseNameInput = document.getElementById("expense-name");
const expenseAmountInput = document.getElementById("expense-amount");
const addExpenseButton = document.getElementById("add-expense-btn");
const categorySelect = document.getElementById("expenses-select");
const expenseList = document.getElementById("expense-list");
const totalExpenses = document.getElementById("total-expenses");
const searchExpenseInput = document.getElementById("search-expense");
const categoryFilter = document.getElementById("filter-category");
const sortExpenses = document.getElementById("sort-expenses");
const budgetInput = document.getElementById("budget-input");
const setBudgetButton = document.getElementById("set-budget-btn");
const expenseDateInput = document.getElementById("expense-date");
const expenseChartCanvas = document.getElementById("expenseChart");
const expenseBarChart = document.getElementById("expenseBarChart");
const highestExpense = document.getElementById("highest-expense");
const topCategory = document.getElementById("top-category");
const totalTransactions = document.getElementById("total-transactions");
const averageExpense = document.getElementById("average-expense");
const exportPdfButton = document.getElementById("export-pdf-btn");
const darkModeButton = document.getElementById("dark-mode-btn");

const budgetDisplay = document.getElementById("budget-display");
const remainingBudget = document.getElementById("remaining-budget");
const budgetWarning = document.getElementById("budget-warning");
const monthFilter = document.getElementById("month-filter");

let budget = Number(localStorage.getItem("budget")) || 0;
budgetDisplay.textContent = `Rs.${budget}`;

function updateBudgetState() {

    addExpenseButton.disabled = budget <= 0;

}

setBudgetButton.addEventListener("click", function () {

  let input = Number(budgetInput.value);

  budget = input;

  localStorage.setItem("budget", budget);

  budgetDisplay.textContent = `Rs.${budget}`;

  updateRemaining();
  updateBudgetState();

  budgetInput.value = "";

});

let expenses = [];
let editingIndex = -1;
let expenseChart;
let barChart;


function updateThemeButton() {

    if (document.body.classList.contains("dark-mode")) {

        darkModeButton.textContent = "☀ Light Mode";

    } else {

        darkModeButton.textContent = "🌙 Dark Mode";

    }

}

darkModeButton.addEventListener("click", function () {

    document.body.classList.toggle("dark-mode");
    updateThemeButton();

    if (document.body.classList.contains("dark-mode")) {

        localStorage.setItem("theme", "dark");

    } else {

        localStorage.setItem("theme", "light");

    }

});

exportPdfButton.addEventListener("click", exportPDF);

function exportPDF () {
    const { jsPDF } = window.jspdf;

    let doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Expense Tracker Report", 20, 20);
    let today = new Date();

    doc.setFontSize(12);

    doc.text(`Generated on: ${today.toDateString()}`, 20, 30);

    doc.setFontSize(14);

doc.text(`Budget: Rs.${budget}`, 20, 45);

doc.text(
    `Remaining Budget: ${remainingBudget.textContent}`,
    20,
    55
);

doc.text(
    `Total Expenses: ${totalExpenses.textContent}`,
    20,
    65
);

doc.setFontSize(16);

doc.text("Expense List", 20, 85);

doc.setFontSize(12);

doc.text("Name", 20, 95);
doc.text("Category", 80, 95);
doc.text("Amount", 135, 95);
doc.text("Date", 170, 95);

doc.line(20, 98, 190, 98);

let y = 108;

expenses.forEach(function(expense) {

    if (y > 270) {
        doc.addPage();
        y = 20;
    }

    doc.text(expense.name, 20, y);
    doc.text(expense.category, 80, y);
    doc.text(`Rs.${expense.amount}`, 135, y);
    doc.text(expense.date, 170, y);

    y += 10;

});

    doc.save("Expense_Report.pdf");
}

addExpenseButton.addEventListener("click", addExpense);


function addExpense () {
    if (budget <= 0) {
    alert("Please set your budget first.");
    return;
}

     if(expenseNameInput.value === "" ||
       expenseAmountInput.value === "" ||
       categorySelect.value === "") {
        alert("Please fill all fields.");
        return;
    }

     let selectedDate;

if (expenseDateInput.value) {
    selectedDate = new Date(expenseDateInput.value);
} else {
    selectedDate = new Date();
}

let formattedDate =
`${selectedDate.getDate()} ${selectedDate.toLocaleString("en", { month: "short" })} ${selectedDate.getFullYear()}`;

let formattedMonth =
`${selectedDate.toLocaleString("en", { month: "short" })} ${selectedDate.getFullYear()}`;
     

  let expense = {
      name: expenseNameInput.value,
      amount: Number(expenseAmountInput.value),
      category: categorySelect.value,

      date: formattedDate,
      createdAt: Date.now(),
      month: formattedMonth
  }

  if(editingIndex !== -1) {
    expense.createdAt = expenses[editingIndex].createdAt;
    expense.date = expenses[editingIndex].date;

    expenses[editingIndex] = expense;
  } else {
    expenses.push(expense);
  }
  saveExpenses();
  populateMonthFilter();
  applyFilters();
  updateRemaining();
  clearInputs();
  editingIndex = -1;
  addExpenseButton.textContent = "Add Expense";
}


function displayExpense (expense, index) {
  let expenseItem = document.createElement("div");
  expenseItem.className = "expense-item";

  let expenseInfo = document.createElement("div");
  expenseInfo.className = "expense-info";

  expenseInfo.innerHTML = `
    <h3>${expense.name}</h3>
    <p class="category-badge">🛒 ${expense.category}</p>
    <p>📅 ${expense.date}</p>
    <p>${expense.month}</p>
    <div class="expense-amount">
        Rs.${expense.amount}
    </div>
`;

  let expenseButtons = document.createElement("div");
  expenseButtons.className = "expense-buttons";

  expenseItem.appendChild(expenseInfo);
  expenseItem.appendChild(expenseButtons);

  expenseList.appendChild(expenseItem);

  let deleteButton = document.createElement("button");
  deleteButton.textContent = "🗑 Delete";
  expenseButtons.appendChild(deleteButton);

  deleteButton.addEventListener("click", function () {
    expenses.splice(index,1);
    saveExpenses();
    populateMonthFilter();
    applyFilters();
    updateRemaining();
  });

  let editButton = document.createElement("button");
  editButton.textContent = "✏ Edit";
  expenseButtons.appendChild(editButton);

  editButton.addEventListener("click", function () {
    editingIndex = index;
    expenseNameInput.value = expense.name;
    expenseAmountInput.value = expense.amount;
    categorySelect.value = expense.category;
    addExpenseButton.textContent = "Update Expense";
  });
}

searchExpenseInput.addEventListener("input", applyFilters);

categoryFilter.addEventListener("change", applyFilters);

sortExpenses.addEventListener("change", applyFilters);

monthFilter.addEventListener("change", applyFilters);


function applyFilters () {
  let searchText = searchExpenseInput.value.toLowerCase();
  let selectedCategory = categoryFilter.value;
  let selectedMonth = monthFilter.value;
   
  let filteredExpenses = expenses.filter (function (expense) {
    return expense.name.toLowerCase().includes(searchText) &&
    (selectedCategory === "All" || expense.category === selectedCategory) && 
    (selectedMonth === "All" || expense.month === selectedMonth);
  });

  let sortValue = sortExpenses.value;

if (sortValue === "low-high") {

    filteredExpenses.sort(function (a, b) {
        return a.amount - b.amount;
    });

} else if (sortValue === "high-low") {

    filteredExpenses.sort(function (a, b) {
        return b.amount - a.amount;
    });

} else if (sortValue === "a-z") {

    filteredExpenses.sort(function (a, b) {
        return a.name.localeCompare(b.name);
    });

} else if (sortValue === "z-a") {

    filteredExpenses.sort(function (a, b) {
        return b.name.localeCompare(a.name);
    });
}
    else if (sortValue === "newest") {
        filteredExpenses.sort(function (a, b) {
            return b.createdAt - a.createdAt;
        });
    } else if (sortValue === "oldest") {
        filteredExpenses.sort(function (a, b) {
            return a.createdAt - b.createdAt;
        });

    }
      renderExpenses(filteredExpenses);
      updateFilteredTotal(filteredExpenses);
      updateChart(filteredExpenses);
      updateBarChart(filteredExpenses);
      updateAnalytics(filteredExpenses);
}

function populateMonthFilter () {

  let months = [];

  expenses.forEach(function (expense) {

    if(!months.includes(expense.month)) {

      months.push(expense.month);

      }

  });

   monthFilter.innerHTML = `
    <option value="All">All Months</option>
    `;

    months.forEach(function (month) {

        let option = document.createElement("option");

        option.value = month;
        option.textContent = month;

        monthFilter.appendChild(option);

    });

}

function updateChart (expenseArray) {
  let categoryTotals = {};

  expenseArray.forEach(function(expense) {
    if(categoryTotals[expense.category]) {
      categoryTotals[expense.category] += expense.amount;
    } else {
      categoryTotals[expense.category] = expense.amount;
    }

    });

    let labels = Object.keys(categoryTotals);
    let data = Object.values(categoryTotals);

    if(expenseChart) {
      expenseChart.destroy();
    }

    expenseChart = new Chart(expenseChartCanvas.getContext("2d"), {
    type: "pie",

    data: {
        labels: labels,

        datasets: [{
            label: "Expenses",

            data: data,

            backgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#4BC0C0",
                "#9966FF",
                "#FF9F40",
                "#8BC34A",
                "#E91E63",
                "#795548",
                "#607D8B",
                "#9C27B0"
            ]
        }]
    },

    options: {
        responsive: true,
        maintainAspectRatio: false,

        plugins: {
            legend: {
                position: "bottom"
            }
        }
    }
});

}

function updateBarChart(expenseArray) {
  let categoryTotals = {};

  expenseArray.forEach(function(expense) {
    if(categoryTotals[expense.category]) {
      categoryTotals[expense.category] += expense.amount;
    } else {
      categoryTotals[expense.category] = expense.amount;
    }

    });

    let labels = Object.keys(categoryTotals);
    let data = Object.values(categoryTotals);

    if(barChart) {
      barChart.destroy();
    }


    barChart = new Chart(expenseBarChart.getContext("2d"), {

    type: "bar",

    data: {

        labels: labels,

        datasets: [{
    label: "Expense Amount (Rs.)",
    data: data,
    backgroundColor: [
        "#FF6384",
        "#36A2EB",
        "#FFCE56",
        "#4BC0C0",
        "#9966FF",
        "#FF9F40",
        "#8BC34A",
        "#E91E63",
        "#795548",
        "#607D8B",
        "#9C27B0"
    ],
    borderRadius: 8
}]

    },

    options: {

        responsive: true,

        maintainAspectRatio: false,

        plugins: {

            legend: {
                display: false
            },
          
              title: {
        display: true,
        text: "Expense Amount by Category"
    }

},

        scales: {

            y: {
                beginAtZero: true
            }

        }

    }

});

}

function updateAnalytics(expenseArray) {

    totalTransactions.textContent = expenseArray.length;
    if (expenseArray.length === 0) {
    highestExpense.textContent = "Rs.0";
    topCategory.textContent = "-";
    averageExpense.textContent = "Rs.0";
    return;
}

    let highest = 0;
    expenseArray.forEach(function(expense) {

      if(expense.amount > highest) {
        highest = expense.amount;
      }
    });

    highestExpense.textContent = `Rs.${highest}`;

    let categoryTotals = {};
    expenseArray.forEach(function(expense) {
      if(categoryTotals[expense.category]) {
        categoryTotals[expense.category] += expense.amount;
      } else {
        categoryTotals[expense.category] = expense.amount;
      }
    });

    let highestCategory = "";
    let highestAmount = 0;

    for(let category in categoryTotals) { 
      if(categoryTotals[category] > highestAmount) {
        highestAmount = categoryTotals[category];
        highestCategory = category;
      }

    }
    topCategory.textContent = highestCategory;

    let total = getFilteredTotal(expenseArray);

    let average = 0;
    if(expenseArray.length > 0) {
      average = total / expenseArray.length;
    }

    averageExpense.textContent = `Rs.${Math.round(average)}`;

}

function updateRemaining () {
  let remaining = budget - getTotalExpenses();
  remainingBudget.textContent = `Rs.${remaining}`;
  if (remaining < 0) {
    remainingBudget.style.color = "red";
    budgetWarning.textContent = "⚠ Budget Exceeded!";
  } else {
    remainingBudget.style.color = "green";
    budgetWarning.textContent = "";
  }
}
  
function getTotalExpenses() {
    let total = 0;

    for (let i = 0; i < expenses.length; i++) {
        total += expenses[i].amount;
    }

    return total;
}


function updateTotal () {
  let total = 0;
    for(let i = 0; i < expenses.length; i++) {
      total += expenses[i].amount;
  }
    totalExpenses.textContent = `Rs.${total}`;
}

function getFilteredTotal(expenseArray) {

  let total = 0;

    expenseArray.forEach(function (expense) {
        total += expense.amount;
    });

    return total;

}

function updateFilteredTotal(expenseArray) {

    let total = getFilteredTotal(expenseArray);

    totalExpenses.textContent = `Rs.${total}`;

}


function clearInputs () {
  expenseNameInput.value = "";
  expenseAmountInput.value = "";
  categorySelect.value = "";
  expenseDateInput.value = "";
}


function renderExpenses (expenseArray) {
  expenseList.innerHTML = "";
  for(let i=0;i<expenseArray.length;i++) {
    displayExpense(expenseArray[i],i);
  }
}

function saveExpenses () {
  let data = JSON.stringify(expenses);
  localStorage.setItem("expenses" , data);
}

function loadExpenses () {
  let data = localStorage.getItem("expenses");
  if(data) {
    expenses = JSON.parse(data);
  }
}

loadExpenses();

populateMonthFilter();

applyFilters();

updateRemaining();

updateBudgetState()

let savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {

    document.body.classList.add("dark-mode");

}
updateThemeButton();
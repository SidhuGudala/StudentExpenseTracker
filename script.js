const expenseForm = document.getElementById("expense-form");
const expenseName = document.getElementById("expense-name");
const expenseAmount = document.getElementById("expense-amount");
const expenseCategory = document.getElementById("expense-category");
const expenseTable = document.getElementById("expense-table");
const totalExpenses = document.getElementById("total-expenses");
const expenseDate = document.getElementById("expense-date");
const monthFilter = document.getElementById("month-filter");
const clearFilterButton = document.getElementById("clear-filter");

const expenseChartCanvas = document.getElementById("expense-chart");

const budgetInput = document.getElementById("budget-input");
const monthlyBudgetDisplay = document.getElementById("monthly-budget");
const remainingBudgetDisplay = document.getElementById("remaining-budget");
const saveBudgetButton = document.getElementById("save-budget");

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

let nextId = expenses.length
? Math.max(...expenses.map(expense => expense.id)) + 1
: 1;

let monthlyBudget =
Number(localStorage.getItem("monthlyBudget")) || 5000;

let expenseChart = null;

// Set today's date in the expense form
expenseDate.value = new Date().toLocaleDateString("en-CA");

function getFilteredExpenses() {
if (!monthFilter.value) {
return expenses;
}

return expenses.filter(function(expense) {
    return expense.date &&
        expense.date.startsWith(monthFilter.value);
});


}

function updateBudget(total) {
const remaining = monthlyBudget - total;

monthlyBudgetDisplay.textContent =
    "₹" + monthlyBudget.toFixed(2);

remainingBudgetDisplay.textContent =
    "₹" + remaining.toFixed(2);

remainingBudgetDisplay.style.color =
    remaining < 0 ? "#e74c3c" : "#25243a";


}

function updateChart(filteredExpenses) {
const categoryTotals = {};

filteredExpenses.forEach(function(expense) {
    categoryTotals[expense.category] =
        (categoryTotals[expense.category] || 0) +
        expense.amount;
});

if (expenseChart) {
    expenseChart.destroy();
}

expenseChart = new Chart(expenseChartCanvas, {
    type: "pie",
    data: {
        labels: Object.keys(categoryTotals),
        datasets: [{
            data: Object.values(categoryTotals),
            backgroundColor: [
                "#8b5cf6",
                "#06b6d4",
                "#f59e0b",
                "#10b981",
                "#ef4444",
                "#ec4899"
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

function displayExpenses() {
expenseTable.innerHTML = "";

const filteredExpenses = getFilteredExpenses();
let total = 0;

filteredExpenses.forEach(function(expense) {
    total += expense.amount;

    const row = document.createElement("tr");

    const nameCell = document.createElement("td");
    nameCell.textContent = expense.name;

    const amountCell = document.createElement("td");
    amountCell.textContent =
        "₹" + expense.amount.toFixed(2);

    const categoryCell = document.createElement("td");
    categoryCell.textContent = expense.category;

    const actionCell = document.createElement("td");
    const deleteButton = document.createElement("button");

    deleteButton.textContent = "Delete";
    deleteButton.style.marginTop = "0";
    deleteButton.style.padding = "8px 12px";
    deleteButton.style.backgroundColor = "#e74c3c";

    deleteButton.addEventListener("click", function() {
        deleteExpense(expense.id);
    });

    actionCell.appendChild(deleteButton);

    row.appendChild(nameCell);
    row.appendChild(amountCell);
    row.appendChild(categoryCell);
    row.appendChild(actionCell);

    expenseTable.appendChild(row);
});

totalExpenses.textContent = "₹" + total.toFixed(2);

localStorage.setItem("expenses", JSON.stringify(expenses));

updateBudget(total);
updateChart(filteredExpenses);


}

function addExpense(name, amount, category, date) {
const expense = {
id: nextId++,
name: name,
amount: amount,
category: category,
date: date
};

expenses.push(expense);

localStorage.setItem("expenses", JSON.stringify(expenses));

displayExpenses();


}

function deleteExpense(id) {
expenses = expenses.filter(function(expense) {
return expense.id !== id;
});

displayExpenses();

}

saveBudgetButton.addEventListener("click", function() {
const newBudget = Number(budgetInput.value);

if (!Number.isFinite(newBudget) || newBudget <= 0) {
    alert("Please enter a budget greater than zero.");
    return;
}

monthlyBudget = newBudget;

localStorage.setItem("monthlyBudget", monthlyBudget);

budgetInput.value = monthlyBudget;

displayExpenses();


});

expenseForm.addEventListener("submit", function(event) {
event.preventDefault();


const name = expenseName.value.trim();
const amount = Number(expenseAmount.value);
const category = expenseCategory.value;
const date = expenseDate.value;

if (
    !name ||
    !Number.isFinite(amount) ||
    amount <= 0 ||
    !category ||
    !date
) {
    alert("Please enter a valid name, amount, category, and date.");
    return;
}

addExpense(name, amount, category, date);

expenseForm.reset();
expenseDate.value = new Date().toLocaleDateString("en-CA");


});

monthFilter.addEventListener("change", displayExpenses);

clearFilterButton.addEventListener("click", function() {
monthFilter.value = "";
displayExpenses();
});

budgetInput.value = monthlyBudget;
displayExpenses();

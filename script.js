const expenseForm = document.getElementById("expense-form");
const expenseName = document.getElementById("expense-name");
const expenseAmount = document.getElementById("expense-amount");
const expenseCategory = document.getElementById("expense-category");
const expenseTable = document.getElementById("expense-table");
const totalExpenses = document.getElementById("total-expenses");

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

let nextId = expenses.length
    ? Math.max(...expenses.map(expense => expense.id)) + 1
    : 1;

function displayExpenses() {
expenseTable.innerHTML = "";


let total = 0;

expenses.forEach(function(expense) {
    total += expense.amount;

    const row = document.createElement("tr");

    const nameCell = document.createElement("td");
    nameCell.textContent = expense.name;

    const amountCell = document.createElement("td");
    amountCell.textContent = "₹" + expense.amount.toFixed(2);

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

}

function addExpense(name, amount, category) {
const expense = {
id: nextId++,
name: name,
amount: amount,
category: category
};


expenses.push(expense);

displayExpenses();


}

function deleteExpense(id) {
expenses = expenses.filter(function(expense) {
return expense.id !== id;
});


displayExpenses();


}

expenseForm.addEventListener("submit", function(event) {
event.preventDefault();


const name = expenseName.value.trim();
const amount = Number(expenseAmount.value);
const category = expenseCategory.value;

if (!name || !Number.isFinite(amount) || amount <= 0 || !category) {
    alert("Please enter a valid name, amount, and category.");
    return;
}

addExpense(name, amount, category);

expenseForm.reset();


});
displayExpenses();
//////////IIFE/////////
(function () {
  //
  //Change month to current month
  const date = new Date();
  const month = date.toLocaleString("default", { month: "long" });
  document.querySelector(".budget__title--month").textContent = month;

  //
  //Data Variables
  var insertButton = document.querySelector(".ion-ios-checkmark-outline");
  var deleteButtons;
  var sign;
  var amount;
  var description;
  var incomeIDIndex;
  var expenseIDIndex;
  var incomeIDs = [];
  var expenseIDs = [];

  var budgetValue = 0;
  var income = 0;
  var expenses = 0;

  //
  //Function to add entries in both lists
  function addEntry() {
    sign = document.querySelector(".add__type").value; //////Get add type from user>> inc or exp

    description = document.querySelector(".add__description").value; //////Get description from user
    //
    //Prevent empty description
    if (description === "") {
      window.alert("You must enter a description");
      return null;
    }

    amount = document.querySelector(".add__value").value; //////Get amount from user
    //
    //Prevent 0 and negative values
    if (amount <= 0) {
      window.alert("You can't input 0 or -ve numbers");
      return null;
    }

    //
    ////Switch over sign: +(inc) >> add to income , -(exp) >> add to expenses
    switch (sign) {
      case "inc": //////Add Entry to Income
        updateIncomeIDs(true); ///Update income id array with new entry

        var htmlToInsert = document.createElement("div"); //////Create entry div
        htmlToInsert.classList.add("item", "clearfix");
        htmlToInsert.setAttribute("id", "income-" + incomeIDs[incomeIDIndex]);
        innerHTML =
          `
      <div class="item__description">` +
          description +
          `</div>
      <div class="right clearfix">
          <div class="item__value">+ ` +
          amount +
          `</div>
          <div class="item__delete">
              <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
          </div>
      </div>
  
  `;
        htmlToInsert.innerHTML = innerHTML;
        document
          .querySelector(".income")
          .insertAdjacentElement("beforeend", htmlToInsert);

        income += Number(amount);
        break;

      case "exp": //////Add Entry to Expenses
        updateExpenseIDs(true); ///Update expense ID array with new element

        var htmlToInsert = document.createElement("div"); //////Create entry div
        htmlToInsert.classList.add("item", "clearfix");
        htmlToInsert.setAttribute(
          "id",
          "expense--" + expenseIDs[expenseIDIndex]
        );
        innerHTML =
          `
          <div class="item__description">` +
          description +
          `</div>
          <div class="right clearfix">
            <div class="item__value">- ` +
          amount +
          `</div>
            <div class="item__percentage">10%</div>
            <div class="item__delete">
              <button class="item__delete--btn">
                <i class="ion-ios-close-outline"></i>
              </button>
            </div>
          </div>
        
      `;
        htmlToInsert.innerHTML = innerHTML;
        document
          .querySelector(".expenses")
          .insertAdjacentElement("beforeend", htmlToInsert);

        expenses += Number(amount);
        console.log(expenses);
        break;
    }

    //
    //get all delete buttons
    deleteButtons = document.querySelectorAll(".ion-ios-close-outline");
    //
    //Add event listener on click to all delete buttons
    for (var i = 0; i < deleteButtons.length; i++) {
      deleteButtons[i].addEventListener("click", deleteEntry);
    }

    budgetValue = income - expenses; //////Calculating budgetValue

    //
    //UI
    document.querySelector(".budget__value").textContent =
      budgetValue.toLocaleString();
    document.querySelector(".budget__income--value").textContent =
      "+ " + income;
    document.querySelector(".budget__expenses--value").textContent =
      "- " + expenses;
    document.querySelector(".add__description").value = "";
    document.querySelector(".add__value").value = "";
    updatePercentages();
  }

  function deleteEntry(e) {
    //
    //check if deleted element in income list or expenses list

    if (Boolean(e.target.closest(".expenses"))) {
      //
      //elemnt in expenses
      expenses -= Number(
        e.target
          .closest(".item")
          .querySelector(".item__value")
          .textContent.split(" ")[1]
      );
      console.log(expenses);
    } else {
      //
      //element in income
      income -= Number(
        e.target
          .closest(".item")
          .querySelector(".item__value")
          .textContent.split(" ")[1]
      );
    }

    budgetValue = income - expenses; //////Calculating budgetValue

    //
    //UI
    document.querySelector(".budget__value").textContent = budgetValue;
    document.querySelector(".budget__income--value").textContent =
      "+ " + income;
    document.querySelector(".budget__expenses--value").textContent =
      "- " + expenses;

    //
    // Remove deleted Entry
    e.target.parentElement.parentElement.parentElement.parentElement.remove();

    //
    //Update IDs

    if (Boolean(e.target.closest(".expenses"))) {
      updateExpenseIDs(false);
    } else {
      updateIncomeIDs(false);
    }

    //Update Percentages
    updatePercentages();
  }

  //
  //Function to update all percentages in expenses
  function updatePercentages() {
    //Entries of expense
    percentages = document.querySelectorAll(".item__percentage");
    //Main Expense
    mainExpensePercentage = document.querySelector(
      ".budget__expenses--percentage"
    );
    if (incomeIDs.length === 0) {
      console.log("im in");
      mainExpensePercentage.textContent = "% " + 0;
      for (var i = 0; i < percentages.length; i++) {
        percentages[i].textContent = "% " + 0;
      }
    } else {
      //Entries of expense
      for (var i = 0; i < percentages.length; i++) {
        percentages[i].textContent =
          "% " +
          (
            (100 *
              Number(
                percentages[i]
                  .closest(".right")
                  .querySelector(".item__value")
                  .textContent.split(" ")[1]
              )) /
            Number(income)
          ).toFixed();
      }
      //Main Expense
      mainExpensePercentage.textContent =
        "% " +
        (
          (100 *
            Number(
              mainExpensePercentage
                .closest(".right")
                .querySelector(".budget__expenses--value")
                .textContent.split(" ")[1]
            )) /
          income
        ).toFixed();
    }
  }

  //
  //Function to Update Income ID Array in both cases of new entries or deletion
  function updateIncomeIDs(isAdd) {
    //
    ///Adding new element to Array
    if (isAdd) {
      if (incomeIDs.length > 0) {
        //
        ////Array is not empty
        incomeIDIndex = Number(incomeIDs.length);
        incomeIDs.push(incomeIDs.length);
        console.log(incomeIDs);
      } else {
        //
        ////Array is empty
        incomeIDs.push(0);
        console.log(incomeIDs.length);
        incomeIDIndex = 0;
      }
    } else {
      //
      //Deleting Element from array

      incomeIDs.pop();
      for (var i = 0; i < incomeIDs.length; i++) {
        incomeIDs[i] = i;
      }
      //
      //Replace all ids in income elements
      incomeElements = document.querySelectorAll(".income .item");
      for (var i = 0; i < incomeElements.length; i++) {
        incomeElements[i].id = "income-" + i;
      }
    }
  }

  //
  //Function to Update Expense ID Array in both cases of new entries or deletion
  function updateExpenseIDs(isAdd) {
    if (isAdd) {
      //
      ///Adding new element to Array
      if (expenseIDs.length > 0) {
        //
        ////Array is not empty
        expenseIDIndex = Number(expenseIDs.length);
        expenseIDs.push(expenseIDs.length);
      } else {
        //
        ////Array is empty
        expenseIDs.push(0);
        expenseIDIndex = 0;
      }
    } else {
      //
      ///Deleting Element from array
      expenseIDs.pop();
      for (var i = 0; i < expenseIDs.length; i++) {
        expenseIDs[i] = i;
      }
      //
      //replace all ids in expenses elements
      expenseElements = document.querySelectorAll(".expenses .item");
      for (var i = 0; i < expenseElements.length; i++) {
        expenseElements[i].id = "expense-" + i;
      }
    }
  }

  //
  //Event Listeners//////////
  insertButton.addEventListener("click", addEntry);

  document.addEventListener("keydown", function (e) {
    //
    //Check if active element is either a description field or a value field
    if (
      e.key === "Enter" &&
      (document.activeElement === document.querySelector(".add__description") ||
        document.activeElement === document.querySelector(".add__value"))
    ) {
      addEntry();
    }
  });
})();

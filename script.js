'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
    .toLowerCase()
    .split(' ')
    .map(name => name[0])
    .join('');
  })
 
};

// update UI function

const updateUI = function (acc) {
    // Display movements
    displayMovements(acc.movements);
    // Display balance 
    calcDisplayBalance(acc);
    //Display Summary
    calcDisplaySumary(acc);
}

createUsernames(accounts);
console.log(accounts);

// The account movements

const displayMovements = function (movements) {
  containerMovements.innerHTML = '';
  
  movements.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
          <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
          <div class="movements__value">${mov}</div>
    </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);

  },)
}

displayMovements(account1.movements);


// CALC DISPLAY SUMMARY 

const calcDisplaySumary = function (acc) {
  const incomes = acc.movements.filter(mov => mov > 0).reduce((ac, mov) => ac + mov, 0);
  labelSumIn.textContent = `${incomes}€`
  //interest summary
  const interest = acc.movements
  .filter(mov => mov > 0)
  .map(deposit => deposit * acc.interestRate / 100)
  .filter((int, i, arr) => {
    console.log(arr);
    return int >= 1;
})
  .reduce((ac, mov) => ac + mov, 0);

  labelSumInterest.textContent = `${interest}€`
}


// calcDisplaySumary(account1.movements);

// CALC DISPLAY SUMMARY OUT balace

const calcDisplaySumaryOut = function (movements) {
  const out = movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`
}
calcDisplaySumaryOut(account1.movements);

// The account balance

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((ac, mov) => ac + mov, 0);
  
  labelBalance.textContent = `${acc.balance} EUR`;
};

// calcDisplayBalance(account1);

// Maximum value from movements

// const max = movements.reduce((acc, mov) => acc > mov ? acc: mov, movements[0]);

// console.log(max);

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount, value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // add movement 
    currentAccount.movements.push(amount);

    //update UI
    updateUI(currentAccount);
  }
});

// Event handler for accounts -------------------------------------------

let currentAccount;

btnLogin.addEventListener('click', function (e) {
  // prevent form from submititng
  e.preventDefault();
  
  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI a welcome message
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
    // show the app 
    containerApp.style.opacity = 100;
    // disable field focus
    inputLoginPin.blur();
    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';

    // update UI
    updateUI(currentAccount);

      //these 3 function was wraped into new function above.
    // Display movements
    // displayMovements(currentAccount.movements);
    // Display balance 
    // calcDisplayBalance(currentAccount);
    //Display Summary
    // calcDisplaySumary(currentAccount);

    console.log('Login');
  }
});

// transfer the funds trought the accounts

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();   // disable the default reloading the page

  const amount = Number(inputTransferAmount.value);
  const receiiverAcc = accounts.find(acc => acc.username === inputTransferTo.value);
  inputTransferAmount.value = inputTransferTo.value = '';

  if (amount > 0 && receiiverAcc && amount <= currentAccount.balance && receiiverAcc?.username !== currentAccount.username) {
    // doing the transfer

    currentAccount.movements.push(-amount);
    receiiverAcc.movements.push(amount);

    updateUI(currentAccount);
  }
});  

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  // check if credentials of the user is correct

  if (inputCloseUsername.value === currentAccount.username && Number(inputClosePin.value) === currentAccount.pin) {
    const index = accounts.findIndex(acc => acc.username === currentAccount.username);
    console.log(index);
    //Delete account
    accounts.splice(index, 1);
    //Hide UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////




// const checkDogs = function (dogsJulia, dogsKate) {
//   const copyDogsJulia = dogsJulia.slice();
//   copyDogsJulia.splice(0, 1);
//   copyDogsJulia.splice(-2);
//   const allDogs = [...copyDogsJulia, ...dogsKate];
//   allDogs.forEach(function (dog, i) {
//     dog < 3 ? console.log(`Dog number ${i + 1} is a puppy age is ${dog} years`) : console.log(`Dog number ${i + 1} is an adult age is ${dog} years`);
//   });
// }
// console.log('Ex 1 ---------------');
// checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);

// console.log('Ex 2 ---------------');
// checkDogs([9, 16, 6, 8, 3], [10, 5, 6, 1, 4]);

// const withdrawals = movements.filter(mov => mov < 0);

// console.log(withdrawals);


// Calceulate the dog age in human age using map,reduce,filter

// let humanAge = 0;

// const doginHumanAge = function (dogages) {
//   const dogAgeToHuman = dogages
//     .map(dogage => dogage <= 2 ?
//       humanAge = 2 * dogage : humanAge = 16 + dogage * 4)
//     .filter(age => age >= 18)
//     .reduce((av, cur, i, arr) => av + cur / arr.length, 0);
  
//   return dogAgeToHuman;
// }

// console.log(doginHumanAge([5,2,4,1,15,8,3]));

// convert Euro to USD

// const euroToUsd = 1.1;
// const totalDepositsUSD = movements
//   .filter(mov => mov > 0)
//   .map(mov => mov * euroToUsd)
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(totalDepositsUSD);



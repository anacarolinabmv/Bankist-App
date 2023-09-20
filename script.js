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

// SELECTING DOM ELEMENTS

const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const balanceLabel = document.querySelector('.balance__label');
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

let currentAccount;
let sorted = false;

//GENERATING USERNAMES
const createUsernames = function (accounts) {
  accounts.forEach(acc => {
    const owner = acc.owner.toLowerCase();
    acc.username = owner
      .split(' ')
      .reduce((acc, value) => (acc += value.at(0)), '');
  });
};

//DISPLAY BALANCES AND MOVEMENTS
const sortMovements = function () {
  sorted = !sorted;

  renderMovements(
    sorted
      ? [...currentAccount.movements].sort((a, b) => a - b)
      : currentAccount.movements
  );
};

const roundToTwoDec = function (value) {
  return Math.round(value * 100) / 100;
};

const renderMovements = function (movements) {
  containerApp.style.opacity = 1;
  containerMovements.innerHTML = '';

  movements.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `<div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__date">1 days ago</div>
          <div class="movements__value">${roundToTwoDec(mov)}€</div>
        </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcBalance = function (currentAcc) {
  const balance = roundToTwoDec(
    currentAcc.movements.reduce((acc, cur) => (acc += cur))
  );
  return balance;
};

const displayAccountSummary = function (currentAcc) {
  labelBalance.textContent = `${calcBalance(currentAcc)}€`;

  labelSumIn.textContent = `${roundToTwoDec(
    currentAcc.movements
      .filter(mov => mov > 0)
      .reduce((acc, cur) => acc + cur, 0)
  )}€`;

  labelSumOut.textContent = `${roundToTwoDec(
    Math.abs(
      currentAcc.movements
        .filter(mov => mov < 0)
        .reduce((acc, cur) => acc + cur, 0)
    )
  )}€`;

  labelSumInterest.textContent = `${roundToTwoDec(
    currentAcc.movements
      .filter(mov => mov > 0)
      .map(mov => (mov * currentAcc.interestRate) / 100)
      .filter((int, i, arr) => int >= 1)
      .reduce((acc, cur) => acc + cur, 0)
  )}€`;
};

//UPDATE USER INTERFACE
const updateUI = function (currentAcc) {
  renderMovements(currentAcc.movements);
  displayAccountSummary(currentAcc);
};

//REQUEST LOAN
const requestLoan = function () {
  const amount = +inputLoanAmount.value;

  if (amount > calcBalance(currentAcc) || amount <= 0) return;
  currentAcc.movements.push(amount);

  setTimeout(() => {
    updateUI(currentAcc);
  }, 500);

  clearInputs(inputLoanAmount);
};

//TRANSFER MONEY

const transferMoney = function (accs) {
  const transferTo = inputTransferTo.value;
  const amount = +inputTransferAmount.value;

  const recepient = accs.find(acc => acc.username === transferTo);

  if (!recepient || recepient === currentAccount) return;

  recepient.movements.push(amount);
  currentAccount.movements.push(-amount);

  clearInputs(inputTransferTo, inputTransferAmount);

  setTimeout(() => {
    updateUI(currentAccount);
  }, 500);
};

//CLEAR INPUT FIELDS
const clearInputs = function (...inputs) {
  inputs.map(inp => (inp.value = ''));
};

//LOGOUT
const logOut = function () {
  containerApp.style.opacity = 0;
  displayWelcomeMessage('Log in to get started');
};

//CLOSE ACCOUNT
const closeAccount = function () {
  const user = inputCloseUsername.value;
  const pin = +inputClosePin.value;

  if (currentAccount.username !== user || currentAccount.pin !== pin) return;

  const accIndex = accounts.findIndex(acc => acc.username === user);
  accounts.splice(accIndex, 1);
  logOut();
};

//LOGIN
const displayWelcomeMessage = function (msg) {
  labelWelcome.textContent = msg;
};

const validateLogin = function (accounts) {
  const user = inputLoginUsername.value;
  const pin = +inputLoginPin.value;

  currentAccount = accounts.find(
    acc => acc.username === user && acc.pin === pin
  );

  if (!currentAccount) return;

  updateUI(currentAccount);
  clearInputs(inputLoginUsername, inputLoginPin);
  displayWelcomeMessage(`Welcome, ${currentAccount.owner.split(' ')[0]}`);
};

const formatDate = function () {
  const now = new Date().toString().split(' ');
  const date = `${now.slice(0, 1)}, ${now.slice(1, 2)} 
  ${now.slice(2, 3)}, ${now.slice(3, 4)}`;

  labelDate.textContent = date;
};

const init = function () {
  createUsernames(accounts);
  displayWelcomeMessage('Log in to get started');
  formatDate();
};
init();

//EVENT LISTENERS

btnLogin.addEventListener('click', e => {
  e.preventDefault();
  validateLogin(accounts);
});

btnTransfer.addEventListener('click', e => {
  e.preventDefault();
  transferMoney(accounts);
});
btnLoan.addEventListener('click', e => {
  e.preventDefault();
  requestLoan();
});
btnClose.addEventListener('click', e => {
  e.preventDefault();
  closeAccount();
});
btnSort.addEventListener('click', e => {
  e.preventDefault();
  sortMovements();
});

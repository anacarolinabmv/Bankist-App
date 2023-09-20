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

let currentAcc;

//GENERATING USERNAMES
const createUsernames = function (accs) {
  accs.forEach(acc => {
    const owner = acc.owner.toLowerCase();
    acc.username = owner
      .split(' ')
      .reduce((acc, value) => (acc += value.at(0)), '');
  });
};

//DISPLAY BALANCES AND MOVEMENTS
const renderMovements = function (currentAcc) {
  containerApp.style.opacity = 1;
  containerMovements.innerHTML = '';

  currentAcc.movements.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `<div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__date">1 days ago</div>
          <div class="movements__value">${mov}€</div>
        </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcBalance = function (currentAcc) {
  const balance = currentAcc.movements.reduce((acc, cur) => (acc += cur));
  return balance;
};

const displayAccountSummary = function (currentAcc) {
  labelBalance.textContent = `${calcBalance(currentAcc)}€`;

  labelSumIn.textContent = `${currentAcc.movements
    .filter(mov => mov > 0)
    .reduce((acc, cur) => acc + cur, 0)}€`;

  labelSumOut.textContent = `${Math.abs(
    currentAcc.movements
      .filter(mov => mov < 0)
      .reduce((acc, cur) => acc + cur, 0)
  )}€`;

  labelSumInterest.textContent = `${currentAcc.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * currentAcc.interestRate) / 100)
    .filter((int, i, arr) => int >= 1)
    .reduce((acc, cur) => acc + cur, 0)}€`;
};

//UPDATE USER INTERFACE
const updateUI = function (currentAcc) {
  renderMovements(currentAcc);
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

  if (!recepient || recepient === currentAcc) return;

  recepient.movements.push(amount);
  currentAcc.movements.push(-amount);

  clearInputs(inputTransferTo, inputTransferAmount);

  setTimeout(() => {
    updateUI(currentAcc);
  }, 500);
};

//CLEAR INPUT FIELDS
const clearInputs = function (...inputs) {
  inputs.map(inp => (inp.value = ''));
};

//LOGIN

const displayWelcomeMessage = function (msg) {
  labelWelcome.textContent = msg;
};

const validateLogin = function (accs) {
  const user = inputLoginUsername.value;
  const password = +inputLoginPin.value;

  currentAcc = accs.find(acc => acc.username === user && acc.pin === password);

  if (!currentAcc) return;

  updateUI(currentAcc);
  clearInputs(inputLoginUsername, inputLoginPin);
  displayWelcomeMessage(`Welcome, ${currentAcc.owner.split(' ')[0]}`);
};

const init = function () {
  createUsernames(accounts);
  displayWelcomeMessage('Log in to get started');
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

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

//GENERATING USERNAMES

let currentAcc;

const createUsernames = function (accs) {
  accs.forEach(acc => {
    const owner = acc.owner.toLowerCase();
    acc.username = owner
      .split(' ')
      .reduce((acc, value) => (acc += value.at(0)), '');
  });
};

//DISPLAY BALANCES AND MOVEMENTS
const renderMovements = function (currentAccount) {
  containerApp.style.opacity = 1;
  containerMovements.innerHTML = '';

  currentAccount.movements.forEach((mov, i) => {
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

const displayCurrentBalance = function (currentAccount) {
  labelBalance.textContent = `${currentAccount.movements.reduce(
    (acc, cur) => (acc += cur)
  )}€`;
};

const displayAccountSummary = function (currentAccount) {
  labelSumIn.textContent = `${currentAccount.movements
    .filter(mov => mov > 0)
    .reduce((acc, cur) => acc + cur, 0)}€`;

  labelSumOut.textContent = `${Math.abs(
    currentAccount.movements
      .filter(mov => mov < 0)
      .reduce((acc, cur) => acc + cur, 0)
  )}€`;

  labelSumInterest.textContent = `${currentAccount.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * currentAccount.interestRate) / 100)
    .filter((int, i, arr) => int >= 1)
    .reduce((acc, cur) => acc + cur, 0)}€`;
};

//UPDATE USER INTERFACE
const updateUI = function (currentAccount) {
  renderMovements(currentAccount);
  displayCurrentBalance(currentAccount);
  displayAccountSummary(currentAccount);
};

//TRANSFER MONEY

const transferMoney = function (accs) {
  const transferTo = inputTransferTo.value;
  const amount = +inputTransferAmount.value;

  const recepient = accs.find(acc => acc.username === transferTo);

  if (!recepient || recepient === currentAcc) return;

  recepient.movements.push(amount);
  currentAcc.movements.push(-amount);

  setTimeout(() => {
    updateUI(currentAcc);
  }, 500);
};

//LOGIN
const clearLoginInputs = function () {
  inputLoginUsername.value = '';
  inputLoginPin.value = '';
};

const displayWelcomenMessage = function (msg) {
  labelWelcome.textContent = msg;
};

const validateLogin = function (accs) {
  const user = inputLoginUsername.value;
  const password = +inputLoginPin.value;

  const userAccount = accs.find(
    acc => acc.username === user && acc.pin === password
  );

  if (!userAccount) return;

  currentAcc = userAccount;
  updateUI(userAccount);
  clearLoginInputs();
  displayWelcomenMessage(`Welcome, ${userAccount.owner.split(' ')[0]}`);
};

const init = function () {
  createUsernames(accounts);
  displayWelcomenMessage('Log in to get started');
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

const movements = [5000, 3400, -150, -790, -3210, -1000, 8500, -30];

const deposits = movements
  .filter(mov => mov > 0)
  .map(depEur => depEur * 1.2)
  .reduce((acc, cur) => acc + cur, 0);

console.log(deposits);

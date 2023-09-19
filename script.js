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

const createUsernames = function (accs) {
  accs.forEach(acc => {
    const owner = acc.owner.toLowerCase();
    acc.username = owner
      .split(' ')
      .reduce((acc, value) => (acc += value.at(0)), '');
  });
};

const displayMovements = function (userAccount) {
  containerApp.style.opacity = 1;
  containerMovements.innerHTML = '';

  userAccount.movements.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `<div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__date">1 days ago</div>
          <div class="movements__value">${mov}</div>
        </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const displayCurrentBalance = function (userAccount) {
  labelBalance.textContent = userAccount.movements.reduce(
    (acc, cur) => (acc += cur)
  );
};

const displayAccountSummary = function (userAccount) {
  labelSumIn.textContent = userAccount.movements
    .filter(mov => mov > 0)
    .reduce((acc, cur) => (acc += cur));

  labelSumOut.textContent = userAccount.movements
    .filter(mov => mov < 0)
    .reduce((acc, cur) => (acc += cur));

  labelSumInterest.textContent = userAccount.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * userAccount.interestRate) / 100)
    .reduce((acc, cur) => (acc += cur));
};

const updateUI = function (userAccount) {
  displayMovements(userAccount);
  displayCurrentBalance(userAccount);
  displayAccountSummary(userAccount);
};

const clearLoginInputs = function () {
  inputLoginUsername.value = '';
  inputLoginPin.value = '';
};

const validateLogin = function (accs) {
  const user = inputLoginUsername.value;
  const password = +inputLoginPin.value;

  const userAccount = accs.find(
    acc => acc.username === user && acc.pin === password
  );

  updateUI(userAccount);
  clearLoginInputs();
};

const init = function () {
  createUsernames(accounts);
};
init();

//EVENT LISTENERS

btnLogin.addEventListener('click', e => {
  e.preventDefault();
  validateLogin(accounts);
});

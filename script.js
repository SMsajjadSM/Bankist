'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

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
const local = navigator.language;

const now = new Date();
const option = {
  hour: 'numeric',
  minute: 'numeric',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  weekday: 'long',
};
labelDate.textContent = new Intl.DateTimeFormat(local, option).format(now);
const formatingmovments = function (MOV, currency, local) {
  return new Intl.NumberFormat(local, {
    style: 'currency',
    currency: currency,
  }).format(MOV);
};

const formatmovmentsdate = date => {
  {
    const calcDayspassed = (date1, date2) =>
      Math.round(Math.abs(date1 - date2) / (1000 * 60 * 24 * 60));
    const dayspass = calcDayspassed(new Date(), date);
    if (dayspass === 0) return 'Today';
    if (dayspass === 1) return 'Yesterday';
    if (dayspass <= 7) return `${dayspass} days ago`;
    return new Intl.DateTimeFormat(local).format(date);
  }
};
const displayMovments = (acc, sorted = false) => {
  let movs = sorted
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  containerMovements.innerHTML = '';
  movs.forEach((MOV, INDEX) => {
    const date = new Date(acc.movementsDates[INDEX]);
    const displayDate = formatmovmentsdate(date, local);
    const type = MOV > 0 ? 'deposit' : 'withdrawal';

    const html = ` <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      INDEX + 1
    } ${type}</div>
    
          <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${formatingmovments(
            MOV,
            currentAccount.currency,
            currentAccount.locale
          )}</div>
        </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const creatUserName = acc => {
  acc.forEach(acc => {
    acc.userName = acc.owner
      .toLowerCase()
      .split(' ')
      .map(userName => userName[0])
      .join('');
  });
};
creatUserName(accounts);

const calcPrintBalanc = acc => {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${formatingmovments(
    acc.balance,
    currentAccount.currency,
    currentAccount.locale
  )}`;

  const SumEur = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${formatingmovments(
    SumEur,
    currentAccount.currency,
    currentAccount.locale
  )}`;

  const outEur = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${formatingmovments(
    Math.abs(outEur),
    currentAccount.currency,
    currentAccount.locale
  )}`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * acc.interestRate) / 100)
    .filter(mov => mov >= 1)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = `${formatingmovments(
    interest,
    currentAccount.currency,
    currentAccount.locale
  )}`;
};
const settimeLogin = function () {
  const tick = () => {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;
    if (time === 0) {
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
      clearInterval(timer);
    }
    time--;
  };
  let time = 300;
  tick();
  timer = setInterval(tick, 1000);
  return timer;
};
let currentAccount, timer;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.userName === inputLoginUsername.value
  );

  if (currentAccount?.pin === +inputLoginPin.value) {
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    labelWelcome.textContent = `Welcom Back ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    displayMovments(currentAccount);
    calcPrintBalanc(currentAccount);
    if (timer) clearInterval(timer);
    timer = settimeLogin();
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const accountToTransfer = accounts.find(
    acc => acc.userName === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';
  if (
    amount > 0 &&
    amount <= currentAccount.balance &&
    accountToTransfer &&
    accountToTransfer?.userName !== currentAccount.userName
  ) {
    currentAccount.movements.push(-amount);
    accountToTransfer.movements.push(amount);

    currentAccount.movementsDates.push(new Date().toISOString());
    accountToTransfer.movementsDates.push(new Date().toISOString());
    calcPrintBalanc(currentAccount);
    displayMovments(currentAccount);
    clearInterval(timer);
    timer = settimeLogin();
  }
});
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  let amount = Math.floor(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(() => {
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date().toISOString());
      calcPrintBalanc(currentAccount);
      displayMovments(currentAccount);
    }, 2500);
  }
  inputLoanAmount.value = '';
  clearInterval(timer);
  timer = settimeLogin();
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.userName &&
    +inputClosePin.value === currentAccount.pin
  ) {
    inputClosePin.value = inputCloseUsername.value = '';
    let indexOfDel = accounts.findIndex(
      acc => acc.userName === currentAccount.userName
    );
    accounts.splice(indexOfDel, 1);
    containerApp.style.opacity = 0;
  }
});
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  displayMovments(currentAccount, !sorted);
  sorted = !sorted;
  // clearInterval(timer);
  // timer = settimeLogin();
});

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

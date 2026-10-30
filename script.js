(() => {
  const display = document.getElementById('display');
  const keys = document.querySelector('.keys');

  const state = {
    displayValue: '0',
    firstValue: null,
    operator: null,
    waitingForSecond: false
  };

  function updateDisplay(){
    display.textContent = state.displayValue;
  }

  function inputDigit(digit){
    if(state.waitingForSecond){
      state.displayValue = digit;
      state.waitingForSecond = false;
    } else {
      state.displayValue = state.displayValue === '0' ? digit : state.displayValue + digit;
    }
  }

  function inputDecimal(){
    if(state.waitingForSecond){
      state.displayValue = '0.';
      state.waitingForSecond = false;
      return;
    }
    if(!state.displayValue.includes('.')){
      state.displayValue += '.';
    }
  }

  function clearAll(){
    state.displayValue = '0';
    state.firstValue = null;
    state.operator = null;
    state.waitingForSecond = false;
  }

  function toggleSign(){
    if(state.displayValue === '0') return;
    state.displayValue = (parseFloat(state.displayValue) * -1).toString();
  }

  function percent(){
    state.displayValue = (parseFloat(state.displayValue) / 100).toString();
  }

  function handleOperator(nextOp){
    const inputValue = parseFloat(state.displayValue);
    if(state.operator && state.waitingForSecond){
      state.operator = nextOp;
      return;
    }
    if(state.firstValue == null && !isNaN(inputValue)){
      state.firstValue = inputValue;
    } else if(state.operator){
      const result = performCalculation(state.operator, state.firstValue, inputValue);
      state.displayValue = String(result);
      state.firstValue = result;
    }
    state.waitingForSecond = true;
    state.operator = nextOp;
  }

  function performCalculation(operator, a, b){
    switch(operator){
      case 'add': return a + b;
      case 'subtract': return a - b;
      case 'multiply': return a * b;
      case 'divide': return b === 0 ? 'Error' : a / b;
    }
    return b;
  }

  keys.addEventListener('click', (e) => {
    const target = e.target;
    if(!target.closest('.key')) return;

    if(target.dataset.number !== undefined){
      if(target.dataset.number === '.') inputDecimal();
      else inputDigit(target.dataset.number);
      updateDisplay();
      return;
    }

    const action = target.dataset.action;
    if(!action) return;
    switch(action){
      case 'clear': clearAll(); break;
      case 'plus-minus': toggleSign(); break;
      case 'percent': percent(); break;
      case 'add': case 'subtract': case 'multiply': case 'divide':
        handleOperator(action); break;
      case 'equals':
        if(state.operator){
          handleOperator(state.operator);
          state.operator = null;
          state.firstValue = null;
          state.waitingForSecond = false;
        }
        break;
    }
    updateDisplay();
  });

  // initialize
  updateDisplay();
})();

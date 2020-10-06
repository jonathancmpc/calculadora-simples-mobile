import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Button from './src/components/Button';
import Display from './src/components/Display';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

const App = () => {
  const [displayValue, setDisplayValue] = useState('0');
  const [clearDisplay, setClearDisplay] = useState(false);
  const [operation, setOperation] = useState(null);
  const [values, setValues] = useState([0, 0]);
  const [current, setCurrent] = useState(0); /* Vai ser 0 ou 1, determina a posição do array do estado values onde o valor será inserido */

  const addDigit = (n) => {

    /* Limpando o display e substituindo pelo número clicado(quando o display tem apenas o dígito 0, ou quando a variável clearDisplay estiver verdadeira) */
    const clearDisplayCalculate = displayValue === '0' || clearDisplay;
    /* Ignorando o ponto caso já exista um ponto no cálculo */
    if (n === '.' && !clearDisplayCalculate && displayValue.includes('.')) {
      return
    }
    /* Setando o valor corrente */
    const currentValueCalculate = clearDisplayCalculate ? '' : displayValue;
    /* Acrescentando/concatenando um digito ao valor corrente */
    const displayValueCalculate = currentValueCalculate + n;
    /* Setando o valor do display e retornando o clearDisplay para false */
    setDisplayValue(displayValueCalculate);
    setClearDisplay(false);

    /* Se o valor digitado for diferente de ponto, convertemos em float, pegamos o valor atual no estado e inserimos no array(de values, de acordo com o valor corrente[0 , 1]) o novo valor */
    if (n !== '.') {
      const newValue = parseFloat(displayValueCalculate);
      const valuesCalculate = [...values];
      valuesCalculate[current] = newValue;
      setValues(valuesCalculate);
    }
  }

  const clearMemory = () => {
    setDisplayValue('0');
    setClearDisplay(false);
    setOperation(null);
    setValues([0, 0]);
    setCurrent(0);
  }

  const setCalculeOperation = (symbol) => {
    if (current === 0) {
      setOperation(symbol); /* Seta a operação que será feita */
      setCurrent(1); /* Seta o current para a segunda posição do array(1) */
      setClearDisplay(true); /* Marca true para apagar a partir do próximo dígito */
    }
    if (current === 1 ) {
      const equalsOperation = symbol === '=';
      const valuesCalculate = [...values];
      try {
        /* O eval, avalia os caracteres e verifica se é um calculo, e se for um calculo válido, faz o calculo, ex: 25 + 2, vai retornar 27 */
        valuesCalculate[0] = eval(`${valuesCalculate[0]} ${operation} ${valuesCalculate[1]}`);
      } catch(err) {
        valuesCalculate[0] = values[0];
      }

      valuesCalculate[1] = 0
      setDisplayValue(`${valuesCalculate[0]}`);
      setOperation(equalsOperation ? null : symbol);
      setCurrent(equalsOperation ? 0 : 1);
      setClearDisplay(true);
      setValues(valuesCalculate);
    }
  }  

  return (
    <>
      <View style={styles.container}>
        <Display value={displayValue} />
        <View style={styles.buttons}>
          <Button label="AC" triple onClick={clearMemory} />
          <Button label="/" operation onClick={setCalculeOperation} />
          <Button label="7" onClick={addDigit} />
          <Button label="8" onClick={addDigit} />
          <Button label="9" onClick={addDigit} />
          <Button label="*" operation onClick={setCalculeOperation} />
          <Button label="4" onClick={addDigit} />
          <Button label="5" onClick={addDigit} />
          <Button label="6" onClick={addDigit} />
          <Button label="-" operation onClick={setCalculeOperation} />
          <Button label="1" onClick={addDigit} />
          <Button label="2" onClick={addDigit} />
          <Button label="3" onClick={addDigit} />
          <Button label="+" operation onClick={setCalculeOperation} />
          <Button label="0" double onClick={addDigit} />
          <Button label="." onClick={addDigit} />
          <Button label="=" operation onClick={setCalculeOperation} />
        </View>
      </View>
    </>
  );
};

export default App;

import { Button, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import Number from './Number';

var _ = require('lodash');


export default Game = ({ randomNumbersCount, initialSeconds }) => {
    //const target = 10 + Math.floor(40 * Math.random());
    const [randomNumbers, setRandomNumbers] = useState([]);
    const [selectedNumbers, setSelectedNumbers] = useState([]);
    const [target, setTarget] = useState();
    const [remainingSeconds, setRemainingSeconds] = useState(initialSeconds)
    const [ gameStatus, setGameStatus] = useState('PLAYING');
    const [ playAgain, setPlayAgain] = useState(0)
    
    const intervalId = useRef();
    
    function shuffle(array) {
        array.sort(() => Math.random() - 0.5);
      }
    
    useEffect(()=> console.log(selectedNumbers), [selectedNumbers])
    
   //Sin Array -> Se ejecuta todo el tiempo
   //Array vacio -> Ejecuta solo una vez al inicio
   // Array con datos -> Se ejecuta cuando cambia
   // Return -> Se ejecuta cuando se desmonta
    useEffect(() => {
        let numbers = Array.from({ length: randomNumbersCount }).map(() => 1 + Math.floor(10 * Math.random()));
        const target = numbers.slice(0,randomNumbersCount -2).reduce((acc, cur) => acc + cur, 0);
        
        setRandomNumbers(_.shuffle(numbers));
        setTarget(target);
       
        intervalId.current = setInterval(()=> setRemainingSeconds(seconds => seconds - 1), 1000);
        return () => clearInterval(intervalId.current);//Simulacion de componenwillunmount
        
    }, [playAgain]);//Primer parametro un arrow function y el segundo un parametro de control
   
    useEffect(()=> {
        setGameStatus(()=> getGameStatus());
        if (remainingSeconds === 0 || gameStatus !== 'PLAYING') {
            clearInterval(intervalId.current)
        }
    }, [remainingSeconds, selectedNumbers]);
    
    const isNumberSelected = (numberIndex) => selectedNumbers.some(number => number === numberIndex);
    
    const selectNumber = number => setSelectedNumbers([...selectedNumbers,number]);
    
    const getGameStatus = () => {
        const sumSelected = selectedNumbers.reduce((acc,cur) => acc + randomNumbers[cur], 0);
        if (remainingSeconds === 0 || sumSelected > target ) {
            return 'LOST'
        } else if (sumSelected === target) {        
               return 'WON'
        } else {
            return 'PLAYING'
        }
    };
    
   const reloadGame = () => {
        setRemainingSeconds(initialSeconds)
        setGameStatus('PLAYING')
        setSelectedNumbers([])
        setPlayAgain( cnt => cnt + 1)  
   }
    
    const PlayAgainButton = () => {
        if(gameStatus !== 'PLAYING'){
            return <Button 
                        title="Play Again" 
                        onPress={() => {reloadGame()} }
                        color = 'green'
                    />
        } else {
            return null
        }
    }
    
    //const status = gameStatus();
    
    return (
        <View>
            <Text style={styles.target}>{target}</Text>
            <Text style={[styles.target,styles[gameStatus]]}>{gameStatus}</Text>
            <Text>{remainingSeconds}</Text>
            
            <View style={styles.randomContainer}>
                {   
                    randomNumbers.map((number, index) => (
                                                <Number key={index} 
                                                id={index} number={number} 
                                                isSelected={isNumberSelected(index) || gameStatus != 'PLAYING'} 
                                                onSelected={selectNumber}/>
                                                )
                            )
                }
                
            </View>
            <View style={styles.buttonContainer}>
                <PlayAgainButton style={styles.button}/>
            </View>
        </View>
        
    );
};


const styles = StyleSheet.create({
    target: {
      fontSize: 40,
      backgroundColor: '#aaa',
      textAlign: 'center',
    },
    
    randomContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    
    buttonContainer: {
       marginTop: 350
    },
    
    PLAYING: {
        backgroundColor: '#bbb'
    },
    LOST: {
        backgroundColor: 'red'
    },
    WON: {
        backgroundColor: 'green'
    },
  });
  
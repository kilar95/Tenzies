import React from 'react'
import Die from './Die.js'
import { nanoid } from 'nanoid'
import Confetti from 'react-confetti'

export default function App() {
    const [numbers, setNumbers] = React.useState(newRoll())
    const [tenzies, setTenzies] = React.useState(false)
    const [numberOfRolls, setNumberOfRolls] = React.useState(0)
    let interval;


    const [time, setTime] = React.useState(0)
    const [start, setStart] = React.useState(true)


    //timer 
    React.useEffect(() => {
        if (start) {
            interval = setInterval(() => {
                setTime(prevTime => prevTime + 1)
            }, 1000)
        }

        return () => {
            clearInterval(interval);
        }
    }, [start])


    // local storage arrays
    const [rollsRecord, setRollsRecord] = React.useState(
        () => JSON.parse(localStorage.getItem("rollsRecord")) || 0
    )
    const [timeRecord, setTimeRecord] = React.useState(
        () => JSON.parse(localStorage.getItem("timeRecord")) || 0
    )


    React.useEffect(() => {
        localStorage.setItem("timeRecord", JSON.stringify(timeRecord))
    }, [timeRecord])

    React.useEffect(() => {
        localStorage.setItem("rollsRecord", JSON.stringify(rollsRecord))
    }, [rollsRecord])


    React.useEffect(() => {
        const heldDices = numbers.every(number => number.isHeld) /* it returns a boolean, if all dices are held it returns true */
        const firstValue = numbers[0].value;
        const allSameValue = numbers.every(number => number.value === firstValue)

        if (heldDices && allSameValue) {
            setTenzies(true)
            setStart(false);

            setRecords();
        }

    }, [numbers])

    function setRecords() {
        console.log(rollsRecord)
        console.log(timeRecord)
        if (!rollsRecord || numberOfRolls < rollsRecord) {
            setRollsRecord(numberOfRolls)
            console.log(numberOfRolls)
        }

        if (!timeRecord || time < timeRecord) {
            setTimeRecord(time)
            console.log(time)
        }

    }

    function generateNewNumber() {
        const randomNum = Math.floor(Math.random() * 6) + 1

        return {
            value: randomNum,
            isHeld: false,
            id: nanoid()
        }
    }

    function newRoll() {
        const arr = []
        for (let i = 0; i < 10; i++) {
            arr.push(generateNewNumber())
        }

        return arr;
    }


    const diceElements = numbers.map(numObj =>
        <Die
            key={numObj.id}
            isHeld={numObj.isHeld}
            value={numObj.value}
            holdDice={holdDice}
            id={numObj.id}
        />
    )

    function rollDice() {
        setNumbers(prevNumbers => prevNumbers.map(prevNumber => {
            return prevNumber.isHeld ?
                prevNumber :
                generateNewNumber()
        }));

        updateRolls();
    }

    function updateRolls() {
        if (!tenzies) {
            return setNumberOfRolls(prevNumber => prevNumber + 1)
        }
    }

    function holdDice(id) {
        setNumbers(prevNumbers => prevNumbers.map(prevNumber => {
            return prevNumber.id === id ?
                { ...prevNumber, isHeld: !prevNumber.isHeld } :
                prevNumber
        }))
    }

    function clearState() {
        setTenzies(false)
        setNumbers(newRoll());
        setNumberOfRolls(0)
        setStart(true);
        setTime(0);
    }


    return (
        <div className='main'>
            {tenzies && <Confetti className='confetti' />}
            <div className='main--descr'>
                <h1>{tenzies ? "You won!" : "Tenzies"}</h1>
                <p>{
                    tenzies ?
                        "" :
                        "Roll until all dice are the same. Click each die to freeze it at its current value between rolls."
                }</p>

                {tenzies &&
                    (<div className='results'>
                    <p>Rolls: {numberOfRolls}</p>
                    <p>Time: {time}</p>
                    <p><strong>Best score: {rollsRecord}</strong></p>
                    <p><strong>Best time: {timeRecord}</strong></p>
                    </div> )
                }

            </div>

            <div className='dices'>
                {diceElements}
            </div>

            <button className='button' onClick={tenzies ? clearState : rollDice}>{tenzies ? "New Game" : "Roll"}</button>
        </div>

    )
}
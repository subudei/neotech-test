import React, { useEffect, useState } from "react";

const DataFetching = () => {
  const [isOn, setIsOn] = useState(true);
  const [timer, setTimer] = useState();
  const [avgAge, setAvgAge] = useState(null);
  const [running, setRunning] = useState(true);
  const [restart, setRestart] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(10);
  const apiAddress = "https://randomuser.me/api/?results=10";
  const fetchTenRandomUsers = async () => {
    try {
      const response = await fetch(apiAddress);
      const db = await response.json();
      const usersData = await db.results;
      const ageCalc =
        (await usersData
          .map((user) => user.dob.age)
          .reduce((prev, curr) => prev + curr)) / usersData.length;
      setAvgAge(ageCalc);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    let interval = null;
    if (isOn) {
      setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isOn]);

  console.log(avgAge);
  useEffect(() => {
    if (running) {
      const interval10 = window.setInterval(() => {
        fetchTenRandomUsers();
        setTimeRemaining(10);
      }, 10000);
      return () => window.clearInterval(interval10);
    }
  }, [running]);

  useEffect(() => {
    if (restart)
      setTimeout(() => {
        fetchTenRandomUsers();
        setRunning(true);
        setRestart(!restart);
        setTimeRemaining(10);
      }, timer);
    return () => clearTimeout();
  }, [restart, timer]);

  return (
    <div>
      {timeRemaining}
      <h2>Average Age after 10 sec :</h2>
      <h1>{avgAge}</h1>
      {!avgAge ? null : running ? (
        <button
          onClick={() => {
            setRunning(false);
            setTimer(timeRemaining * 1000);
            setIsOn(false);
          }}
        >
          STOP
        </button>
      ) : (
        <button
          onClick={() => {
            setRestart(!restart);
          }}
        >
          Restart
        </button>
      )}
    </div>
  );
};

export default DataFetching;

// Koriste??i ???randomuser.me??? API napraviti aplikaciju koja ra??una prose??an broj godina za dobijene korisnike.
// Aplikacija treba da na svakih 10 sekundi dohvati 10 korisnika koriste??i ???GET https://randomuser.me/api/?results=10??? endpoint.
// Koriste??i dobijene podatke, potrebno je da izra??una prose??an broj godina dobijenih korisnika i prika??e na stranici.
// Kada pro??e 10 sekundi ceo proces se ponavlja.
// Tako??e na stranici treba da postoji i dugme kojim se stopira aplikacija.
// Kada se klikne to dugme aplikacija treba da se ???zamrzne???, tj. da prekine sa ra??unanjem prose??nog broja godina.
// Ponovnim klikom na to dugme aplikacija nastavlja sa radom.
// Slede??u kalkulaciju prose??nog broja godina ??e izvr??iti nakon preostalog vremena koje je ostalo pre zaustavljanja aplikacije.
// Za izradu aplikacije koristiti React 16.8+, React Hooks, po??eljno bi bilo i da je napisano u TypeScript.

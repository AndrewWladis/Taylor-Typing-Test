"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import lyrics from './lyrics.json';
import localFont from 'next/font/local'

const loverFont = localFont({ src: '../../public/lover.ttf' })

export default function Home() {
  const [songs, setSongs] = useState([]);
  const [time, setTime] = useState(15);
  const [countdown, setCountdown] = useState(15);
  const [song, setSong] = useState("Tim McGraw");
  const [songLyrics, setSongLyrics] = useState("");
  const [wordsTyped, setWordsTyped] = useState(0);
  const [accuracy, setAccuracy] = useState(0)
  const [charactersTyped, setCharactersTyped] = useState(0);

  const handleInterval = () => {
    setCountdown((prevTime) => prevTime - 1);
  };

  useEffect(() => {
    const newLyrics = lyrics.map((line) => {
      return line.title;
    });
    setSongs(newLyrics);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (countdown === time) {
        setCountdown(time - 1);
        if (event.key === songLyrics[charactersTyped]) {
          if (event.key === " ") {
            setWordsTyped((i) => i + 1);
          }
          setAccuracy((prevAccuracy) => prevAccuracy + 1);
          setCharactersTyped((i) => i + 1);
        } else {
          setCharactersTyped((i) => i + 1);
        }
      } else if (countdown > 0 && countdown < time) {
        if (event.key === songLyrics[charactersTyped]) {
          if (event.key === " ") {
            setWordsTyped((i) => i + 1);
          }
          setAccuracy((prevAccuracy) => prevAccuracy + 1);
          setCharactersTyped((i) => i + 1);
        } else {
          setCharactersTyped((i) => i + 1);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Cleanup function
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [countdown, charactersTyped, songLyrics, accuracy]); // Add dependencies for useEffect


  useEffect(() => {
    const newLyrics = lyrics.find((item) => item.title === song);
    setSongLyrics(newLyrics.lyrics.toLowerCase());
  }, [song]);

  useEffect(() => {
    let intervalId;

    if (countdown < time && countdown > 0) {
      intervalId = setInterval(handleInterval, 1000); // Call every 1000ms or 1 second
    }

    if (countdown === 0) {
      console.log(wordsTyped, time)
    }
    // Cleanup function to clear the interval when the component unmounts or state changes
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [countdown]);

  return (
    <main className="flex min-h-screen w-full flex-col items-center bg-gradient-to-br from-pink-300 to-blue-400">
      <h1 className={`${loverFont.className} text-white p-10 text-3xl`}>Taylor Typing Test</h1>
      <div className="w-full flex flex-row justify-evenly items-center m-4">
        <div className="flex flex-col items-center">
          <label className="text-white font-semibold text-l m-2">Select Time</label>
          <select
            value={time}
            className="py-2 rounded-md bg-transparent border-2 border-white text-white text-xl shadow-slate-300 drop-shadow-sm w-min"
            onChange={(e) => {
              if (time > 14) {
                setTime(Number(e.target.value));
              }
            }}
          >
            <option value="15">15</option>
            <option value="30">30</option>
            <option value="45">45</option>
            <option value="60">60</option>
          </select>
        </div>
        <div className="flex flex-col items-center">
          <label className="text-white font-semibold text-2xl m-2">Song</label>
          <select
            value={song}
            className="py-2 br-2 rounded-md bg-transparent border-2 border-white text-white text-xl shadow-slate-300 drop-shadow-sm"
            onChange={(e) => {
              setSong(e.target.value);
            }}
          >
            {songs.map((song, index) => {
              return <option value={song} key={index}>{song}</option>;
            })}
          </select>
        </div>
        <div className="flex flex-col items-center">
          <h5 className="p-1 text-pink-100 font-bold">Time</h5>
          <div className="flex flex-col items-center rounded-md bg-transparent border-2 border-white text-white text-xl shadow-slate-300 drop-shadow-sm">
            <p className="p-1 text-3xl text-pink-100 font-extrabold">{countdown}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center rounded-md bg-transparent border-2 border-white text-white text-xl shadow-slate-300 drop-shadow-sm">
        <p className="text-white text-2xl m-2 font-medium">{songLyrics.substring(charactersTyped, charactersTyped + 80)}</p>
      </div>
      {countdown === 0 ? (
        <div className="flex flex-col items-center">
          <p className="text-white text-2xl m-2 font-medium mx-2">WPM: {(Number(wordsTyped) / (Number(time) / 60))}</p>
          <p className="text-white text-2xl m-2 font-medium mx-2">Accuracy: {Math.round((Number(accuracy) / (Number(charactersTyped)) * 100))}%</p>
        </div>
      ) : null}
    </main>
  );
}

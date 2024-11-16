import React, { useEffect, useState } from 'react';
import * as THREE from 'three';

const Music = ({ camera }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bgMusic, setBgMusic] = useState(null);

  useEffect(() => {
    const listener = new THREE.AudioListener();
    camera.add(listener);

    const audio = new THREE.Audio(listener);
    const audioLoader = new THREE.AudioLoader();

    // Loading the audio buffer
    audioLoader.load('../assets/knull.mp3', (buffer) => {
      // Set the audio buffer once it's loaded
      audio.setBuffer(buffer);
      audio.setLoop(true);
      audio.setVolume(0.1);
      setBgMusic(audio);  // Now that audio is ready, set bgMusic
    }, undefined, (error) => {
      console.error('Error loading audio:', error);
    });

    return () => {
      if (bgMusic) {
        bgMusic.stop();
      }
    };
  }, [camera]);  // Runs when the camera changes, ensuring the audio listener is added correctly

  const handlePlayClick = () => {
    if (bgMusic) {
      if (!isPlaying) {
        // Check if the audio context is already resumed, if not, resume it
        if (bgMusic.context.state === 'suspended') {
          bgMusic.context.resume().then(() => {
            bgMusic.play();
            setIsPlaying(true);
          }).catch((error) => {
            console.error('Error resuming AudioContext:', error);
          });
        } else {
          bgMusic.play();
          setIsPlaying(true);
        }
      } else {
        bgMusic.stop();
        setIsPlaying(false);
      }
    }
  };

  return (
    <div>
      <button
        onClick={handlePlayClick}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          zIndex: '1000',
        }}
      >
        {isPlaying ? 'Stop Music' : 'Play Music'}
      </button>
    </div>
  );
};

export default Music;

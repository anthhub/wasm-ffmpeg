import React, { useState, useEffect, useRef } from 'react';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import './App.css';


function App() {
  const [audioSrc, setAudioSrc] = useState('');
  const [message, setMessage] = useState('Click Start to transcode');
  const ffmpegRef = useRef(createFFmpeg({
    // log: true,
  }))
  const ffmpeg = ffmpegRef.current

  useEffect(() => {
    ffmpeg.load();
  }, [ffmpeg])


  const run = async () => {
    console.log('run >>>>>>>>>>>>>>>>>>')

    const input = 'song.mp3'
    const output = 'ffmpeg_done.mp3'
    const start = '0:01:00.00'
    const end = '0:02:03.04'

    ffmpeg.FS('writeFile', input, await fetchFile(`/${input}`));
    const cmd = `-i ${input} -vn -y -ss ${start} -to ${end} ${output}`.split(' ')
    await ffmpeg.run(...cmd);

    return ffmpeg.FS('readFile', output);
  }


  const doTranscode = async () => {
    setMessage('Loading ffmpeg-core.js');
    if (!ffmpeg.isLoaded()) {
      await ffmpeg.load();
    }
    setMessage('Start transcoding');

    const length = 1
    console.time('Transcode Start >>>>>>>>>>>>>>>>>>')
    const arr = Array.from({ length }).map(run)
    const dataset = await Promise.all(arr)
    const data = dataset[0]
    console.timeEnd('Transcode Start >>>>>>>>>>>>>>>>>>')


    setMessage('Complete transcoding');
    setAudioSrc(URL.createObjectURL(new Blob([data.buffer], { type: 'audio/mp3' })));
  };

  return (
    <div className="App">
      <br />
      <img
        className="spin"
        src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9Ii0xMS41IC0xMC4yMzE3NCAyMyAyMC40NjM0OCI+CiAgPHRpdGxlPlJlYWN0IExvZ288L3RpdGxlPgogIDxjaXJjbGUgY3g9IjAiIGN5PSIwIiByPSIyLjA1IiBmaWxsPSIjNjFkYWZiIi8+CiAgPGcgc3Ryb2tlPSIjNjFkYWZiIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIi8+CiAgICA8ZWxsaXBzZSByeD0iMTEiIHJ5PSI0LjIiIHRyYW5zZm9ybT0icm90YXRlKDYwKSIvPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIiB0cmFuc2Zvcm09InJvdGF0ZSgxMjApIi8+CiAgPC9nPgo8L3N2Zz4K"
        alt=""
        height="210"
      />
      <p />
      <audio src={audioSrc} controls></audio>
      <br />
      <button onClick={doTranscode}>Start</button>
      <p>{message}</p>
    </div>
  );
}

export default App;

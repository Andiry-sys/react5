import './App.css';
import React, { useState, useEffect, useRef } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  NavLink,
} from 'react-router-dom';
import Remarkable from 'remarkable';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<NavMenu />} />
          <Route path="time" element={<Time />} />
          <Route path={'/timer'} element={<Timer />} />
          <Route path={'/markdown'} element={<MarkdownEditor />} />
        </Routes>
      </Router>
    </>
  );
}

function NavMenu() {
  return (
    <div className="navMenu">
      <NavLink to="/time" className={setActive}>
        Time
      </NavLink>
      <NavLink to="/timer" className={setActive}>
        Timer
      </NavLink>
      <NavLink to="/markdown" className={setActive}>
        Markdown
      </NavLink>
    </div>
  );
}

const setActive = ({ isActive }) => (isActive ? 'active' : '');

class Time extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      time: new Date().toLocaleTimeString(),
    };
  }

  componentDidMount() {
    this.timerID = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      time: new Date().toLocaleTimeString(),
    });
  }

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <h2>It is {this.state.time}.</h2>
      </div>
    );
  }
}

const STATUS = {
  STARTED: 'Started',
  STOPPED: 'Stopped',
};

function Timer() {
  const [second, setSecond] = useState(0);

  const [secondsRemaining, setSecondsRemaining] = useState(second);
  const [status, setStatus] = useState(STATUS.STOPPED);

  const secondsToDisplay = secondsRemaining % 60;
  const minutesRemaining = (secondsRemaining - secondsToDisplay) / 60;
  const minutesToDisplay = minutesRemaining % 60;
  const hoursToDisplay = (minutesRemaining - minutesToDisplay) / 60;

  const handleStart = () => {
    setStatus(STATUS.STARTED);
    setSecondsRemaining(second);
  };
  const handleStop = () => {
    setStatus(STATUS.STOPPED);
  };
  const handleReset = () => {
    setStatus(STATUS.STOPPED);
    setSecondsRemaining(second);
  };
  useInterval(
    () => {
      if (secondsRemaining > 0) {
        setSecondsRemaining(secondsRemaining - 1);
      } else {
        setStatus(STATUS.STOPPED);
      }
    },
    status === STATUS.STARTED ? 1000 : null
  );

  const handlerChangeSecond = (e) => {
    setSecond(e.target.value);
  };

  return (
    <div className="App">
      <div>
        <input
          type={'number'}
          value={second}
          onChange={handlerChangeSecond}
          placeholder="Enter second"
          required
        />
      </div>
      <br />
      <button onClick={handleStart} type="button">
        Start
      </button>
      <button onClick={handleStop} type="button">
        Stop
      </button>
      <button onClick={handleReset} type="button">
        Reset
      </button>
      <div style={{ padding: 20 }}>
        {twoDigits(hoursToDisplay)}:{twoDigits(minutesToDisplay)}:
        {twoDigits(secondsToDisplay)}
      </div>
      <div>Status: {status}</div>
    </div>
  );
}

function useInterval(callback, delay) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

const twoDigits = (num) => String(num).padStart(2, '0');

class MarkdownEditor extends React.Component {
  constructor(props) {
    super(props);
    this.md = new Remarkable();
    this.handleChange = this.handleChange.bind(this);
    this.state = { value: 'Привіт, **світе**!' };
  }

  handleChange(e) {
    this.setState({ value: e.target.value });
  }

  getRawMarkup() {
    return { __html: this.md.render(this.state.value) };
  }

  render() {
    return (
      <div className="MarkdownEditor">
        <label htmlFor="markdown-content">Введіть що-небудь</label>
        <br />
        <textarea
          id="markdown-content"
          onChange={this.handleChange}
          defaultValue={this.state.value}
        />
        <h3>Вивід</h3>
        <div
          className="content"
          dangerouslySetInnerHTML={this.getRawMarkup()}
        />
      </div>
    );
  }
}

export default App;

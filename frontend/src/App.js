
import './App.css';
import { BrowserRouter, Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';


import Header from './components/common/header';
import After from './components/common/after';
import Register from './components/pages/register';
import Login from './components/pages/login';
import Loader from './components/common/loader';
import Home from './components/pages/profile/home';

function App() {

  const [loader, setloader] = useState(false)

  setTimeout(() => {


    setloader(true)

  }, 1000);
  return (
    <div className="App">




      <div>
        <BrowserRouter>

          <Header />
          <After />
          <Routes>
            <Route path="/" element={loader?<Register />:<Loader /> } />
            <Route path='/login' element={<Login />} />
            <Route path='/home/:type' element={<Home />} />

            {/* <Route path='/login' element={<Login />} /> */}

          </Routes>
        </BrowserRouter>

      </div>




    </div>
  );
}


export default App;

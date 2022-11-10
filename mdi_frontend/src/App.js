
import './App.css';
import { Fragment } from 'react';
import Main from './Components/Main/main';
import BulkSearch from './Components/BulkSearch/bulk_search';
import About from './Components/About/about';
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  const [isMainPage, setMainPage] = useState(true);
  const [isBulkPage, setBulkPage] = useState(false);
  const [isAboutPage, setAboutPage] = useState(false);

  const handlePage = (type) =>{
    if (type === 'bulk'){
      setBulkPage(true);
      setMainPage(false);
      setAboutPage(false);
      toast.info("You can do bulk search too")
    } else if (type === 'about'){
      setBulkPage(false);
      setMainPage(false);
      setAboutPage(true);
      toast.info("You can find information of our web page")
    } else {
      setBulkPage(false);
      setMainPage(true);
      setAboutPage(false);
      toast.info("You can search for the medical drug details")
    }
  }

  return (
    <Fragment>
      <div className='navbar'>
        <label style={{fontSize:"20px",color:"#007d79"}} ><b>RxMisInfoCheck</b></label>
        <label className="navbar_label" onClick={() => handlePage('')}>Home</label>
        <label className="navbar_label" onClick={() => handlePage('bulk')}>Bulk Search</label>
        <label className="navbar_label" onClick={() => handlePage('about')}>About</label>
      </div>
      <br/><br/><br/><br/>
      <div style={{padding:"10px"}}>
        {
          isMainPage ? <Main/> : <span></span>
        }
        {
          isBulkPage ? <BulkSearch/> : <span></span>
        }
        {
          isAboutPage ? <About/>: <span></span>
        }
      </div>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"

        style={{zIndex:"1000000"}}
      />
      <br/><br/>

    </Fragment>
  );
}

export default App;

import './styles/output.css';
import './App.css';
import FooterComponent from './components/footer/Footer';
import { TaskProvider } from './components/context/NewsContext';
import MainBodyContentContext from './components/mainContents/MainBodyContentContext';

function App() {



  return (
    <>

      <TaskProvider>

        <MainBodyContentContext />

        <FooterComponent />

      </TaskProvider>


    </>
  )
}

export default App

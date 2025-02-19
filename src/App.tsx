import { BrowserRouter, Route, Routes, useLocation } from 'react-router'
import './App.css'
import { Footer } from './components/footer/footer'
import { Header } from './components/header/header'
import { Mail } from './pages/mail/mail'
import { NewMessage } from './pages/newMessage/newMessage'


function App() {

  return (
    <BrowserRouter>

      <HeaderComponent />
      <Routes>
        <Route path="/generalMeetingShareholders" element={<Mail />} />
        <Route path="/generalMeetingShareholders/newMessage" element={<NewMessage />} />
      </Routes>
      <Footer />

    </BrowserRouter>
  )
}

function HeaderComponent() {
  const location = useLocation();

  let headertext;
  switch (location.pathname) {
    case '/generalMeetingShareholders':
      headertext = '';
      break;
    case '/generalMeetingShareholders/newMessage':
      headertext = '/ Создать сообщение';
      break;
    default:
      headertext = '';
  }

  return (
    <Header path={headertext} />
  )
}

export default App

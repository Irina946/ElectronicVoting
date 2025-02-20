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

  const header = {text: '', path: ''};
  switch (location.pathname) {
    case '/generalMeetingShareholders':
      header.text = '';
      header.path = ''
      break;
    case '/generalMeetingShareholders/newMessage':
      header.text = 'Создать сообщение';
      header.path = '/generalMeetingShareholders/newMessage';
      break;
    default:
      header.text = '';
      header.path = '';
  }

  return (
    <Header title={header.text} path={header.path} />
  )
}

export default App

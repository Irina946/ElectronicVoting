import { BrowserRouter, Route, Routes, useLocation } from 'react-router'
import './App.css'
import { Footer } from './components/footer/footer'
import { Header } from './components/header/header'
import { Mail } from './pages/mail/mail'
import { NewMessage } from './pages/newMessage/newMessage'
import { MailShareholder } from './pages/mailShareholder/mailShareholder'
import { Message } from './pages/message/message'
import { Broadcast } from './pages/broadcast/broadcast'
import { Voting } from './pages/voting/voting'


function App() {

  return (
    <BrowserRouter>

      <HeaderComponent />
      <Routes>
        <Route path="/generalMeetingShareholders" element={<Mail />} />
        <Route path="/generalMeetingShareholders/newMessage" element={<NewMessage />} />
        <Route path="/mailShareholder" element={<MailShareholder />} />
        <Route path="/mailShareholder/message" element={<Message />} />
        <Route path="/mailShareholder/broadcast" element={<Broadcast />} />
        <Route path="/mailShareholder/voting" element={<Voting />} />
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
    case '/mailShareholder/message':
      header.text = 'Сообщение';
      header.path = '/mailShareholder/message';
      break;
      case '/mailShareholder/voting':
      header.text = 'Голосование';
      header.path = '/mailShareholder/voting';
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

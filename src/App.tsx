import { BrowserRouter, Route, Routes } from 'react-router';
import './App.css';
import { Mail } from './pages/admin/mail/mail';
import { MessagePageAdmin } from './pages/admin/messagePageAdmin/messagePageAdmin';
import { NewMessage } from './pages/admin/newMessage/newMessage';
import { MailShareholder } from './pages/user/mailShareholder/mailShareholder';
import { Message } from './pages/user/message/message';
import { Broadcast } from './pages/user/broadcast/broadcast';
import { Voting } from './pages/user/voting/voting';
import { Layout } from './layout';
import { Authorization } from './pages/authorization/authorization';
import { ResultUser } from './pages/admin/resultUser/resultUser';


function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Authorization />} />
                <Route element={<Layout />}>
                    <Route path='/admin' element={<Mail />} />
                    <Route path='/admin/meeting/:meetingID' element={<MessagePageAdmin />} />
                    <Route path='/admin/meeting/:meetingID/results/:userID' element={<ResultUser />} />
                    <Route path='/admin/meeting/new' element={<NewMessage />} />
                    <Route path='/admin/meeting/:meetingID/edit' element={<NewMessage />} />
                    <Route path='/user' element={<MailShareholder />} />
                    <Route path='/user/meeting/:meetingID' element={<Message />} />
                    <Route path='/user/meeting/:meetingID/broadcast' element={<Broadcast />} />
                    <Route path='/user/meeting/:meetingID/voting/:userID' element={<Voting />} />
                </Route>

            </Routes>
        </BrowserRouter>
    );
}

export default App;
// import { useState } from 'react'
import './App.css'
import { Footer } from './components/footer/footer'
import { Header } from './components/header/header'
import { Mail } from './pages/mail/mail'
// import { Input } from './components/input/input'
// import { Select } from './components/select/select'
// import { Checkbox } from './components/checkbox/checkbox'
// import { InputDate } from './components/input/inputDate'
// import { InputTime } from './components/input/inputTime'
// import { InputFile } from './components/input/inputFile'
// import { Button } from './components/button/button'
// import { ButtonMessage } from './components/button/buttonMessage'
// import { Message } from './components/message/message'

function App() {
  // const [selectedValue, setSelectedValue] = useState('');
  // const [checked, setChecked] = useState(false);
  // const newDate = new Date();
  // const [selectedDate, setSelectedDate] = useState(newDate.toISOString().split('T')[0]);
  // const handleFilesSelected = (files: File[]) => {
  //   console.log('Selected files:', files);
  // };


  return (
    <>

      <Header path='/ Голосование' />
      {/* <div className='flex justify-center'>
        <div className='w-[1000px] bg-(--color-background) p-[38px] flex flex-col gap-[20px]'>
          <Input placeholder='Введите место' />
          <Select
            options={[{ label: 'Годовое собрание', value: 'year' }, { label: 'Внеочередное собрание', value: 'not' }]}
            placeholder='Место проведения'
            onChange={(value) => setSelectedValue(value)} />
          <p>{selectedValue}</p>
          <Checkbox checked={checked} onChange={() => setChecked(!checked)} />
          <InputDate value={selectedDate} onChange={setSelectedDate} />
          <p>{selectedDate}</p>
          <InputTime />
          <InputFile onFileSelected={handleFilesSelected} />
          <Button title='Сохранить' color='yellow' onClick={() => { }} />
          <Button title='Сохранить' color='empty' onClick={() => { }} />
          <ButtonMessage title='Сохранить' color='yellow' onClick={() => { }} isSelected={false} />
          <ButtonMessage title='Сохранить' color='empty' onClick={() => { }} isSelected={false} />
          <ButtonMessage title='Сохранить' color='empty' onClick={() => { }} isSelected={true} /> */}
      {/* </div> */}

      {/* </div> */}
      <Mail />

      <Footer />
    </>
  )
}

export default App

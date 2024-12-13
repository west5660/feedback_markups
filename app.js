import React, { useState } from 'react';
import axios from 'axios';
import razmetka_logo from './razmetka_logo.png';
import './App.css';
import Select from './Select';
import DropdownList from './Markups';

function App() {
  // const [firstSelectOptions, setFirstSelectOptions] = useState([]);
  // const [secondSelectOptions, setSecondSelectOptions] = useState([]);
  // const [selectedFirstOption, setSelectedFirstOption] = useState('');
  // const [selectedSecondOption, setSelectedSecondOption] = useState('');
  // const [selectedOption, setSelectedOption] = useState('');
  // const [inputValue, setInputValue] = useState('')
  const [projectUrl, setProjectUrl] = useState('')
  const [showNotification, setShowNotification] = useState(false); // Состояние для отображения уведомления
  const [notificationMessage, setNotificationMessage] = useState(''); // Сообщение для уведомления
  const [notificationType, setNotificationType] = useState(''); // Тип уведомления (успех или ошибка) 
  const [formData, setFormData] = useState({
    invitor: '', // Почта отправителя (например, user@example.com)
    project: '', // Название проекта
    receivers: [], // Массив почт получателей (например, ["user@example.com"])
    theme: '', // Тема (например, "ОС")
    jazz_link: '', // Ссылка на проект (например, "https://example.com/")
    start_time: '', // Время начала (например, "2024-12-13T06:26:52.612Z")
    duration: 0, // Продолжительность в минутах
    comment: '', // Комментарий
    creation_date: '', // Дата создания (например, "2024-12-11T11:46:28.683026")
    update_date: '', // Дата обновления (например, "2024-12-11T11:46:28.683034")
  });

  const SERVER_HOST = 'http://10.56.145.85:8001';



  const handleDataChange = (data) => {
    setFormData((prevData) => {
      const updatedData = { ...prevData, ...data };
      console.log('Обновленные данные formData:', updatedData); // Логируем для проверки
      return updatedData;
    });
  };
  
  const handleMarkersChange = (markers) =>{
    setFormData((prevData) =>({
      ...prevData,
      markers
    }))
  }

  const handleSubmit = async () => {
    const currentDate = new Date().toISOString();
  
    // Проверяем наличие markers и преобразуем их в массив почт
    const receiversEmails = formData.markers?.map((marker) => marker.email) || [];
  
    const payload = {
      invitor: formData.invitor,
      project: formData.project,
      receivers: receiversEmails,
      theme: formData.theme,
      jazz_link: formData.jazz_link,
      start_time: formData.start_time,
      duration: formData.duration || 0,
      comment: formData.comment,
      creation_date: currentDate,
      update_date: currentDate,
    };
  
    // Проверяем обязательные поля
    if (!payload.invitor || !payload.project || !payload.receivers.length || !payload.start_time) {
      console.error('Не все обязательные поля заполнены:', payload);
      return;
    }
  
    console.log('Данные перед отправкой:', payload); // Проверяем данные перед отправкой
  
    try {
      const response = await axios.post(`${SERVER_HOST}/meeting`, payload);
      setNotificationMessage('Успешно')
      setNotificationType('success')
      setShowNotification(true)
      console.log('Успешный ответ:', response.data);
    } catch (err) {
      console.error('Ошибка при отправке данных:', err.response?.data || err.message);
      setNotificationMessage('Ошибка при отправке данных')
      setNotificationType('error')
      setShowNotification(true)
    }
  };
  
    // Функция скрытия уведомления
    const successHide = () => {
      setShowNotification(false);
    };
  

  // const options = ['Автокласс','Мера','Чат-Бот','DLAP','PALD']
  const options2 = ['ОС','Обучение','Наказание','Что-то еще','что-то']
  const options3 = ['ivanov@mail.com','smirnova@mail.com','petrov@mail.com','kuznetsova@mail.com','barababa@mail.com']
  // const name_options = [
  //   { name: 'Иван Иванов', email: 'ivanov@mail.com' },
  //   { name: 'Мария Смирнова', email: 'smirnova@mail.com' },
  //   { name: 'Петр Петров', email: 'petrov@mail.com' },
  //   { name: 'Анна Кузнецова', email: 'kuznetsova@mail.com' },
  // ];
  // для package.json
  // "start": "PORT=3006 react-scripts start",

  // Изменение первого селекта
  // const handleFirstSelectChange = (selectedValue) => {
  //   setSelectedFirstOption(selectedValue);
  //   setSecondSelectOptions([]);
  //   setSelectedSecondOption('');
  // };
    // Обработчик изменения значения
    // const handleSelectChange = (data,value) => {
    //   handleDataChange(data)
    //   setSelectedOption(value);
    //   console.log('Выбрано:', value); 
    // };

  const handleInputChange = (value) =>{
    const defaultJazzLink = 'https://example.com/'
    setProjectUrl(value)
    setFormData((prevData)=>({
      ...prevData,
      jazz_link: defaultJazzLink,
    })

    )
  }

  return (
    <div className="App">
      <div className="header">
        <img className="block_img" src={razmetka_logo} alt="logo" width="180px" />
      </div>
      <div className="main">
      <div className="block_2">
      <Select
        // projectUrl="http://10.56.145.85:8001/rm_info/project/name"
        // options={options} // Передаем дефолтный список
        onInputChange = {handleInputChange}
        onDataChange = {handleDataChange}
        options2={options2}
        options3={options3}
        onChange={handleDataChange}
        value={formData}
        label="Введите ссылку на проект"
        className="select_project"
        placeholder="Введите ссылку на проект"
      />
      </div>
      <div className="block_3">
        {/* <h1>Список разметчиков</h1> */}
        <DropdownList
          // options={name_options}
          onChange = {handleMarkersChange}
          label="Выберите разметчика"
          placeholder="Введите имя или почту..."
          className="select_project"
          projectUrl={projectUrl}
        />
        
      </div>
      <button className="sendButton" type="button" onClick={handleSubmit}>Отправить</button>
        
        {showNotification && (
          <div className="backdrop">
            <div className={`notification ${notificationType}`}>
              <h1 className="message">{notificationMessage}</h1>
              <button 
              className="button-box" 
              onClick={() =>{
                successHide()
                window.location.reload()
              }

              }
              >Продолжить</button>
            </div>
          </div>
        )}
        {/* {selectedOption && <p>Вы выбрали: {selectedOption}</p>}  */}

        {/* <Select
        options={options}
        onChange={handleSelectChange}
        value={selectedOption}
        label="Города"
        className="custom-select"
      />
      {selectedOption && <p>Вы выбрали: {selectedOption}</p>} */}
      </div>
    </div>
    
  );
}

export default App;

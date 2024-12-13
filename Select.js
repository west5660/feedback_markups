import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import './Select.css';

function Select({
  options2,
  onChange,
  value,
  label,
  className,
  placeholder,
  onInputChange,
}) {
  const [inputValue, setInputValue] = useState(''); // для ссылки на проект
  const [inputValue2, setInputValue2] = useState(''); // для темы встречи
  const [inputValue3, setInputValue3] = useState(''); // для менеджера
  const [filteredOptions3, setFilteredOptions3] = useState([])
  const [isDropdownOpen2, setIsDropdownOpen2] = useState(false); // Для управления dropdown для темы встречи
  const [isDropdownOpen3, setIsDropdownOpen3] = useState(false); // Для управления dropdown для менеджера
  const [comment, setComment] = useState(''); // для комментария
  const [startTime, setStartTime] = useState(''); // для времени
  const [managerOptions, setManagerOptions] = useState([]); // Список менеджеров
  const [projectOptions, setProjectOptions] = useState(''); // Название проекта
  const [error, setError] = useState(''); // Ошибки при получении данных

  // Получение данных проекта по ссылке
  useEffect(() => {
    const fetchProjectName = async () => {
      if (!inputValue) return;

      try {
        setError('');
        const response = await axios.get(`/rm_info/project/name`, {
          params: { url: inputValue },
        });

        if (response.data && response.data.length > 0) {
          const projectName = response.data[0]
          setProjectOptions(projectName);
          onChange({project: projectName})
        } else {
          setProjectOptions('Имя проекта не найдено');
        }
      } catch (error) {
        console.error('Error fetching project name:', error);
        setError(`Не удалось получить имя проекта: ${error.message}`);
      }
    };

    fetchProjectName();
  }, [inputValue]); // Эта зависимость отслеживает изменения только для поля с ссылкой на проект

  // Получение данных менеджеров
  useEffect(() => {
    const fetchManagerOptions = async () => {
      try {
        const response = await axios.get(`/rm_info/manager`);
        const formattedOptions = response.data.map((item) => ({
          full_name: item.full_name,
          email: item.email,
        }));
        setManagerOptions(formattedOptions);
        setFilteredOptions3(formattedOptions)
      } catch (error) {
        console.error('Error fetching manager options:', error);
      }
    };

    fetchManagerOptions();
  }, [inputValue3]); // Эта зависимость вызывает запрос один раз при монтировании компонента

  // Обработчик для фильтрации списка тем встречи
  const filteredOptions2 = options2.filter((option) =>
    option.toLowerCase().includes(inputValue2.toLowerCase())
  );

  // Обработчик для фильтрации списка менеджеров
  useEffect(() => {
    const filtered = managerOptions.filter(
      (option) =>
        option.email.toLowerCase().includes(inputValue3.toLowerCase()) ||
        option.full_name.toLowerCase().includes(inputValue3.toLowerCase())
    );
    setFilteredOptions3(filtered); // Обновляем отфильтрованные данные
    if(inputValue3){
      setIsDropdownOpen3(true)
    }

  }, [inputValue3, managerOptions]);

  // const handleBlur = () =>{
  //   setTimeout(() =>setIsDropdownOpen3(false),150)
  // }


  // // Обработчик для фильтрации списка менеджеров
  // const filteredOptions3 = managerOptions.filter(
  //   (option) =>
  //     option.email.toLowerCase().includes(inputValue3.toLowerCase()) ||
  //     option.full_name.toLowerCase().includes(inputValue3.toLowerCase())
  // );

  // Обработчик для выбора темы встречи
const handleOptionSelect2 = (option) => {
  setInputValue2(option); // Обновляем локальный стейт
  onChange({ theme: option }); // Передаем выбранную тему в formData
  setIsDropdownOpen2(false); // Закрываем выпадающий список
};


  // Обработчик для выбора менеджера
  const handleOptionSelect3 = (option) => {
    setInputValue3(option.full_name);
    // setInputValue3(`${option.full_name} (${option.email})`);
    onChange({invitor:option.email}); // Передаем выбранного менеджера
    setIsDropdownOpen3(false); // Закрытие выпадающего списка
  };

  // Обработчик для изменения значения ссылки
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value); // Обновляем только значение ссылки
    onInputChange(value); // Передаем родительскому компоненту
    setProjectOptions(''); // Сбросим имя проекта, пока не загрузится
  };

  // Обработчик для изменения комментария
  const handleCommentChange = (e) => {
    const value = e.target.value;
    setComment(value);
    onChange({comment: value}); // Передаем комментарий родительскому компоненту
  };

  // Обработчик для изменения времени начала
  const handleStartTimeChange = (e) => {
    const value = e.target.value;
    setStartTime(value);
    onChange({ start_time: value }); // Передаем дату и время
  };

  return (
    <label className="custom-select-container">
      {/* Поле для выбора менеджера */}
      <p>Менеджер:</p>
      <div className="custom-select-wrapper">
        <input
          type="text"
          className={`custom-select-input ${className}`}
          value={inputValue3}
          // onChange={(e) => {
          //   setInputValue3(e.target.value);
          //   handleOptionSelect3({ invitor: e.target.value }); // Обновляем formData
          // }}
          onChange={(e) => setInputValue3(e.target.value)}
          onFocus={() => setIsDropdownOpen3(true)}
          onBlur={() => setTimeout(() => setIsDropdownOpen3(false), 150)}
          placeholder="Введите почту или фамилию"
        />
        {isDropdownOpen3 && filteredOptions3.length > 0 && (
          <ul className="custom-select-dropdown">
            {filteredOptions3.map((option, index) => (
              <li
                key={index}
                className="custom-select-option"
                onClick={() => handleOptionSelect3(option)}
              >
                <strong>{option.full_name}</strong> - <span>{option.email}</span>
                
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Поле для выбора темы встречи */}
      <p>Выберите тему встречи:</p>
      <div className="custom-select-wrapper">
        <input
          type="text"
          className={`custom-select-input ${className}`}
          value={inputValue2}
          onChange={(e) => setInputValue2(e.target.value)}
          onFocus={() => setIsDropdownOpen2(true)}
          onBlur={() => setTimeout(() => setIsDropdownOpen2(false), 150)}
          placeholder="Введите тип действия"
        />
        {isDropdownOpen2 && filteredOptions2.length > 0 && (
          <ul className="custom-select-dropdown">
            {filteredOptions2.map((option) => (
              <li
                key={option}
                className="custom-select-option"
                onClick={() => handleOptionSelect2(option)}
              >
                <strong>{option}</strong>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Поле для выбора времени начала */}
      <p>Дата и время начала:</p>
      <input
        type="datetime-local"
        className={`custom-select-input ${className}`}
        value={startTime}
        onChange={handleStartTimeChange}
      />

      {/* Поле для ввода ссылки на проект */}
      <p>Введите ссылку на проект:</p>
      <div className="custom-select-wrapper">
        <input
          type="text"
          className={`custom-select-input ${className}`}
          value={inputValue} // Управляется только локальным состоянием
          onChange={handleInputChange} // Обработчик обновляет только это поле
          placeholder={placeholder}
        />
      </div>
      {error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <p>
          Имя проекта: <span style={{ color: 'blue' }}>{projectOptions}</span>
        </p>
      )}

      {/* Поле для комментария */}
      <p>Комментарий:</p>
      <textarea
        className="custom-select-comment"
        placeholder="Введите комментарий к проекту"
        value={comment}
        onChange={handleCommentChange}
      />
    </label>
  );
}

Select.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([PropTypes.string,PropTypes.object]).isRequired,
  label: PropTypes.string.isRequired,
  className: PropTypes.string,
  placeholder: PropTypes.string,
};

export default Select;

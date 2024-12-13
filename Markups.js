import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios'

import './Markups.css';

function DropdownList({ options, label, className, placeholder,projectUrl,onChange}) {
  const [inputValueMarker, setInputValueMarker] = useState(''); // Состояние для ввода текста
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Состояние для управления открытием списка
  const [selectedItems, setSelectedItems] = useState([]); // Список выбранных элементов
  const [availableOptions, setAvailableOptions] = useState(options); // Список доступных для выбора
  const dropdownRef = useRef(null); // Ссылка на компонент для обработки кликов вне области
  const[markers, setMarkers] = useState([])
  const [error, setError] = useState('');

  const SERVER_HOST = 'http://10.56.145.85:8001';


  useEffect(() => {
    const fetchMarkers = async () => {
      if (!projectUrl) return; // Если ссылка пуста, пропускаем запрос

      try {
        const response = await axios.get(`/rm_info/project/markers`, {
          params: { url: projectUrl },
        });
        setMarkers(response.data); // Получаем разметчиков
      } catch (err) {
        setError('Не удалось загрузить разметчиков');
      }
    };

    fetchMarkers(); // Запрос выполняется при изменении projectUrl
  }, [projectUrl]); // useEffect будет срабатывать при изменении projectUrl

  // Фильтруем список по введенному значению
  const filteredOptions = markers.filter(
    (option) =>
      option.full_name.toLowerCase().includes(inputValueMarker.toLowerCase()) ||
      option.email.toLowerCase().includes(inputValueMarker.toLowerCase())
  );
  

  // Обработчик выбора элемента
  const handleOptionSelect = (option) => {
    if (!selectedItems.some((item) => item.email === option.email)) {
      const updatedSelectedItems = [...selectedItems, option];
      setSelectedItems(updatedSelectedItems);
      setMarkers((prev) =>
        prev.filter((item) => item.email !== option.email)
      ); // Удаляем выбранный элемент из доступных
      onChange(updatedSelectedItems); // Передаем обновленный список в родительский компонент
    }
    setInputValueMarker(''); // Очищаем поле ввода
  };

  // Обработчик удаления элемента
  const handleRemoveItem = (email) => {
    const removedItem = selectedItems.find((item) => item.email === email);
    const updatedSelectedItems = selectedItems.filter((item) => item.email !== email);
    setSelectedItems(updatedSelectedItems);
    setMarkers((prev) => [...prev, removedItem]);
    onChange(updatedSelectedItems); // Передаем обновленный список в родительский компонент
  };

  // Обработчик клика вне компонента
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false); // Закрываем выпадающий список
    }
  };

  // Добавляем обработчик клика на document
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="dropdown-list-container" ref={dropdownRef}>
    <label className="dropdown-label">{label}:</label>
    <div className="dropdown-content">
      <div className="dropdown-wrapper">
        <input
          type="text"
          className={`dropdown-input ${className}`}
          value={inputValueMarker} // Значение из состояния
          onChange={(e) => {
            setInputValueMarker(e.target.value);
            setIsDropdownOpen(true); // Открываем список при вводе текста
          }}
          onFocus={() => setIsDropdownOpen(true)} // Открытие списка при фокусе
          placeholder={placeholder} 
        />
        {/* Выпадающий список */}
        {isDropdownOpen && filteredOptions.length > 0 && (
          <ul className="dropdown-options">
            {markers.map((marker, index) => (
              <li
                key={index}
                className="dropdown-option"
                onClick={() => handleOptionSelect(marker)}
              >
                <strong>{marker.full_name}</strong> - {marker.email}
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* Контейнер с выбранными элементами */}
      <div className="selected-items-container">
        {selectedItems.map((item, index) => (
          <div key={index} className="selected-item">
            <span>
              <strong>{item.full_name}</strong> - {item.email}
            </span>
            <button
              className="remove-item-button"
              onClick={() => handleRemoveItem(item.email)}
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </div>
  </div>
  );
}

DropdownList.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
    })
  ).isRequired,
  label: PropTypes.string.isRequired,
  className: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired, // Функция для передачи данных в родительский компонент
};

DropdownList.defaultProps = {
  placeholder: 'Введите имя или почту...',
};

export default DropdownList;

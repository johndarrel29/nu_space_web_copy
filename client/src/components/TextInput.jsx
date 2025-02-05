import style from '../css/TextInput.module.css';

function TextInput({ type = 'text', placeholder, value, onChange }) {
  return (
    <input 
        type={type} 
        placeholder={placeholder} 
        value={value} 
        onChange={onChange} 
        className={style['text-style']} 
    />
);
  }
  
  export default TextInput;
  
import style from '../css/TextInput.module.css';

function TextInput({ placeholder, value, onChange }) {
    return <input type="text" placeholder={placeholder} value={value} onChange={onChange} className={style['text-style']}/>;
  }
  
  export default TextInput;
  
import style from '../css/Button.module.css';

function Button({ label }) {
  return (
    <button className={style['button-design']}>{label}</button>
  );
}

export default Button;
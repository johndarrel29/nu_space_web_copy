import style from '../../css/Button.module.css';

function Button({ label, onClick }) {
  return (
    <button className={style['button-design']} onClick={onClick}>{label}</button>
  );
}

export default Button;
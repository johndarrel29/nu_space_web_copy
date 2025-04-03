

function TextInput({ type = 'text', placeholder, value, onChange, className }) {
  return (
    <input 
        type={type} 
        placeholder={placeholder} 
        value={value} 
        onChange={onChange} 
        className={className}
    />
);
  }
  
  export default TextInput;
  
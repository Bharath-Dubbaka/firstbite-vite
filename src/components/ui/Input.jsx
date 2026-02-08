/* Reusable Input */
function Input({ type = "text", placeholder }) {
   return (
      <input type={type} placeholder={placeholder} className="form-input" />
   );
}
export default Input;
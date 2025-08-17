// Style
import "./GeneratorTypeInput.css";
// Components
import Input from "../../../components/input/Input";

export default function GeneratorTypeInput({
  input,
  setInput,
  selectedType,
  setSelectedType,
  INPUT_TYPE,
  detectType,
}) {
  const handleChange = (e) => {
    const v = e.target.value.slice(0, 2000); // limit to 2000 chars
    setInput(v);
    const detected = detectType(v);
    if (detected && detected !== selectedType) {
      setSelectedType(detected);
    }
  };

  const placeholder = INPUT_TYPE.find(
    (g) => g.key === selectedType
  )?.placeholder;

  return (
    <div className="generator-type-input">
      <em className="small-p">
        (Your QR Code will be generated automatically)
      </em>
      <Input
        type="text"
        placeholder={placeholder}
        value={input}
        onChange={handleChange}
        fullWidth
        noBorder
      />
    </div>
  );
}

// Style
import "./GeneratorTypeInput.css";
// Components
import Input from "../../components/input/Input";

export default function GeneratorTypeInput({
  input,
  setInput,
  selectedType,
  GENERATOR_TYPE,
}) {
  return (
    <div className="generator-type-input">
      <Input
        type="text"
        placeholder={
          GENERATOR_TYPE.find((g) => g.key === selectedType)?.placeholder
        }
        value={input}
        onChange={(e) => setInput(e.target.value)}
        fullWidth
        noBorder
      />
      <em className="small-p">
        (Your QR Code will be generated automatically)
      </em>
    </div>
  );
}

// Style
import "./ActionButtons.css";
// Components
import Button from "../../components/button/Button";
import Dropdown from "../../components/input/Dropdown";
// Data
import { SVG_PATHS, FORMAT_OPT, QUALITY_CONTROL } from "../../data/utilsData";

export default function ActionButtons({
  handleDownload,
  handleCopyImage,
  handleShare,
  selectedFormat,
  setSelectedFormat,
  resolution,
  setResolution,
}) {
  return (
    <div className="cards-container row actions">
      <Dropdown
        options={FORMAT_OPT}
        value={selectedFormat}
        onChange={(e) => setSelectedFormat(e.target.value)}
        hasChevron
      />
      {selectedFormat !== "svg" && (
        <Dropdown
          options={QUALITY_CONTROL}
          value={String(resolution)}
          onChange={(e) => setResolution(Number(e.target.value))}
          hasChevron
        />
      )}
      <Button
        text="Download"
        onClick={() => handleDownload(selectedFormat)}
        iconPath={SVG_PATHS.download}
        short
      />
      {selectedFormat == "png" && (
        <Button
          text="Copy Image"
          onClick={() => handleCopyImage(selectedFormat)}
          iconPath={SVG_PATHS.copy}
          short
          hollow
        />
      )}
      <Button
        text="Share"
        onClick={() => handleShare(selectedFormat)}
        iconPath={SVG_PATHS.share}
        short
        hollow
      />
    </div>
  );
}

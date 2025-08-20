// Style
import "./Button.css";
// Components
import Icon from "../ui/Icon";
// Data
import { SVG_PATHS } from "../../data/utilsData";

export default function Button({
  className = "",
  text = "Button",
  title = "",
  arrow = false,
  iconPath = null,
  iconSize = 12,
  hollow = false,
  fullWidth = false,
  rounded = false,
  onClick = null,
  href = null,
  backgroundColor = null,
  textColor = null,
  short = null,
  download,
}) {
  const classes = [
    className ?? "",
    hollow ? "hollow" : "btn",
    fullWidth ? "full" : "",
    rounded ? "rounded-pill" : "rounded-soft",
    short ? "short" : "",
  ].join(" ");

  const customStyle = {
    ...(backgroundColor &&
      !hollow && {
        backgroundColor,
        borderColor: backgroundColor,
      }),
    ...(hollow &&
      backgroundColor && {
        borderColor: backgroundColor,
      }),
    ...(textColor && { color: textColor }),
  };

  const content = (
    <>
      {iconPath && (
        <Icon
          path={iconPath}
          fill={textColor || "var(--text)"}
          size={iconSize}
        />
      )}
      <p style={textColor ? { color: textColor } : {}}>{text}</p>{" "}
      {arrow && <Icon path={SVG_PATHS.arrowRight} fill={textColor} />}
    </>
  );

  const sharedProps = {
    className: classes,
    style: customStyle,
    title: title,
    download: download,
  };

  if (href)
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...sharedProps}>
        {content}
      </a>
    );
  return (
    <button onClick={onClick} {...sharedProps}>
      {content}
    </button>
  );
}

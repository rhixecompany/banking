import type { HeaderBoxProps } from "@/types";

/**
 * Description placeholder
 * @author [object Object]
 *
 * @param {HeaderBoxProps} param0
 * @param {HeaderBoxProps} param0.subtext
 * @param {HeaderBoxProps} param0.title
 * @param {HeaderBoxProps} [param0.type="title"]
 * @param {HeaderBoxProps} param0.user
 * @returns {JSX.Element}
 */
const HeaderBox = ({
  subtext,
  title,
  type = "title",
  user,
}: HeaderBoxProps): JSX.Element => {
  return (
    <div className="header-box">
      <h1 className="header-box-title">
        {title}
        {type === "greeting" && (
          <span className="text-bankGradient">&nbsp;{user}</span>
        )}
      </h1>
      <p className="header-box-subtext">{subtext}</p>
    </div>
  );
};

export default HeaderBox;

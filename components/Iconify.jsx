import { Icon } from "@iconify/react";

const Iconify = ({ icon, width = "1em", height = "1em", ...other }) => {
  return <Icon icon={icon} width={width} height={height} {...other} />;
};

export default Iconify;

import { theme } from "@/constants/theme";
import Config from "./Config";
import File from "./File";
import Folder from "./Folder";
import Hat from "./Hat";
import Home from "./Home";
import Money from "./Money";
import News from "./News";
import Search from "./Search";
import User from "./User";
import UserGroup from "./UserGroup";

const icons = {
  home: Home,
  search: Search,
  news: News,
  folder: Folder,
  user: User,
  userGroup: UserGroup,
  hat: Hat,
  money: Money,
  file: File,
  config: Config,
}

const Icon = ({name, ...props}) => {
  const IconComponent = icons[name];
  return (
    <IconComponent
        height={props.size || 24}
        width={props.size || 24}
        strokeWidth={props.strokeWidth || 1.9}
        color={theme.colors.textLight}
        {...props}
    />
  )
}

export default Icon;
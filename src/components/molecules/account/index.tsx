import { Avatar } from "antd";
import { FC } from "react";

interface AccountProps {
  subTitle?: string;
  title?: string;
  src?: string;
}

const Account: FC<AccountProps> = ({ subTitle, title, src }) => {
  return (
    <div className="flex gap-2">
      <div className="flex flex-col justify-center items-end">
        <p className="text-sm font-questrial">{subTitle}</p>
        <h3 className="text-lg font-semibold font-questrial">{title}</h3>
      </div>
      <div className="flex items-center">
        <Avatar
          size={"large"}
          className="h-20 w-20 border-[3px] border-white border-inset shadow-lg"
          src={src}
        />
      </div>
    </div>
  );
};

export default Account;

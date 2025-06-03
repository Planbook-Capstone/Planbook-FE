import Account from "@/components/molecules/account";
import { Divider } from "antd";
import Image from "next/image";
import { FC } from "react";

interface HeaderProps {
  title?: string;
}

const Header: FC<HeaderProps> = ({ title }) => {
  return (
    <div className="flex items-center gap-2 pt-7">
      <div>
        {/* <h1 className="text-2xl font-semibold pt-3 font-questrial">{title}</h1> */}
        <Image
          src="/images/planbook.svg"
          alt="planbook"
          height="70"
          width="130"
        />
      </div>
      <div className="bg-neutral-300 h-6 w-[1px]" />
      <span className="font-calsans text-lg text-neutral-400">{title}</span>
      <div
        className="flex gap-5"
        //   onClick={() => handleReadNoti()}
      >
        {/* <Notification
          count={
            Array.isArray(data)
              ? data?.filter((item) => !item?.isRead).length
              : 0
          }
          items={notificationItems}
          placement="bottomRight"
          styleClass="cursor-pointer text-shade-800"
        >
          <div className="h-14 w-14 flex justify-center items-center rounded-full">
            <BellOutlined style={{ fontSize: 26 }} />
          </div>
        </Notification> */}
      </div>
    </div>
  );
};

export default Header;

import { useEffect, useRef, useState } from "react";
import { KeenIcon } from "@/components/keenicons";
import { toAbsoluteUrl } from "@/utils";
import { Menu, MenuItem, MenuToggle } from "@/components";
import { DropdownUser } from "@/partials/dropdowns/user";
import { DropdownNotifications } from "@/partials/dropdowns/notifications";
import { DropdownApps } from "@/partials/dropdowns/apps";
import { DropdownChat } from "@/partials/dropdowns/chat";
import { ModalSearch } from "@/partials/modals/search/ModalSearch";
import { useLanguage } from "@/i18n";
import axios from "axios";
import avater from "../../../../public/img/avater.png";

const HeaderTopbar = () => {
  const { isRTL } = useLanguage();
  const itemChatRef = useRef(null);
  const itemAppsRef = useRef(null);
  const itemUserRef = useRef(null);
  const itemNotificationsRef = useRef(null);
  const handleShow = () => {
    window.dispatchEvent(new Event("resize"));
  };
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const handleOpen = () => setSearchModalOpen(true);
  const handleClose = () => {
    setSearchModalOpen(false);
  };

  //==============================================================================
  const loggedInUser = localStorage.getItem("loggedInUser");
  const userParse = JSON.parse(loggedInUser);
  const convertToInt = parseInt(userParse.id);
  console.log(convertToInt);

  const [getLoggedInUser, setGetLoggedInUser] = useState({});

  useEffect(() => {
    fetchLoggedInUser();
  }, []);

  const fetchLoggedInUser = async () => {
    try {
      if(loggedInUser?.user_type === "Support"){
        const response = await axios.get(`https://qwikit1.pythonanywhere.com/supportProfile/${userParse.id}`)
        setGetLoggedInUser(response.data);
      }
      if(loggedInUser?.user_type === "Desk"){
        const response = await axios.get(`https://qwikit1.pythonanywhere.com/deskProfile/${userParse.id}`)
        setGetLoggedInUser(response.data);
      }
      if(loggedInUser?.user_type === "Admin"){
        const response = await axios.get(`https://qwikit1.pythonanywhere.com/adminProfile/${userParse.id}`)
        setGetLoggedInUser(response.data);
      }
      if(loggedInUser?.user_type === "Dietitian"){
        const response = await axios.get(`https://qwikit1.pythonanywhere.com/dietitianProfile/${userParse.id}`)
        setGetLoggedInUser(response.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex items-center gap-2 lg:gap-3.5">
      {/* <button onClick={handleOpen} className="btn btn-icon btn-icon-lg size-9 rounded-full hover:bg-primary-light hover:text-primary text-gray-500">
        <KeenIcon icon="magnifier" />
      </button>
      <ModalSearch open={searchModalOpen} onClose={handleClose} /> */}

      {/* <Menu>
        <MenuItem ref={itemChatRef} onShow={handleShow} toggle="dropdown" trigger="click" dropdownProps={{
            placement: isRTL() ? 'bottom-start' : 'bottom-end',
            modifiers: [{
              name: 'offset',
              options: {
                offset: isRTL() ? [-170, 10] : [170, 10]
              }
            }]
          }}>
          <MenuToggle className="btn btn-icon btn-icon-lg size-9 rounded-full hover:bg-primary-light hover:text-primary dropdown-open:bg-primary-light dropdown-open:text-primary text-gray-500">
            <KeenIcon icon="messages" />
          </MenuToggle>

          {DropdownChat({
          menuTtemRef: itemChatRef
        })}
        </MenuItem>
      </Menu> */}
      {/* 
      <Menu>
          <MenuItem ref={itemAppsRef} toggle="dropdown" trigger="click" dropdownProps={{
          placement: isRTL() ? 'bottom-start' : 'bottom-end',
          modifiers: [{
            name: 'offset',
            options: {
              offset: isRTL() ? [10, 10] : [-10, 10]
            }
          }]
        }}>
          <MenuToggle className="btn btn-icon btn-icon-lg size-9 rounded-full hover:bg-primary-light hover:text-primary dropdown-open:bg-primary-light dropdown-open:text-primary text-gray-500">
            <KeenIcon icon="element-11" />
          </MenuToggle>

          {DropdownApps()}
        </MenuItem>
      </Menu> */}
      {/* 
      <Menu>
        <MenuItem ref={itemNotificationsRef} toggle="dropdown" trigger="click" dropdownProps={{
        placement: isRTL() ? 'bottom-start' : 'bottom-end',
            modifiers: [{
              name: 'offset',
              options: {
                offset: isRTL() ? [70, 10] : [-70, 10] // [skid, distance]
              }
            }]
          }}>
          <MenuToggle className="btn btn-icon btn-icon-lg relative cursor-pointer size-9 rounded-full hover:bg-primary-light hover:text-primary dropdown-open:bg-primary-light dropdown-open:text-primary text-gray-500">
            <KeenIcon icon="notification-status" />
          </MenuToggle>
          {DropdownNotifications({
          menuTtemRef: itemNotificationsRef
        })}
        </MenuItem>
      </Menu> */}

      <Menu>
        <MenuItem
          ref={itemUserRef}
          toggle="dropdown"
          trigger="click"
          dropdownProps={{
            placement: isRTL() ? "bottom-start" : "bottom-end",
            modifiers: [
              {
                name: "offset",
                options: {
                  offset: isRTL() ? [-20, 10] : [20, 10], // [skid, distance]
                },
              },
            ],
          }}
        >
          <MenuToggle className="btn btn-icon rounded-full">
            <img
              className="size-9 rounded-full border-2 border-success shrink-0"
              src={getLoggedInUser.image || avater}
              alt=""
              style={{
                width: "50px",
                height: "40px",
                borderRadius: "50%", // Makes the image completely circular
                objectFit: "cover",
              }}
            />
          </MenuToggle>
          {DropdownUser({
            menuItemRef: itemUserRef,
          })}
        </MenuItem>
      </Menu>
    </div>
  );
};
export { HeaderTopbar };

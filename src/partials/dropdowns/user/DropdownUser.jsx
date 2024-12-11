import { Fragment, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { useAuthContext } from '@/auth';
import { useLanguage } from '@/i18n';
import { toAbsoluteUrl } from '@/utils';
import { DropdownUserLanguages } from './DropdownUserLanguages';
import { useSettings } from '@/providers/SettingsProvider';
import { DefaultTooltip, KeenIcon } from '@/components';
import { MenuItem, MenuLink, MenuSub, MenuTitle, MenuSeparator, MenuArrow, MenuIcon } from '@/components/menu';
import avater from "../../../../public/img/avater.png";
import axios from 'axios';


const DropdownUser = ({
    menuItemRef
   }) => {
    const { settings, storeSettings } = useSettings();
    const { logout } = useAuthContext();
    const { isRTL } = useLanguage();
    const handleThemeMode = event => {
      const newThemeMode = event.target.checked ? 'dark' : 'light';
      storeSettings({
        themeMode: newThemeMode
      });
  };

  const loggedInUser = localStorage.getItem("loggedInUser");
  const userParse = JSON.parse(loggedInUser)
  const navigate = useNavigate()
  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/auth/");
  };

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
  
  const buildHeader = () => {
    return <div className="flex items-center justify-between px-5 py-1.5 gap-1.5">
        <div className="flex items-center gap-2">
          <img className="size-9 rounded-full border-2 border-success" 
          src={getLoggedInUser.image || avater} 
          alt=""
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%", // Makes the image completely circular
            objectFit: "cover",
          }}
           />
          <div className="flex flex-col gap-1.5">
            <Link to="#" className="text-sm text-gray-800 hover:text-primary font-semibold leading-none">      
            {userParse && userParse.phonenumber ? userParse.phonenumber : ""}
            </Link> 
            <a className="text-xs text-gray-600 hover:text-primary font-medium leading-none">
            { userParse && userParse.user_type ? userParse.user_type : ""}
            </a>
          </div>
        </div>
      </div>;
  };

  const buildMenu = () => {
    return <Fragment>
        {/* <MenuSeparator /> */}
        <div className="flex flex-col">
          {/* <MenuItem>
            <MenuLink path="/public-profile/profiles/default">
              <MenuIcon className="menu-icon">
                <KeenIcon icon="badge" />
              </MenuIcon>
              <MenuTitle>
                <FormattedMessage id="USER.MENU.PUBLIC_PROFILE" />
              </MenuTitle>
            </MenuLink>
          </MenuItem> */}

          {/* Create New User */}

          {/* <MenuItem>
            <MenuLink path="/admin/page">
              <MenuIcon className="menu-icon">
                <KeenIcon icon="badge" />
              </MenuIcon>
              <MenuTitle>
                <FormattedMessage id="Show All Users" />
              </MenuTitle>
            </MenuLink>
          </MenuItem> */}

           {/* Create New User end */}


          {/* <MenuItem>
            <MenuLink path="/account/home/user-profile">
              <MenuIcon>
                <KeenIcon icon="profile-circle" />
              </MenuIcon>
              <MenuTitle>
                <FormattedMessage id="USER.MENU.MY_PROFILE" />
              </MenuTitle>
            </MenuLink>
          </MenuItem>
          <MenuItem toggle="dropdown" trigger="hover" dropdownProps={{
          placement: isRTL() ? 'left-start' : 'right-start',
          modifiers: [{
            name: 'offset',
            options: {
              offset: isRTL() ? [50, 0] : [-50, 0] // [skid, distance]
            }
          }]
        }}>
            <MenuLink>
              <MenuIcon>
                <KeenIcon icon="setting-2" />
              </MenuIcon>
              <MenuTitle>
                <FormattedMessage id="USER.MENU.MY_ACCOUNT" />
              </MenuTitle>
              <MenuArrow>
                <KeenIcon icon="right" className="text-3xs rtl:transform rtl:rotate-180" />
              </MenuArrow>
            </MenuLink>
            <MenuSub className="menu-default light:border-gray-300 w-[200px]] md:w-[220px]">
              <MenuItem>
                <MenuLink path="/account/home/get-started">
                  <MenuIcon>
                    <KeenIcon icon="coffee" />
                  </MenuIcon>
                  <MenuTitle>
                    <FormattedMessage id="USER.MENU.GET_STARTED" />
                  </MenuTitle>
                </MenuLink>
              </MenuItem>
              <MenuItem>
                <MenuLink path="/account/home/user-profile">
                  <MenuIcon>
                    <KeenIcon icon="some-files" />
                  </MenuIcon>
                  <MenuTitle>
                    <FormattedMessage id="USER.MENU.MY_PROFILE" />
                  </MenuTitle>
                </MenuLink>
              </MenuItem>
              <MenuItem>
                <MenuLink path="/account/billing/basic">
                  <MenuIcon>
                    <KeenIcon icon="icon" />
                  </MenuIcon>
                  <MenuTitle>
                    <FormattedMessage id="USER.MENU.BILLING" />
                  </MenuTitle>
                  <DefaultTooltip title={<FormattedMessage id="USER.MENU.PAYMENT_&_SUBSCRIPTION_INFO" />} placement="top" className="max-w-48">
                    <KeenIcon icon="information-2" className="text-gray-500 text-md" />
                  </DefaultTooltip>
                </MenuLink>
              </MenuItem>
              <MenuItem>
                <MenuLink path="/account/security/overview">
                  <MenuIcon>
                    <KeenIcon icon="medal-star" />
                  </MenuIcon>
                  <MenuTitle>
                    <FormattedMessage id="USER.MENU.SECURITY" />
                  </MenuTitle>
                </MenuLink>
              </MenuItem>
              <MenuItem>
                <MenuLink path="/account/members/teams">
                  <MenuIcon>
                    <KeenIcon icon="setting" />
                  </MenuIcon>
                  <MenuTitle>
                    <FormattedMessage id="USER.MENU.MEMBERS_&_ROLES" />
                  </MenuTitle>
                </MenuLink>
              </MenuItem>
              <MenuItem>
                <MenuLink path="/account/integrations">
                  <MenuIcon>
                    <KeenIcon icon="switch" />
                  </MenuIcon>
                  <MenuTitle>
                    <FormattedMessage id="USER.MENU.INTEGRATIONS" />
                  </MenuTitle>
                </MenuLink>
              </MenuItem>
              <MenuSeparator />
              <MenuItem>
                <MenuLink path="/account/security/overview">
                  <MenuIcon>
                    <KeenIcon icon="shield-tick" />
                  </MenuIcon>
                  <MenuTitle>
                    <FormattedMessage id="USER.MENU.NOTIFICATIONS" />
                  </MenuTitle>
                  <label className="switch switch-sm">
                    <input name="check" type="checkbox" checked onChange={() => {}} value="1" />
                  </label>
                </MenuLink>
              </MenuItem>
            </MenuSub>
          </MenuItem>
          <MenuItem>
            <MenuLink path="https://devs.keenthemes.com">
              <MenuIcon>
                <KeenIcon icon="message-programming" />
              </MenuIcon>
              <MenuTitle>
                <FormattedMessage id="USER.MENU.DEV_FORUM" />
              </MenuTitle>
            </MenuLink>
          </MenuItem>
          <DropdownUserLanguages menuItemRef={menuItemRef} />
          <MenuSeparator /> */}
        </div>
      </Fragment>;
  };
  const buildFooter = () => {
    return <div className="flex flex-col">
      {/* <div className="menu-item mb-0.5">
          <div className="menu-link">
            <span className="menu-icon">
              <KeenIcon icon="moon" />
            </span>
            <span className="menu-title">
              <FormattedMessage id="USER.MENU.DARK_MODE" />
            </span>
            <label className="switch switch-sm">
              <input name="theme" type="checkbox" checked={settings.themeMode === 'dark'} onChange={handleThemeMode} value="1" />
            </label>
          </div>
        </div> */}

        <div className="menu-item px-4 py-1.5">
          <a onClick={handleLogout} className="btn btn-sm btn-light justify-center">
            <FormattedMessage id="USER.MENU.LOGOUT" />
          </a>
        </div> 
      </div>;
  };
  return <MenuSub className="menu-default light:border-gray-300 w-[200px] md:w-[250px]" rootClassName="p-0">
      {buildHeader()}
      {buildMenu()}
      {buildFooter()}
    </MenuSub>;
};
export { DropdownUser };
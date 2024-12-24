// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Navigate, Route, Routes } from 'react-router';
import { DefaultPage, Demo1DarkSidebarPage } from '@/pages/dashboards';
import { ProfileActivityPage, ProfileBloggerPage, CampaignsCardPage, CampaignsListPage, ProjectColumn2Page, ProjectColumn3Page, ProfileCompanyPage, ProfileCreatorPage, ProfileCRMPage, ProfileDefaultPage, ProfileEmptyPage, ProfileFeedsPage, ProfileGamerPage, ProfileModalPage, ProfileNetworkPage, ProfileNFTPage, ProfilePlainPage, ProfileTeamsPage, ProfileWorksPage } from '@/pages/public-profile';
import { AccountActivityPage, AccountAllowedIPAddressesPage, AccountApiKeysPage, AccountAppearancePage, AccountBackupAndRecoveryPage, AccountBasicPage, AccountCompanyProfilePage, AccountCurrentSessionsPage, AccountDeviceManagementPage, AccountEnterprisePage, AccountGetStartedPage, AccountHistoryPage, AccountImportMembersPage, AccountIntegrationsPage, AccountInviteAFriendPage, AccountMembersStarterPage, AccountNotificationsPage, AccountOverviewPage, AccountPermissionsCheckPage, AccountPermissionsTogglePage, AccountPlansPage, AccountPrivacySettingsPage, AccountRolesPage, AccountSecurityGetStartedPage, AccountSecurityLogPage, AccountSettingsEnterprisePage, AccountSettingsModalPage, AccountSettingsPlainPage, AccountSettingsSidebarPage, AccountTeamInfoPage, AccountTeamMembersPage, AccountTeamsPage, AccountTeamsStarterPage, AccountUserProfilePage } from '@/pages/account';
import { NetworkAppRosterPage, NetworkMarketAuthorsPage, NetworkAuthorPage, NetworkGetStartedPage, NetworkMiniCardsPage, NetworkNFTPage, NetworkSocialPage, NetworkUserCardsTeamCrewPage, NetworkSaasUsersPage, NetworkStoreClientsPage, NetworkUserTableTeamCrewPage, NetworkVisitorsPage } from '@/pages/network';
import { AuthPage } from '@/auth';
import { RequireAuth } from '@/auth/RequireAuth';
import { Demo1Layout } from '@/layouts/demo1';
import { ErrorsRouting } from '@/errors';
import { AuthenticationWelcomeMessagePage, AuthenticationAccountDeactivatedPage, AuthenticationGetStartedPage } from '@/pages/authentication';
import AdminRoutes from '@/userRoutes/AdminRoutes';
import DietationRoutes from '@/userRoutes/DietationRoutes';
import DeskRoutes from '@/userRoutes/DeskRoutes';
import SupportRoutes from '@/userRoutes/SupportRoutes';
import HrUserRoutes from '@/userRoutes/HrUserRoutes';
import CreatePublicUser from '@/userRoutes/CreatePublicUser';
import CreateDietationUser from '@/userRoutes/CreateDietationUser';
import CreateDeskUser from '@/userRoutes/CreateDeskUser';
import CreateSupportUser from '@/userRoutes/CreateSupportUser';
import CreateHrUser from '@/userRoutes/CreateHrUser';
import ProductsCreatePage from '@/productRoutes/ProductsCreatePage';
import ProductsShowPage from '@/productRoutes/ProductsShowPage';
import OrderShowPage from '@/orderRoutes/OrderShowPage';
import TrashPage from '@/trash';
import MoneyRecept from '@/bill-manage/MoneyRecept';
import Invoice from '@/bill-manage/Invoice';
import OrderDetails from '@/orderRoutes/OrderDetails';
import ResetInvoice from '@/bill-manage/ResetInvoice';
import ResetMoneyRecipt from '@/bill-manage/ResetMoneyRecipt';
import AstheticInvoice from '@/bill-manage/AstheticInvoice';
import AtheticMoneReceipt from '@/bill-manage/AtheticMoneReceipt';
import ShowAllUsers from '@/userRoutes/ShowAllUsers';
import ResetForm from '@/bill-manage/ResetForm';
import KYCFrom from '@/userRoutes/KYCFrom';
import AstheticForm from '@/bill-manage/AstheticForm';
import SignUpBonus from '@/Rewords/SignUpBonus';
import ExcerciseManage from '@/Content/ExcerciseManage';
import HealthTipsManage from '@/Content/HealthTipsManage';
import UserReview from '@/Content/UserReview';
import UserReviewVideo from '@/Content/UserReviewVideo';
import Profile from '@/userRoutes/Profile';
import Setting from '@/userRoutes/Setting';
import DhanmondiServices from '@/Services/DhanmondiServices';
import CreateDhanmondi from '@/Services/CreateDhanmondi';
import UttaraServices from '@/Services/UttaraServices';
import CreateUttara from '@/Services/CreateUttara';
import UserAnalysisReport from '@/Report/UserAnalysisReport';
import BusinessAnalaysisReport from '@/Report/BusinessAnalaysisReport';


const AppRoutingSetup = () => {
  return <>
    <Routes>
          <Route element={<RequireAuth />}>
            <Route element={<Demo1Layout />}>
              <Route path="/" element={<DefaultPage />} />
              <Route path="/dark-sidebar" element={<Demo1DarkSidebarPage />} />
              <Route path="/public-profile/profiles/default" element={<ProfileDefaultPage />} />
              <Route path="/public-profile/profiles/creator" element={<ProfileCreatorPage />} />
              <Route path="/public-profile/profiles/company" element={<ProfileCompanyPage />} />
              <Route path="/public-profile/profiles/nft" element={<ProfileNFTPage />} />
              <Route path="/public-profile/profiles/blogger" element={<ProfileBloggerPage />} />
              <Route path="/public-profile/profiles/crm" element={<ProfileCRMPage />} />
              <Route path="/public-profile/profiles/gamer" element={<ProfileGamerPage />} />
              <Route path="/public-profile/profiles/feeds" element={<ProfileFeedsPage />} />
              <Route path="/public-profile/profiles/plain" element={<ProfilePlainPage />} />
              <Route path="/public-profile/profiles/modal" element={<ProfileModalPage />} />
              <Route path="/public-profile/projects/3-columns" element={<ProjectColumn3Page />} />
              <Route path="/public-profile/projects/2-columns" element={<ProjectColumn2Page />} />
              <Route path="/public-profile/works" element={<ProfileWorksPage />} />
              <Route path="/public-profile/teams" element={<ProfileTeamsPage />} />
              <Route path="/public-profile/network" element={<ProfileNetworkPage />} />
              <Route path="/public-profile/activity" element={<ProfileActivityPage />} />
              <Route path="/public-profile/campaigns/card" element={<CampaignsCardPage />} />
              <Route path="/public-profile/campaigns/list" element={<CampaignsListPage />} />
              <Route path="/public-profile/empty" element={<ProfileEmptyPage />} />
              <Route path="/account/home/get-started" element={<AccountGetStartedPage />} />
              <Route path="/account/home/user-profile" element={<AccountUserProfilePage />} />
              <Route path="/account/home/company-profile" element={<AccountCompanyProfilePage />} />
              <Route path="/account/home/settings-sidebar" element={<AccountSettingsSidebarPage />} />
              <Route path="/account/home/settings-enterprise" element={<AccountSettingsEnterprisePage />} />
              <Route path="/account/home/settings-plain" element={<AccountSettingsPlainPage />} />
              <Route path="/account/home/settings-modal" element={<AccountSettingsModalPage />} />
              <Route path="/account/billing/basic" element={<AccountBasicPage />} />
              <Route path="/account/billing/enterprise" element={<AccountEnterprisePage />} />
              <Route path="/account/billing/plans" element={<AccountPlansPage />} />
              <Route path="/account/billing/history" element={<AccountHistoryPage />} />
              <Route path="/account/security/get-started" element={<AccountSecurityGetStartedPage />} />
              <Route path="/account/security/overview" element={<AccountOverviewPage />} />
              <Route path="/account/security/allowed-ip-addresses" element={<AccountAllowedIPAddressesPage />} />
              <Route path="/account/security/privacy-settings" element={<AccountPrivacySettingsPage />} />
              <Route path="/account/security/device-management" element={<AccountDeviceManagementPage />} />
              <Route path="/account/security/backup-and-recovery" element={<AccountBackupAndRecoveryPage />} />
              <Route path="/account/security/current-sessions" element={<AccountCurrentSessionsPage />} />
              <Route path="/account/security/security-log" element={<AccountSecurityLogPage />} />
              <Route path="/account/members/team-starter" element={<AccountTeamsStarterPage />} />
              <Route path="/account/members/teams" element={<AccountTeamsPage />} />
              <Route path="/account/members/team-info" element={<AccountTeamInfoPage />} />
              <Route path="/account/members/members-starter" element={<AccountMembersStarterPage />} />
              <Route path="/account/members/team-members" element={<AccountTeamMembersPage />} />
              <Route path="/account/members/import-members" element={<AccountImportMembersPage />} />
              <Route path="/account/members/roles" element={<AccountRolesPage />} />
              <Route path="/account/members/permissions-toggle" element={<AccountPermissionsTogglePage />} />
              <Route path="/account/members/permissions-check" element={<AccountPermissionsCheckPage />} />
              <Route path="/account/integrations" element={<AccountIntegrationsPage />} />
              <Route path="/account/notifications" element={<AccountNotificationsPage />} />
              <Route path="/account/api-keys" element={<AccountApiKeysPage />} />
              <Route path="/account/appearance" element={<AccountAppearancePage />} />
              <Route path="/account/invite-a-friend" element={<AccountInviteAFriendPage />} />
              <Route path="/account/activity" element={<AccountActivityPage />} />
              <Route path="/network/get-started" element={<NetworkGetStartedPage />} />
              <Route path="/network/user-cards/mini-cards" element={<NetworkMiniCardsPage />} />
              <Route path="/network/user-cards/team-crew" element={<NetworkUserCardsTeamCrewPage />} />
              <Route path="/network/user-cards/author" element={<NetworkAuthorPage />} />
              <Route path="/network/user-cards/nft" element={<NetworkNFTPage />} />
              <Route path="/network/user-cards/social" element={<NetworkSocialPage />} />
              <Route path="/network/user-table/team-crew" element={<NetworkUserTableTeamCrewPage />} />
              <Route path="/network/user-table/app-roster" element={<NetworkAppRosterPage />} />
              <Route path="/network/user-table/market-authors" element={<NetworkMarketAuthorsPage />} />
              <Route path="/network/user-table/saas-users" element={<NetworkSaasUsersPage />} />
              <Route path="/network/user-table/store-clients" element={<NetworkStoreClientsPage />} />
              <Route path="/network/user-table/visitors" element={<NetworkVisitorsPage />} />
              <Route path="/auth/welcome-message" element={<AuthenticationWelcomeMessagePage />} />
              <Route path="/auth/account-deactivated" element={<AuthenticationAccountDeactivatedPage />} />
              <Route path="/authentication/get-started" element={<AuthenticationGetStartedPage />} />

              {/* This is User Routes */}

              <Route path="/admin/profile" element={<Profile />} />
              <Route path="/admin/setting" element={<Setting />} />

              <Route path="/admin/page" element={<AdminRoutes />} />
              <Route path="/admin/create/page" element={<CreatePublicUser />} />
              <Route path="/admin/create/kycpage" element={<KYCFrom />} />
              <Route path="/dietitian/page" element={<DietationRoutes />} />
              <Route path="/dietitian/create/page" element={<CreateDietationUser />} />
              <Route path="/desk/page" element={<DeskRoutes />} />
              <Route path="/desk/create/page" element={<CreateDeskUser />} />
              <Route path="/support/page" element={<SupportRoutes />} />
              <Route path="/support/create/page" element={<CreateSupportUser />} />
              <Route path="/allusers/page" element={<ShowAllUsers />} />
              <Route path="/hr/page" element={<HrUserRoutes />} />
              <Route path="/hr/create/page" element={<CreateHrUser />} />

              {/* This is Money Recept Routes */}
              <Route path="/moneyrecept/page" element={<MoneyRecept />} />
              {/* This is Invoice Routes */}
              <Route path="/invoice/page" element={<Invoice />} />
              <Route path="/reset/invoice/page" element={<ResetInvoice />} />
              <Route path="/reset/moneyrecept/page" element={<ResetMoneyRecipt />} />
              <Route path="/reset/form/page" element={<ResetForm />} />
              <Route path="/asthetic/invoice/page" element={<AstheticInvoice />} />
              <Route path="/asthetic/moneyrecept/page" element={<AtheticMoneReceipt />} />
              <Route path="/asthetic/form/page" element={<AstheticForm />} />

              {/* This is Products Routes */}
              <Route path="/product/create/page" element={<ProductsCreatePage />} />
              <Route path="/product/page" element={<ProductsShowPage />} />

              {/* this is Services Management */}
              <Route path="/servicedhanmondi/page" element={<DhanmondiServices />} />
              <Route path="/servicedhanmondi/create/page" element={<CreateDhanmondi />} />
              <Route path="/serviceuttara/page" element={<UttaraServices />} />
              <Route path="/serviceuttara/create/page" element={<CreateUttara />} />

              {/* This is Order Routes */}
              <Route path="/orders/page" element={<OrderShowPage />} />
              <Route path="/orders/page/:id" element={<OrderDetails />} />

              {/* this is Rewords Management */}
              <Route path="/signupBouns" element={<SignUpBonus />} />

              {/* this is Content Management */}
              <Route path="/exercise" element={<ExcerciseManage />} />
              <Route path="/health" element={<HealthTipsManage />} />
              <Route path="/review" element={<UserReview />} />
              <Route path="/reviewvideo" element={<UserReviewVideo />} />

              {/* this is report Management */}
              <Route path="/userreport" element={<UserAnalysisReport />} />
              <Route path="/businessreport" element={<BusinessAnalaysisReport />} />

              {/* This is Trash Routes */}
              <Route path="/trash" element={<TrashPage/>}
              
            />

            </Route>
          </Route>
          <Route path="error/*" element={<ErrorsRouting />} />
          <Route path="auth/*" element={<AuthPage />} />
          <Route path="*" element={<Navigate to="/error/404" />} />
      </Routes>;
  
  </>
};
export { AppRoutingSetup };
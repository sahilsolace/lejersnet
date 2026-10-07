import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { AppShell } from '@/components/AppShell';

// Auth screens
import { Splash } from '@/screens/auth/Splash';
import { Welcome } from '@/screens/auth/Welcome';
import { SignIn } from '@/screens/auth/SignIn';
import { SignUp } from '@/screens/auth/SignUp';
import { ForgotPassword } from '@/screens/auth/ForgotPassword';
import { CheckEmail } from '@/screens/auth/CheckEmail';
import { ResetPassword } from '@/screens/auth/ResetPassword';
import { PasswordResetSuccess } from '@/screens/auth/PasswordResetSuccess';
import { ProfileSync } from '@/screens/auth/ProfileSync';
import { NotificationPermission } from '@/screens/auth/NotificationPermission';

// Home
import { Home } from '@/screens/home/Home';

// Subscription flow
import { Subscription } from '@/screens/subscription/Subscription';
import { Checkout } from '@/screens/subscription/Checkout';
import { Payment } from '@/screens/subscription/Payment';
import { PaymentSuccess } from '@/screens/subscription/PaymentSuccess';

// Addresses & inspections
import { Addresses } from '@/screens/addresses/Addresses';
import { AddEditAddress } from '@/screens/addresses/AddEditAddress';
import { InspectionFlow } from '@/screens/inspection/InspectionFlow';
import { CategoryDetail } from '@/screens/inspection/CategoryDetail';
import { FullScreenViewer } from '@/screens/inspection/FullScreenViewer';

// Documents & Pictures
import { Documents } from '@/screens/documents/Documents';
import { Pictures } from '@/screens/pictures/Pictures';
import { UploadDocument } from '@/screens/documents/UploadDocument';
import { AddPictures } from '@/screens/pictures/AddPictures';

// Profile & subsections
import { Profile } from '@/screens/profile/Profile';
import { EditBio } from '@/screens/profile/EditBio';
import { PublicInfo } from '@/screens/profile/PublicInfo';
import { PersonalInfo } from '@/screens/profile/PersonalInfo';
import { ChangeEmail } from '@/screens/profile/ChangeEmail';
import { ChangePassword } from '@/screens/profile/ChangePassword';
import { BlockedMembers } from '@/screens/profile/BlockedMembers';
import { MySubscriptions } from '@/screens/profile/MySubscriptions';
import { MyOrders } from '@/screens/profile/MyOrders';
import { OrderDetail } from '@/screens/profile/OrderDetail';
import { MyAddresses } from '@/screens/profile/MyAddresses';
import { NotificationsList } from '@/screens/profile/NotificationsList';
import { Files } from '@/screens/profile/Files';
import { SupportContact } from '@/screens/profile/SupportContact';
import { TermsConditions } from '@/screens/profile/TermsConditions';
import { Privacy } from '@/screens/profile/Privacy';
import { DevTools } from '@/screens/profile/DevTools';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useStore((s) => s.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/splash" replace />;
  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth flow */}
        <Route path="/splash" element={<Splash />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/check-email" element={<CheckEmail />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/password-reset-success" element={<PasswordResetSuccess />} />
        <Route path="/profile-sync" element={<ProfileSync />} />
        <Route path="/notification-permission" element={<NotificationPermission />} />

        {/* Main app with tab bar */}
        <Route
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        >
          <Route path="/home" element={<Home />} />
          <Route path="/subscription" element={<Subscription />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/addresses" element={<Addresses />} />
          <Route path="/address/add" element={<AddEditAddress />} />
          <Route path="/address/edit/:id" element={<AddEditAddress />} />
          <Route path="/inspection/:addressId/:type" element={<InspectionFlow />} />
          <Route path="/inspection/category/:inspectionId/:category" element={<CategoryDetail />} />
          <Route path="/viewer/:mediaId" element={<FullScreenViewer />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/documents/upload" element={<UploadDocument />} />
          <Route path="/pictures" element={<Pictures />} />
          <Route path="/pictures/add" element={<AddPictures />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/bio" element={<EditBio />} />
          <Route path="/profile/public-info" element={<PublicInfo />} />
          <Route path="/profile/personal-info" element={<PersonalInfo />} />
          <Route path="/profile/change-email" element={<ChangeEmail />} />
          <Route path="/profile/change-password" element={<ChangePassword />} />
          <Route path="/profile/blocked-members" element={<BlockedMembers />} />
          <Route path="/profile/subscriptions" element={<MySubscriptions />} />
          <Route path="/profile/orders" element={<MyOrders />} />
          <Route path="/profile/orders/:id" element={<OrderDetail />} />
          <Route path="/profile/addresses" element={<MyAddresses />} />
          <Route path="/profile/notifications" element={<NotificationsList />} />
          <Route path="/profile/files" element={<Files />} />
          <Route path="/profile/support" element={<SupportContact />} />
          <Route path="/profile/terms" element={<TermsConditions />} />
          <Route path="/profile/privacy" element={<Privacy />} />
          <Route path="/profile/devtools" element={<DevTools />} />
        </Route>

        <Route path="*" element={<Navigate to="/splash" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

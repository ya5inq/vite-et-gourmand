import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../guards/ProtectedRoute';
import { PublicRoute } from '../guards/PublicRoute';
import { LoginPage } from '../pages/public/LoginPage';
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { MenuListPage } from '../pages/business/MenuListPage';
import { DishListPage } from '../pages/business/DishListPage';
import { AllergenListPage } from '../pages/business/AllergenListPage';
import { OrderListPage } from '../pages/business/OrderListPage';
import { ReviewListPage } from '../pages/business/ReviewListPage';
import { UserListPage } from '../pages/administration/UserListPage';
import { DeliveryZoneListPage } from '../pages/administration/DeliveryZoneListPage';
import { ContactMessageListPage } from '../pages/administration/ContactMessageListPage';
import { OperatingHoursPage } from '../pages/administration/OperatingHoursPage';
import { CmsHomePage } from '../pages/cms/CmsHomePage';
import { CmsMenuPage } from '../pages/cms/CmsMenuPage';
import { CmsContactPage } from '../pages/cms/CmsContactPage';
import { CmsLegalPage } from '../pages/cms/CmsLegalPage';
import { CmsFooterPage } from '../pages/cms/CmsFooterPage';

export const Router = () => {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* CMS */}
        <Route path="/cms/home" element={<CmsHomePage />} />
        <Route path="/cms/menu" element={<CmsMenuPage />} />
        <Route path="/cms/contact" element={<CmsContactPage />} />
        <Route path="/cms/legal" element={<CmsLegalPage />} />
        <Route path="/cms/footer" element={<CmsFooterPage />} />

        {/* Business */}
        <Route path="/menus" element={<MenuListPage />} />
        <Route path="/dishes" element={<DishListPage />} />
        <Route path="/allergens" element={<AllergenListPage />} />
        <Route path="/orders" element={<OrderListPage />} />
        <Route path="/reviews" element={<ReviewListPage />} />

        {/* Administration */}
        <Route path="/users" element={<UserListPage />} />
        <Route path="/delivery-zones" element={<DeliveryZoneListPage />} />
        <Route path="/contact-messages" element={<ContactMessageListPage />} />
        <Route path="/operating-hours" element={<OperatingHoursPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

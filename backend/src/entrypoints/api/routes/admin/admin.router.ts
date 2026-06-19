import { getHonoApp } from '@/entrypoints/api/loader/getHonoApp';
import { authorizationMiddleware } from '@/entrypoints/api/middlewares/authorization/authorization.middleware';

import { adminAllergenCreateRoute } from './adminAllergenCreate';
import { adminAllergenDeleteRoute } from './adminAllergenDelete';
import { adminAllergenGetAllRoute } from './adminAllergenGetAll';
import { adminAllergenUpdateRoute } from './adminAllergenUpdate';
import { adminContactMessageDeleteRoute } from './adminContactMessageDelete';
import { adminContactMessageGetAllRoute } from './adminContactMessageGetAll';
import { adminContactMessageMarkReadRoute } from './adminContactMessageMarkRead';
import { adminDeliveryZoneCreateRoute } from './adminDeliveryZoneCreate';
import { adminDeliveryZoneDeleteRoute } from './adminDeliveryZoneDelete';
import { adminDeliveryZoneGetAllRoute } from './adminDeliveryZoneGetAll';
import { adminDeliveryZoneUpdateRoute } from './adminDeliveryZoneUpdate';
import { adminDietaryRegimeCreateRoute } from './adminDietaryRegimeCreate';
import { adminDietaryRegimeDeleteRoute } from './adminDietaryRegimeDelete';
import { adminDietaryRegimeGetAllRoute } from './adminDietaryRegimeGetAll';
import { adminDietaryRegimeUpdateRoute } from './adminDietaryRegimeUpdate';
import { adminDishCreateRoute } from './adminDishCreate';
import { adminDishDeleteRoute } from './adminDishDelete';
import { adminDishGetAllRoute } from './adminDishGetAll';
import { adminDishGetOneRoute } from './adminDishGetOne';
import { adminDishUpdateRoute } from './adminDishUpdate';
import { adminMenuCreateRoute } from './adminMenuCreate';
import { adminMenuDeleteRoute } from './adminMenuDelete';
import { adminMenuGetAllRoute } from './adminMenuGetAll';
import { adminMenuGetOneRoute } from './adminMenuGetOne';
import { adminMenuUpdateRoute } from './adminMenuUpdate';
import { adminOperatingHoursGetAllRoute } from './adminOperatingHoursGetAll';
import { adminOperatingHoursUpsertRoute } from './adminOperatingHoursUpsert';
import { adminOrderGetAllRoute } from './adminOrderGetAll';
import { adminOrderGetOneRoute } from './adminOrderGetOne';
import { adminOrderUpdateStatusRoute } from './adminOrderUpdateStatus';
import { adminPageContentGetAllRoute } from './adminPageContentGetAll';
import { adminPageContentUpsertRoute } from './adminPageContentUpsert';
import { adminReviewApproveRoute } from './adminReviewApprove';
import { adminReviewDeleteRoute } from './adminReviewDelete';
import { adminReviewGetAllRoute } from './adminReviewGetAll';

const adminRouter = getHonoApp();

// Catalogue CRUD is reserved to staff (employee + admin).
adminRouter
  .use(authorizationMiddleware({ shouldBeStaff: true }))

  // Allergen
  .route('/', adminAllergenGetAllRoute)
  .route('/', adminAllergenCreateRoute)
  .route('/', adminAllergenUpdateRoute)
  .route('/', adminAllergenDeleteRoute)

  // Dietary Regime
  .route('/', adminDietaryRegimeGetAllRoute)
  .route('/', adminDietaryRegimeCreateRoute)
  .route('/', adminDietaryRegimeUpdateRoute)
  .route('/', adminDietaryRegimeDeleteRoute)

  // Dish
  .route('/', adminDishGetAllRoute)
  .route('/', adminDishGetOneRoute)
  .route('/', adminDishCreateRoute)
  .route('/', adminDishUpdateRoute)
  .route('/', adminDishDeleteRoute)

  // Menu
  .route('/', adminMenuGetAllRoute)
  .route('/', adminMenuGetOneRoute)
  .route('/', adminMenuCreateRoute)
  .route('/', adminMenuUpdateRoute)
  .route('/', adminMenuDeleteRoute)

  // Delivery Zone
  .route('/', adminDeliveryZoneGetAllRoute)
  .route('/', adminDeliveryZoneCreateRoute)
  .route('/', adminDeliveryZoneUpdateRoute)
  .route('/', adminDeliveryZoneDeleteRoute)

  // Order
  .route('/', adminOrderGetAllRoute)
  .route('/', adminOrderGetOneRoute)
  .route('/', adminOrderUpdateStatusRoute)

  // Review (moderation)
  .route('/', adminReviewGetAllRoute)
  .route('/', adminReviewApproveRoute)
  .route('/', adminReviewDeleteRoute)

  // Contact messages
  .route('/', adminContactMessageGetAllRoute)
  .route('/', adminContactMessageMarkReadRoute)
  .route('/', adminContactMessageDeleteRoute)

  // CMS (page content + operating hours)
  .route('/', adminPageContentGetAllRoute)
  .route('/', adminPageContentUpsertRoute)
  .route('/', adminOperatingHoursGetAllRoute)
  .route('/', adminOperatingHoursUpsertRoute);

export { adminRouter };

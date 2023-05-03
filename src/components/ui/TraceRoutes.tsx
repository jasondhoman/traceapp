import { Route, Routes } from 'react-router-dom';

import React, { lazy } from 'react';
import DeleteByTracking from '../../pages/Reports/components/DeleteByTracking';
import GradeMixList from '../../pages/Reports/components/GradeMixListReport';
import OrdersArchiveExport from '../../pages/Reports/components/OrdersArchiveExport';

const ErrorView = lazy(() => import('../../pages/Admin/components/ErrorView'));
const LogViewer = lazy(() => import('../../pages/Admin/components/LogViewer'));
const LogViewerLive = lazy(
  () => import('../../pages/Admin/components/LogViewerLive')
);
const UserForm = lazy(() => import('../../pages/Admin/components/UserForm'));
const UsersDisplay = lazy(
  () => import('../../pages/Admin/components/UsersDisplay')
);
const CertificationPage = lazy(
  () => import('../../pages/Certifications/components/CertificationsPage')
);
const CreditMemo = lazy(
  () => import('../../pages/Creditmemo/components/CreditMemoPage')
);
const CustomerPage = lazy(
  () => import('../../pages/Customer/components/CustomerPage')
);
const CustomerSize = lazy(() => import('../../pages/Customersize/index'));
const GradeMix = lazy(
  () => import('../../pages/Grademix/components/GradeMixPage')
);
const HomePage = lazy(() => import('../../pages/Home/HomePage'));
const LoginPage = lazy(() => import('../../pages/Misc/components/LoginPage'));
const NotFound = lazy(() => import('../../pages/Misc/components/NotFound'));
const ResetPasswordPage = lazy(
  () => import('../../pages/Misc/components/ResetPassword')
);
const Orders = lazy(() => import('../../pages/Orders/components/OrdersPage'));
const ProductionData = lazy(
  () =>
    import('../../pages/Orders/Productioninformation/ProductionInformationPage')
);
const RawMaterials = lazy(
  () => import('../../pages/Rawmaterials/components/RawMaterialPage')
);
const RawMaterialsUsed = lazy(
  () => import('../../pages/Rawmaterialsused/components/RawMaterialUsedPage')
);
const BillOfLading = lazy(
  () => import('../../pages/Reports/components/BillOfLading')
);
const CreditMemoReport = lazy(
  () => import('../../pages/Reports/components/CreditMemoReport')
);

const Invoice = lazy(() => import('../../pages/Reports/components/Invoice'));
const LinterReport = lazy(
  () => import('../../pages/Reports/components/LinterReport')
);
const ProductionRunReport = lazy(
  () => import('../../pages/Reports/components/ProductionRunReport')
);
const SalesCommissionReport = lazy(
  () => import('../../pages/Reports/components/SalesCommissionReport')
);
const SalesOrderDocument = lazy(
  () => import('../../pages/Reports/components/SalesOrderDocument')
);
const WeightReport = lazy(
  () => import('../../pages/Reports/components/WeightReport')
);
const Saleperson = lazy(
  () => import('../../pages/Salespersons/components/SalespersonPage')
);
const WeightsToShip = lazy(
  () => import('../../pages/Weightstoship/components/WeightsPage')
);
const PrivateRoute = lazy(() => import('./PrivateRoute'));
const ErrorDisplay = lazy(
  () => import('../../pages/Admin/components/ErrorDisplay')
);
const OrdersExport = lazy(
  () => import('../../pages/Reports/components/OrdersExport')
);
const LabelGenerator = lazy(
  () => import('../../pages/Reports/components/Label')
);
const BulkArchiveOrders = lazy(
  () => import('../../pages/Reports/components/BulkArchiveOrders')
);

const Archive = lazy(
  () => import('../../pages/Archive/components/ArchivePage')
);

const ScreenLessReport = lazy(
  () => import('../../pages/Reports/components/ScreenLessReport')
);

const TraceRoutes = () => {
  return (
    <Routes>
      <Route element={<PrivateRoute component={HomePage} />} path="/" />
      <Route element={<LoginPage />} path="/login" />
      <Route
        element={<PrivateRoute component={ResetPasswordPage} />}
        path="/resetpassword"
      />

      <Route path="/orders">
        <Route
          index
          element={<PrivateRoute component={Orders} name="Orders" />}
        />
        <Route
          path=":route_id"
          element={<PrivateRoute component={Orders} name="Orders" />}
        />
      </Route>
      <Route path="/customers">
        <Route
          index
          element={<PrivateRoute component={CustomerPage} name="Customers" />}
        />
        <Route
          path=":route_id"
          element={<PrivateRoute component={CustomerPage} name="Customers" />}
        />
      </Route>
      <Route path="/certifications">
        <Route
          index
          element={
            <PrivateRoute component={CertificationPage} name="Certifications" />
          }
        />
        <Route
          path=":route_id"
          element={
            <PrivateRoute component={CertificationPage} name="Certifications" />
          }
        />
      </Route>
      <Route path="/rawmaterials">
        <Route
          index
          element={
            <PrivateRoute component={RawMaterials} name="Raw Materials" />
          }
        />
        <Route
          path=":route_id"
          element={
            <PrivateRoute component={RawMaterials} name="Raw Materials" />
          }
        />
      </Route>
      <Route path="/rawmaterialsused">
        <Route
          index
          element={
            <PrivateRoute
              component={RawMaterialsUsed}
              name="Raw Materials Used"
            />
          }
        />
        <Route
          path=":route_id"
          element={
            <PrivateRoute
              component={RawMaterialsUsed}
              name="Raw Materials Used"
            />
          }
        />
      </Route>
      <Route path="/CustomerSize">
        <Route
          index
          element={
            <PrivateRoute component={CustomerSize} name="Customer Size" />
          }
        />
        <Route
          path=":route_id"
          element={
            <PrivateRoute component={CustomerSize} name="Customer Size" />
          }
        />
      </Route>
      <Route path="/grademix">
        <Route
          index
          element={<PrivateRoute component={GradeMix} name="Grade Mix" />}
        />
        <Route
          path=":route_id"
          element={<PrivateRoute component={GradeMix} name="Grade Mix" />}
        />
      </Route>
      <Route path="/salepersons">
        <Route
          index
          element={<PrivateRoute component={Saleperson} name="Salesperson" />}
        />
        <Route
          path=":route_id"
          element={<PrivateRoute component={Saleperson} name="Salesperson" />}
        />
      </Route>
      <Route path="/productioninformation">
        <Route
          index
          element={
            <PrivateRoute component={ProductionData} name="Production Data" />
          }
        />
        <Route
          path=":route_id"
          element={
            <PrivateRoute component={ProductionData} name="Production Data" />
          }
        />
      </Route>
      <Route path="/weightstoship">
        <Route
          index
          element={
            <PrivateRoute component={WeightsToShip} name="Weights to Ship" />
          }
        />
        <Route
          path=":route_id"
          element={
            <PrivateRoute component={WeightsToShip} name="Weights to Ship" />
          }
        />
      </Route>
      <Route path="/creditmemo">
        <Route
          index
          element={<PrivateRoute component={CreditMemo} name="Credit Memo" />}
        />
        <Route
          path=":route_id"
          element={<PrivateRoute component={CreditMemo} name="Credit Memo" />}
        />
      </Route>
      <Route
        path="/archivedisplay"
        element={<PrivateRoute component={Archive} name="Archive" />}
      />
      <Route path="/adminpanel">
        <Route
          element={
            <PrivateRoute component={UsersDisplay} name="User Display" />
          }
          path="usersdisplay"
        />
        <Route
          element={<PrivateRoute component={UserForm} name="User" />}
          path="userform"
        />
        <Route
          element={<PrivateRoute component={UserForm} name="My Account" />}
          path="userform/:id"
        />
        <Route
          element={
            <PrivateRoute component={LogViewer} name="Log Viewer Historical" />
          }
          path="logviewer"
        />
        <Route
          element={
            <PrivateRoute component={LogViewerLive} name="Log Viewer Live" />
          }
          path="logviewer/live"
        />
        <Route
          element={<PrivateRoute component={ErrorDisplay} name="Errors" />}
          path="errors"
        />
        <Route
          path="errors/:id"
          element={<PrivateRoute component={ErrorView} name="Errors" />}
        />
        <Route
          element={<PrivateRoute component={UserForm} name="My Account" />}
          path="userform/:id"
        />
      </Route>

      <Route path="/reporting">
        <Route
          path="gradeformulalist"
          element={
            <PrivateRoute
              component={GradeMixList}
              name="Grade Mix List Report"
            />
          }
        />

        <Route
          path="weight"
          element={
            <PrivateRoute component={WeightReport} name="Weight Sheet" />
          }
        />
        <Route
          path="linter"
          element={
            <PrivateRoute component={LinterReport} name="Weight Sheet" />
          }
        />
        <Route
          path="productionrun"
          element={
            <PrivateRoute
              component={ProductionRunReport}
              name="Production Run Report"
            />
          }
        />
        <Route
          path="salescommission"
          element={
            <PrivateRoute
              component={SalesCommissionReport}
              name="Sales Commission Report"
            />
          }
        />
        <Route
          path="salesorderdocument"
          element={
            <PrivateRoute
              component={SalesOrderDocument}
              name="Sales Order Document"
            />
          }
        />
        <Route
          path="bol"
          element={
            <PrivateRoute component={BillOfLading} name="Bill of Lading" />
          }
        />
        <Route
          path="invoice"
          element={<PrivateRoute component={Invoice} name="Invoicing" />}
        />
        <Route
          path="creditmemo"
          element={
            <PrivateRoute component={CreditMemoReport} name="Invoicing" />
          }
        />
        <Route
          path="labels"
          element={<PrivateRoute component={LabelGenerator} name="labels" />}
        />
      </Route>
      <Route path="/archive">
        <Route
          path="exportorders"
          element={
            <PrivateRoute component={OrdersExport} name="Orders Export" />
          }
        />
        <Route
          path="exportarchivedorders"
          element={
            <PrivateRoute
              component={OrdersArchiveExport}
              name="Orders ArchivedExport"
            />
          }
        />
        <Route
          path="deleteorders"
          element={
            <PrivateRoute
              component={DeleteByTracking}
              name="Delete By Tracking"
            />
          }
        />
        <Route
          path="bulkarchive"
          element={
            <PrivateRoute
              component={BulkArchiveOrders}
              name="Archive By Ship Date"
            />
          }
        />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
export default TraceRoutes;

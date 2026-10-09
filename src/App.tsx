import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DemoAuthProvider } from './context/DemoAuthContext';
import { NexusDataProvider } from './context/NexusDataContext';
import { LoginLandingPage } from './components/layout/LoginLandingPage';
import { ProtectedAdminRoute } from './components/admin/layout/ProtectedAdminRoute';
import { AdminLayout } from './components/admin/layout/AdminLayout';

// Admin Pages
import { DashboardPage } from './components/admin/pages/DashboardPage';
import { OrganizationPage } from './components/admin/pages/OrganizationPage';
import { UsersPage } from './components/admin/pages/UsersPage';
import { ReportingCyclePage } from './components/admin/pages/ReportingCyclePage';
import { BRSRFrameworkPage } from './components/admin/pages/BRSRFrameworkPage';
import { TaskAssignmentPage } from './components/admin/pages/TaskAssignmentPage';
import { ValidationPage } from './components/admin/pages/ValidationPage';
import { EvidenceAuditPage } from './components/admin/pages/EvidenceAuditPage';
import { SubmissionMonitorPage } from './components/admin/pages/SubmissionMonitorPage';
import { AdminConsolidationPage } from './components/admin/pages/AdminConsolidationPage';
import { AdminAuditLogsPage } from './components/admin/pages/AdminAuditLogsPage';
import { AdminNotificationsPage } from './components/admin/pages/AdminNotificationsPage';
import { ReportReadinessPage } from './components/admin/pages/ReportReadinessPage';
import { SettingsPage } from './components/admin/pages/SettingsPage';

// Reviewer Pages & Layout
import { ProtectedReviewerRoute } from './components/reviewer/layout/ProtectedReviewerRoute';
import { ReviewerLayout } from './components/reviewer/layout/ReviewerLayout';
import { ReviewerDashboardPage } from './components/reviewer/pages/ReviewerDashboardPage';
import { ReviewQueuePage } from './components/reviewer/pages/ReviewQueuePage';
import { SubmissionDetailPage } from './components/reviewer/pages/SubmissionDetailPage';
import { ValidationIssuesPage } from './components/reviewer/pages/ValidationIssuesPage';
import { EvidenceReviewPage } from './components/reviewer/pages/EvidenceReviewPage';
import { ActivityHistoryPage } from './components/reviewer/pages/ActivityHistoryPage';
import { ReviewerSettingsPage } from './components/reviewer/pages/ReviewerSettingsPage';
import { ReviewerBRSRCorePage } from './components/reviewer/pages/ReviewerBRSRCorePage';
import { ReviewerDataLineagePage } from './components/reviewer/pages/ReviewerDataLineagePage';
import { ReviewerNotificationsPage } from './components/reviewer/pages/ReviewerNotificationsPage';

// Contributor Pages & Layout
import { ProtectedContributorRoute } from './components/contributor/layout/ProtectedContributorRoute';
import { ContributorLayout } from './components/contributor/layout/ContributorLayout';
import { ContributorDashboard } from './components/contributor/pages/ContributorDashboard';
import { ContributorAssignmentsPage } from './components/contributor/pages/ContributorAssignmentsPage';
import { AssignmentDataEntryPage } from './components/contributor/pages/AssignmentDataEntryPage';
import { BulkDataUploadPage } from './components/contributor/pages/BulkDataUploadPage';
import { ContributorEvidencePage } from './components/contributor/pages/ContributorEvidencePage';
import { ContributorCorrectionsPage } from './components/contributor/pages/ContributorCorrectionsPage';
import { ContributorSubmissionsPage } from './components/contributor/pages/ContributorSubmissionsPage';
import { ContributorActivityPage } from './components/contributor/pages/ContributorActivityPage';

// Management Pages & Layout
import { ProtectedManagementRoute } from './components/management/layout/ProtectedManagementRoute';
import { ManagementLayout } from './components/management/layout/ManagementLayout';
import { ManagementDashboard } from './components/management/pages/ManagementDashboard';
import { ESGOverviewPage } from './components/management/pages/ESGOverviewPage';
import { EnvironmentalPage } from './components/management/pages/EnvironmentalPage';
import { SocialPage } from './components/management/pages/SocialPage';
import { GovernancePage } from './components/management/pages/GovernancePage';
import { RisksPage } from './components/management/pages/RisksPage';
import { SignOffPage } from './components/management/pages/SignOffPage';
import { ManagementReportsPage } from './components/management/pages/ManagementReportsPage';
import { ManagementActivityPage } from './components/management/pages/ManagementActivityPage';

// Auditor Pages & Layout
import { ProtectedAuditorRoute } from './components/auth/ProtectedAuditorRoute';
import { AuditorLayout } from './components/auditor/layout/AuditorLayout';
import { AuditorDashboardPage } from './components/auditor/pages/AuditorDashboardPage';

export function App() {
  return (
    <DemoAuthProvider>
      <NexusDataProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Landing Page */}
            <Route path="/" element={<LoginLandingPage />} />

            {/* Root /admin redirection */}
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

            {/* Protected ESG Admin Portal Subsystem */}
            <Route
              path="/admin"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout />
                </ProtectedAdminRoute>
              }
            >
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="organization" element={<OrganizationPage />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="reporting-periods" element={<ReportingCyclePage />} />
              <Route path="indicator-master" element={<BRSRFrameworkPage />} />
              <Route path="data-collection" element={<TaskAssignmentPage />} />
              <Route path="validation-rules" element={<ValidationPage />} />
              <Route path="evidence-configuration" element={<EvidenceAuditPage />} />
              <Route path="brsr-control-center" element={<SubmissionMonitorPage />} />
              <Route path="brsr-core" element={<ReviewerBRSRCorePage />} />
              <Route path="consolidation" element={<AdminConsolidationPage />} />
              <Route path="assessment" element={<ReportReadinessPage />} />
              <Route path="reports" element={<ManagementReportsPage />} />
              <Route path="notifications" element={<AdminNotificationsPage />} />
              <Route path="audit-logs" element={<AdminAuditLogsPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            {/* Root /reviewer redirection */}
            <Route path="/reviewer" element={<Navigate to="/reviewer/dashboard" replace />} />

            {/* Protected Reviewer / Approver Portal Subsystem */}
            <Route
              path="/reviewer"
              element={
                <ProtectedReviewerRoute>
                  <ReviewerLayout />
                </ProtectedReviewerRoute>
              }
            >
              <Route path="dashboard" element={<ReviewerDashboardPage />} />
              <Route path="review-queue" element={<ReviewQueuePage />} />
              <Route path="pending-reviews" element={<ReviewQueuePage />} />
              <Route path="corrections" element={<ReviewQueuePage />} />
              <Route path="submission-detail/:assignmentId" element={<SubmissionDetailPage />} />
              <Route path="anomalies" element={<ValidationIssuesPage />} />
              <Route path="validation-issues" element={<ValidationIssuesPage />} />
              <Route path="evidence" element={<EvidenceReviewPage />} />
              <Route path="evidence-review" element={<EvidenceReviewPage />} />
              <Route path="brsr-core" element={<ReviewerBRSRCorePage />} />
              <Route path="data-lineage" element={<ReviewerDataLineagePage />} />
              <Route path="review-history" element={<ActivityHistoryPage />} />
              <Route path="activity-history" element={<ActivityHistoryPage />} />
              <Route path="notifications" element={<ReviewerNotificationsPage />} />
              <Route path="settings" element={<ReviewerSettingsPage />} />
            </Route>

            {/* Root /contributor redirection */}
            <Route path="/contributor" element={<Navigate to="/contributor/dashboard" replace />} />

            {/* Protected Data Contributor Portal Subsystem */}
            <Route
              path="/contributor"
              element={
                <ProtectedContributorRoute>
                  <ContributorLayout />
                </ProtectedContributorRoute>
              }
            >
              <Route path="dashboard" element={<ContributorDashboard />} />
              <Route path="assignments" element={<ContributorAssignmentsPage />} />
              <Route path="assignments/:assignmentId" element={<AssignmentDataEntryPage />} />
              <Route path="bulk-upload" element={<BulkDataUploadPage />} />
              <Route path="evidence" element={<ContributorEvidencePage />} />
              <Route path="corrections" element={<ContributorCorrectionsPage />} />
              <Route path="submissions" element={<ContributorSubmissionsPage />} />
              <Route path="activity" element={<ContributorActivityPage />} />
            </Route>

            {/* Management Portal Redirection */}
            <Route path="/management" element={<Navigate to="/management/dashboard" replace />} />

            {/* Protected Management Portal Subsystem */}
            <Route
              path="/management"
              element={
                <ProtectedManagementRoute>
                  <ManagementLayout />
                </ProtectedManagementRoute>
              }
            >
              <Route path="dashboard" element={<ManagementDashboard />} />
              <Route path="esg-overview" element={<ESGOverviewPage />} />
              <Route path="environmental" element={<EnvironmentalPage />} />
              <Route path="social" element={<SocialPage />} />
              <Route path="governance" element={<GovernancePage />} />
              <Route path="brsr-readiness" element={<ReportReadinessPage />} />
              <Route path="risks" element={<RisksPage />} />
              <Route path="sign-off" element={<SignOffPage />} />
              <Route path="reports" element={<ManagementReportsPage />} />
              <Route path="activity" element={<ManagementActivityPage />} />
            </Route>

            {/* Auditor Portal Redirection */}
            <Route path="/auditor" element={<Navigate to="/auditor/dashboard" replace />} />

            {/* Protected Auditor / Assurer Portal Subsystem */}
            <Route
              path="/auditor"
              element={
                <ProtectedAuditorRoute>
                  <AuditorLayout />
                </ProtectedAuditorRoute>
              }
            >
              <Route path="dashboard" element={<AuditorDashboardPage />} />
              <Route path="evidence" element={<EvidenceReviewPage />} />
              <Route path="lineage" element={<ReviewerDataLineagePage />} />
              <Route path="assurance-statement" element={<AuditorDashboardPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </NexusDataProvider>
    </DemoAuthProvider>
  );
}

export default App;

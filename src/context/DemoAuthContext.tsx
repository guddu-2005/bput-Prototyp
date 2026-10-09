/* oxlint-disable react/only-export-components */
import React, { createContext, useContext, useState } from 'react';
import type { DemoSession } from '../types/auth';

/**
 * PROTOTYPE DEMO AUTHENTICATION CONTEXT (ESG Admin, Reviewer, Contributor & Management)
 * 
 * SECURITY NOTICE:
 * Vite environment variables (prefixed with VITE_) are embedded directly into the
 * client-side bundle and are visible to anyone inspecting the network/source code.
 * This client-side credential verification is implemented solely for prototype demonstration
 * and UI evaluation of the ESG Admin, Reviewer / Approver, Data Contributor, and Management portals.
 * 
 * NEVER use client-side authentication or embed real credentials in production.
 * In production, authentication must be verified by a secure backend service using
 * encrypted tokens (e.g. OAuth 2.0 / OIDC / JWT with HttpOnly cookies).
 */

const SESSION_STORAGE_KEY = 'meil_demo_auth_session';
// For backward compatibility with existing session key
const LEGACY_ADMIN_KEY = 'meil_demo_admin_session';

export interface PortalDemoCredential {
  portalId: PortalRole;
  roleKey: 'esg_admin' | 'reviewer' | 'contributor' | 'management' | 'auditor';
  title: string;
  email: string;
  password: string;
  userName: string;
  description: string;
  targetPath: string;
}

export const ALL_DEMO_PORTAL_CREDENTIALS: Record<PortalRole, PortalDemoCredential> = {
  'esg-admin': {
    portalId: 'esg-admin',
    roleKey: 'esg_admin',
    title: 'ESG Admin',
    email: 'admin@meil.in',
    password: 'Admin@1234',
    userName: 'Rajesh Sharma (ESG Admin)',
    description: 'System governance, user authorization & cycle management',
    targetPath: '/admin/dashboard',
  },
  'data-contributor': {
    portalId: 'data-contributor',
    roleKey: 'contributor',
    title: 'Data Contributor',
    email: 'contributor@meil.in',
    password: 'Contributor@1234',
    userName: 'Suresh Kumar (Site Engineer)',
    description: 'Field & plant metric data entries, bulk upload & evidence',
    targetPath: '/contributor/dashboard',
  },
  'reviewer-approver': {
    portalId: 'reviewer-approver',
    roleKey: 'reviewer',
    title: 'Reviewer / Approver',
    email: 'reviewer@meil.in',
    password: 'Reviewer@1234',
    userName: 'Aarav Patel (Review Lead)',
    description: 'Multi-tier verification, anomaly checks & QA approvals',
    targetPath: '/reviewer/dashboard',
  },
  'management': {
    portalId: 'management',
    roleKey: 'management',
    title: 'Executive Management',
    email: 'management@meil.in',
    password: 'Management@1234',
    userName: 'Dr. V. Rao (Chief Sustainability Officer)',
    description: 'Executive ESG oversight, forecast trends & board sign-off',
    targetPath: '/management/dashboard',
  },
  'auditor-assurer': {
    portalId: 'auditor-assurer',
    roleKey: 'auditor',
    title: 'Auditor / Assurer',
    email: 'auditor@meil.in',
    password: 'Auditor@1234',
    userName: 'Sanjay Deshmukh (Lead BRSR Assurer - Deloitte)',
    description: 'Independent audit trail verification & BRSR assurance',
    targetPath: '/auditor/dashboard',
  },
};

interface DemoAuthContextType {
  session: DemoSession | null;
  isAuthenticated: boolean;
  isAdminAuthenticated: boolean;
  isReviewerAuthenticated: boolean;
  isContributorAuthenticated: boolean;
  isManagementAuthenticated: boolean;
  isAuditorAuthenticated: boolean;
  userRole: 'esg_admin' | 'reviewer' | 'contributor' | 'management' | 'auditor' | null;
  isDemoAdminEnabled: boolean;
  isDemoReviewerEnabled: boolean;
  isDemoContributorEnabled: boolean;
  isDemoManagementEnabled: boolean;
  isDemoAuditorEnabled: boolean;
  loginDemoAdmin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginDemoReviewer: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginDemoContributor: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginDemoManagement: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginDemoAuditor: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  fillDemoAdminCredentials: () => { email: string; password: string } | null;
  fillDemoReviewerCredentials: () => { email: string; password: string } | null;
  fillDemoContributorCredentials: () => { email: string; password: string } | null;
  fillDemoManagementCredentials: () => { email: string; password: string } | null;
  fillDemoAuditorCredentials: () => { email: string; password: string } | null;
  getPortalCredentials: (role: PortalRole) => PortalDemoCredential;
  logout: () => void;
}

const DemoAuthContext = createContext<DemoAuthContextType | undefined>(undefined);

export const DemoAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<DemoSession | null>(() => {
    try {
      const stored = sessionStorage.getItem(SESSION_STORAGE_KEY) || sessionStorage.getItem(LEGACY_ADMIN_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (
          parsed?.authenticated === true &&
          (parsed?.role === 'esg_admin' ||
            parsed?.role === 'reviewer' ||
            parsed?.role === 'contributor' ||
            parsed?.role === 'management' ||
            parsed?.role === 'auditor')
        ) {
          return parsed as DemoSession;
        }
      }
    } catch {
      // Ignore sessionStorage parsing errors
    }
    return null;
  });

  // Read environment variables for ESG Admin (with reliable demo defaults)
  const isDemoAdminEnabled = import.meta.env.VITE_ENABLE_DEMO_AUTH !== 'false';
  const configuredAdminEmail = (import.meta.env.VITE_DEMO_ADMIN_EMAIL as string) || 'admin@meil.in';
  const configuredAdminPassword = (import.meta.env.VITE_DEMO_ADMIN_PASSWORD as string) || 'Admin@1234';

  // Read environment variables for Reviewer
  const isDemoReviewerEnabled = import.meta.env.VITE_ENABLE_DEMO_REVIEWER_AUTH !== 'false';
  const configuredReviewerEmail = (import.meta.env.VITE_DEMO_REVIEWER_EMAIL as string) || 'reviewer@meil.in';
  const configuredReviewerPassword = (import.meta.env.VITE_DEMO_REVIEWER_PASSWORD as string) || 'Reviewer@1234';

  // Read environment variables for Contributor
  const isDemoContributorEnabled = import.meta.env.VITE_ENABLE_DEMO_CONTRIBUTOR_AUTH !== 'false';
  const configuredContributorEmail = (import.meta.env.VITE_DEMO_CONTRIBUTOR_EMAIL as string) || 'contributor@meil.in';
  const configuredContributorPassword = (import.meta.env.VITE_DEMO_CONTRIBUTOR_PASSWORD as string) || 'Contributor@1234';

  // Read environment variables for Management
  const isDemoManagementEnabled = import.meta.env.VITE_ENABLE_DEMO_MANAGEMENT_AUTH !== 'false';
  const configuredManagementEmail = (import.meta.env.VITE_DEMO_MANAGEMENT_EMAIL as string) || 'management@meil.in';
  const configuredManagementPassword = (import.meta.env.VITE_DEMO_MANAGEMENT_PASSWORD as string) || 'Management@1234';

  // Read environment variables for Auditor / Assurer
  const isDemoAuditorEnabled = import.meta.env.VITE_ENABLE_DEMO_AUDITOR_AUTH !== 'false';
  const configuredAuditorEmail = (import.meta.env.VITE_DEMO_AUDITOR_EMAIL as string) || 'auditor@meil.in';
  const configuredAuditorPassword = (import.meta.env.VITE_DEMO_AUDITOR_PASSWORD as string) || 'Auditor@1234';

  const fillDemoAdminCredentials = () => {
    if (!isDemoAdminEnabled || !configuredAdminEmail || !configuredAdminPassword) {
      return null;
    }
    return {
      email: configuredAdminEmail,
      password: configuredAdminPassword,
    };
  };

  const fillDemoReviewerCredentials = () => {
    if (!isDemoReviewerEnabled || !configuredReviewerEmail || !configuredReviewerPassword) {
      return null;
    }
    return {
      email: configuredReviewerEmail,
      password: configuredReviewerPassword,
    };
  };

  const fillDemoContributorCredentials = () => {
    if (!isDemoContributorEnabled || !configuredContributorEmail || !configuredContributorPassword) {
      return null;
    }
    return {
      email: configuredContributorEmail,
      password: configuredContributorPassword,
    };
  };

  const fillDemoManagementCredentials = () => {
    if (!isDemoManagementEnabled || !configuredManagementEmail || !configuredManagementPassword) {
      return null;
    }
    return {
      email: configuredManagementEmail,
      password: configuredManagementPassword,
    };
  };

  const fillDemoAuditorCredentials = () => {
    if (!isDemoAuditorEnabled || !configuredAuditorEmail || !configuredAuditorPassword) {
      return null;
    }
    return {
      email: configuredAuditorEmail,
      password: configuredAuditorPassword,
    };
  };

  const getPortalCredentials = (role: PortalRole): PortalDemoCredential => {
    return ALL_DEMO_PORTAL_CREDENTIALS[role] || ALL_DEMO_PORTAL_CREDENTIALS['esg-admin'];
  };

  const loginDemoAdmin = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!isDemoAdminEnabled) {
      return {
        success: false,
        error: 'ESG Admin demo authentication is disabled. Backend integration will be connected in future phases.',
      };
    }

    const trimmedInputEmail = email.trim().toLowerCase();
    const targetEmail = configuredAdminEmail.trim().toLowerCase();

    const isPasswordValid = password === configuredAdminPassword || password === 'Admin@1234' || password === 'admin123';
    if (trimmedInputEmail === targetEmail && isPasswordValid) {
      const demoSessionData: DemoSession = {
        authenticated: true,
        role: 'esg_admin',
        mode: 'demo',
        loginTime: new Date().toISOString(),
        user: {
          name: 'Demo ESG Administrator',
          email: configuredAdminEmail,
        },
      };

      try {
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(demoSessionData));
        sessionStorage.setItem(LEGACY_ADMIN_KEY, JSON.stringify(demoSessionData));
      } catch (e) {
        console.error('Failed to write session to sessionStorage:', e);
      }

      setSession(demoSessionData);
      return { success: true };
    }

    return {
      success: false,
      error: 'Invalid ESG Admin credentials. Please check the email and password.',
    };
  };

  const loginDemoReviewer = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!isDemoReviewerEnabled) {
      return {
        success: false,
        error: 'Reviewer demo authentication is disabled. Backend integration will be connected in future phases.',
      };
    }

    const trimmedInputEmail = email.trim().toLowerCase();
    const targetEmail = configuredReviewerEmail.trim().toLowerCase();

    const isReviewerPassValid = password === configuredReviewerPassword || password === 'Reviewer@1234' || password === 'reviewer123';
    if (trimmedInputEmail === targetEmail && isReviewerPassValid) {
      const demoSessionData: DemoSession = {
        authenticated: true,
        role: 'reviewer',
        mode: 'demo',
        loginTime: new Date().toISOString(),
        user: {
          name: 'Demo Reviewer',
          email: configuredReviewerEmail,
        },
      };

      try {
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(demoSessionData));
        sessionStorage.removeItem(LEGACY_ADMIN_KEY);
      } catch (e) {
        console.error('Failed to write session to sessionStorage:', e);
      }

      setSession(demoSessionData);
      return { success: true };
    }

    return {
      success: false,
      error: 'Invalid Reviewer / Approver credentials. Please check the email and password.',
    };
  };

  const loginDemoContributor = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!isDemoContributorEnabled) {
      return {
        success: false,
        error: 'Data Contributor demo authentication is disabled. Backend integration will be connected in future phases.',
      };
    }

    const trimmedInputEmail = email.trim().toLowerCase();
    const targetEmail = configuredContributorEmail.trim().toLowerCase();
    const isContributorPassValid = password === configuredContributorPassword || password === 'Contributor@1234' || password === 'contributor123';
    const isContributorEmailMatch = trimmedInputEmail === targetEmail || trimmedInputEmail.endsWith('@meil.in');

    if (isContributorEmailMatch && isContributorPassValid) {
      const demoSessionData: DemoSession = {
        authenticated: true,
        role: 'contributor',
        mode: 'demo',
        loginTime: new Date().toISOString(),
        user: {
          name: 'Demo Contributor',
          email: trimmedInputEmail || configuredContributorEmail,
        },
      };

      try {
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(demoSessionData));
        sessionStorage.removeItem(LEGACY_ADMIN_KEY);
      } catch (e) {
        console.error('Failed to write session to sessionStorage:', e);
      }

      setSession(demoSessionData);
      return { success: true };
    }

    return {
      success: false,
      error: 'Invalid Data Contributor credentials. Please check the email and password.',
    };
  };

  const loginDemoManagement = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!isDemoManagementEnabled) {
      return {
        success: false,
        error: 'Management demo authentication is disabled. Backend integration will be connected in future phases.',
      };
    }

    const trimmedInputEmail = email.trim().toLowerCase();
    const targetEmail = configuredManagementEmail.trim().toLowerCase();
    const isMgmtPassValid = password === configuredManagementPassword || password === 'Management@1234' || password === 'management123';
    const isMgmtEmailMatch = trimmedInputEmail === targetEmail || trimmedInputEmail === 'cso@meil.in' || trimmedInputEmail.endsWith('@meil.in');

    if (isMgmtEmailMatch && isMgmtPassValid) {
      const demoSessionData: DemoSession = {
        authenticated: true,
        role: 'management',
        mode: 'demo',
        loginTime: new Date().toISOString(),
        user: {
          name: 'Demo Management User',
          email: configuredManagementEmail,
        },
      };

      try {
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(demoSessionData));
        sessionStorage.removeItem(LEGACY_ADMIN_KEY);
      } catch (e) {
        console.error('Failed to write session to sessionStorage:', e);
      }

      setSession(demoSessionData);
      return { success: true };
    }

    return {
      success: false,
      error: 'Invalid Management credentials. Please check the email and password.',
    };
  };

  const loginDemoAuditor = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!isDemoAuditorEnabled) {
      return {
        success: false,
        error: 'Auditor demo authentication is disabled. Backend integration will be connected in future phases.',
      };
    }

    const trimmedInputEmail = email.trim().toLowerCase();
    const targetEmail = configuredAuditorEmail.trim().toLowerCase();
    const isAuditorPassValid =
      password === configuredAuditorPassword ||
      password === 'Auditor@1234' ||
      password === 'auditor123' ||
      password === 'Admin@1234';

    const isAuditorEmailMatch =
      trimmedInputEmail === targetEmail ||
      trimmedInputEmail === 'auditor.brsr@deloitte-partner.com' ||
      trimmedInputEmail.includes('deloitte') ||
      trimmedInputEmail.endsWith('@meil.in');

    if (isAuditorEmailMatch && isAuditorPassValid) {
      const demoSessionData: DemoSession = {
        authenticated: true,
        role: 'auditor',
        mode: 'demo',
        loginTime: new Date().toISOString(),
        user: {
          name: 'Sanjay Deshmukh (Lead BRSR Assurer - Deloitte)',
          email: configuredAuditorEmail,
        },
      };

      try {
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(demoSessionData));
        sessionStorage.removeItem(LEGACY_ADMIN_KEY);
      } catch (e) {
        console.error('Failed to write session to sessionStorage:', e);
      }

      setSession(demoSessionData);
      return { success: true };
    }

    return {
      success: false,
      error: 'Invalid Auditor credentials. Please check the email and password (Demo: auditor@meil.in / Auditor@1234).',
    };
  };

  const logout = () => {
    try {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
      sessionStorage.removeItem(LEGACY_ADMIN_KEY);
    } catch {
      // Ignore
    }
    setSession(null);
  };

  return (
    <DemoAuthContext.Provider
      value={{
        session,
        isAuthenticated: Boolean(session?.authenticated),
        isAdminAuthenticated: Boolean(session?.authenticated && session?.role === 'esg_admin'),
        isReviewerAuthenticated: Boolean(session?.authenticated && session?.role === 'reviewer'),
        isContributorAuthenticated: Boolean(session?.authenticated && session?.role === 'contributor'),
        isManagementAuthenticated: Boolean(session?.authenticated && session?.role === 'management'),
        isAuditorAuthenticated: Boolean(session?.authenticated && session?.role === 'auditor'),
        userRole: session?.role || null,
        isDemoAdminEnabled,
        isDemoReviewerEnabled,
        isDemoContributorEnabled,
        isDemoManagementEnabled,
        isDemoAuditorEnabled,
        loginDemoAdmin,
        loginDemoReviewer,
        loginDemoContributor,
        loginDemoManagement,
        loginDemoAuditor,
        fillDemoAdminCredentials,
        fillDemoReviewerCredentials,
        fillDemoContributorCredentials,
        fillDemoManagementCredentials,
        fillDemoAuditorCredentials,
        getPortalCredentials,
        logout,
      }}
    >
      {children}
    </DemoAuthContext.Provider>
  );
};

export const useDemoAuth = (): DemoAuthContextType => {
  const context = useContext(DemoAuthContext);
  if (!context) {
    throw new Error('useDemoAuth must be used within a DemoAuthProvider');
  }
  return context;
};


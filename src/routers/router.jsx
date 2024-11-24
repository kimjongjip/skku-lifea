// Router: 각 URL에 따른 page 컴포넌트 연결
import { createBrowserRouter } from "react-router-dom";

import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import HtmlLoader from "../components/common/HtmlLoader";
import CertificationPage from "../pages/CertificationPage";
import PersonalCertificationPage from "../pages/PersonalCertificationPage";
import GroupMainPage from "../pages/GroupMainPage";
import PenaltyPage from "../pages/PenaltyPage";
import GroupMemberPage from "../pages/GroupMemberPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
    index: true,
  },
  {
    path: "/signup",
    element: <SignupPage />,
    index: true,
  },
  {
    path: "/certificate",
    element: <CertificationPage />,
    index: true,
  },
  {
    path: "/certificate/:id",
    element: <PersonalCertificationPage />,
  },
  {
    path: "/penalty",
    element: <PenaltyPage />,
    // index: true,
  },
  {
    path: "/main",
    element: <GroupMainPage />,
    // index: true,
  },
  {
    path: "/member/:id",
    element: <GroupMemberPage />,
    // index: true,
  },
]);

export default router;

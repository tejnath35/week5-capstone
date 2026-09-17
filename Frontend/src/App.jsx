import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";

const RootLayout = lazy(() => import("./components/RootLayout"));
const Register = lazy(() => import("./components/Register"));
const Login = lazy(() => import("./components/Login"));
const Home = lazy(() => import("./components/Home"));
const Articles = lazy(() => import("./components/Articles"));
const UserProfile = lazy(() => import("./components/UserProfile"));
const AuthorProfile = lazy(() => import("./components/AuthorProfile"));
const ArticleByID = lazy(() => import("./components/ArticleByID"));
const WriteArticle = lazy(() => import("./components/WriteArticle"));
const EditArticle = lazy(() => import("./components/EditArticleForm"));
const ForgotPassword = lazy(() => import("./components/ForgotPassword"));

function App() {
  const routerObj = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        {
          path: "",
          element: <Home />,
        },
        {
          path: "articles",
          element: <Articles />,
        },
        {
          path: "register",
          element: <Register />,
        },
        {
          path: "login",
          element: <Login />,
        },
        {
          path: "forgot-password",
          element: <ForgotPassword />,
        },
        {
          path: "user-profile",
          element: <UserProfile />,
        },
        {
          path: "author-profile",
          element: <AuthorProfile />,
        },
        {
          path: "article/:id",
          element: <ArticleByID />,
        },
        {
          path: "write-article",
          element: <WriteArticle />,
        },
        {
          path:"edit-article/:id",
          element:<EditArticle />
        }
      ],
    },
  ]);

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <p className="text-gray-500">Loading page…</p>
        </div>
      }
    >
      <Toaster position="top-center" reverseOrder={false} />
      <RouterProvider router={routerObj} />
    </Suspense>
  );
}

export default App;
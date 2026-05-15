import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import { Toaster } from "react-hot-toast";

const RootLayout = lazy(() => import("./components/RootLayout"));
const Register = lazy(() => import("./components/Register"));
const Login = lazy(() => import("./components/Login"));
const Home = lazy(() => import("./components/Home"));
const UserProfile = lazy(() => import("./components/UserProfile"));
const AuthorProfile = lazy(() => import("./components/AuthorProfile"));
const ArticleByID = lazy(() => import("./components/ArticleByID"));
const AuthorArticles = lazy(() => import("./components/AuthorArticles"));
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
          children: [
            {
              index: true,
              element: <AuthorArticles />,
            },
            {
              path: "articles",
              element: <AuthorArticles />,
            },
            {
              path: "write-article",
              element: <WriteArticle />,
            },
          ],
        },
        {
          path: "article/:id",
          element: <ArticleByID />,
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
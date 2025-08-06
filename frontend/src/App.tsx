import { Header } from "@/components/static/Header";
import  AuthPage  from "./pages/AuthPage";
import { useAuth } from "./context/AuthContext";
import { RecipesPage } from "./pages/recipesPage";
//import bgImage from "./img/ing.jpg"; // ← ייבוא התמונה מתוך src/img

function App() {
  const { user } = useAuth();

  return (
<div
  className="min-h-screen bg-repeat-y bg-top"
  style={{
    //backgroundImage: `url(${bgImage})`,
    backgroundSize: "cover",
    backgroundRepeat: "repeat-y",
    backgroundPosition: "top",
  }}
>




      <Header />
      <main className="p-6">
        {user ? <RecipesPage /> : <AuthPage />}
      </main>
    </div>
  );
}

export default App;

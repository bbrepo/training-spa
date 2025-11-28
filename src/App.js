import "./App.css";
import Home from "./Components/Home";
import About from "./Components/About";
import Work from "./Components/Work";
import CoursesAndFees from "./Components/CoursesAndFees";
import Courses from "./Components/Courses";
import Contact from "./Components/Contact";
import Footer from "./Components/Footer";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Home />
        <About/>
        <Work />
        <CoursesAndFees />
        <Courses />
        <Contact />
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;

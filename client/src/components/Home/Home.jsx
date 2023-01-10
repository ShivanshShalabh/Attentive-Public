import Landing from './Landing';
import About from './About';

// * Use: Home Component
// * Desc: Render the home page
// * Access: Public
// * Testing: Passed ✔ (09-04-2022)

const Home = () =>
  < div style={{ overflowX: "hidden" }}>
    <Landing />
    <About />
  </div>;


export default Home;

import Heading from './Heading';
import { Outlet } from 'react-router-dom';

const App = () => {
  return (
    <>
      <Heading />

      <main>
        <Outlet />
      </main>
    </>
  );
};

export default App;

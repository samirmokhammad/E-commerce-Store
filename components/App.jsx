import Heading from './Heading';
import { Outlet } from 'react-router-dom';

const App = () => {
  return (
    <>
      <Heading />

      <main>
        <article>
          <Outlet />
        </article>
      </main>
    </>
  );
};

export default App;

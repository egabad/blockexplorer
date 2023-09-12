import { BrowserRouter as Router, Link } from 'react-router-dom';
import { RenderRoutes } from './routes';

function App() {
  return (<div className="App">
    <Router>
      <RenderRoutes />
    </Router>
  </div>);
}

export default App;

import { BrowserRouter as Router } from 'react-router-dom';
import { RenderRoutes } from './routes';

function App() {
  return (<div className="App">
    <Router>
      <RenderRoutes />
    </Router>
  </div>);
}

export default App;

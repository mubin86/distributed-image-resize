import { Route, Switch } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';

const App = () => {
  return (
    <Layout>
      <Switch>
        <Route path='/' exact>
          <HomePage />
        </Route>
        
        {/* <Route path='/new-meetup'>
          <NewMeetupPage />
        </Route> */}
      </Switch>
    </Layout>
  );
}

export default App;
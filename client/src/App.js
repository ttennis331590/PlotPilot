
import {Columns, Container, Image} from 'react-bulma-components';
import Prompt from './Components/Prompt';
import UserResponse from './Components/UserResponse';



function App() {
  return (
      <Columns className={'is-centered'}>
        <Columns.Column size={10} mt={5}>
          <Prompt />
          <UserResponse />
        </Columns.Column>
      </Columns>
 );
}

export default App;

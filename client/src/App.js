
import './App.css';
import {Columns, Container, Image} from 'react-bulma-components';
import Prompt from './Components/Prompt';
import UserResponse from './Components/UserResponse';
import logo from './Images/2x/plotpilot_logo.png';


function App() {
  return (
    <Container>
      
      <Columns className={'is-centered'}>
      <Image src={logo} alt='PlotPilot Logo' className='logo' />
        <Columns.Column size={10} mt={5}>
          <Prompt />
          <UserResponse />
        </Columns.Column>
      </Columns>





    </Container> );
}

export default App;

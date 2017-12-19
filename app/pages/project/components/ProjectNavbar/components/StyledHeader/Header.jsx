import styled from 'styled-components';
import { pxToRem } from '../../styledHelpers';

const Header = styled.header`
  box-shadow: 0 ${pxToRem(2)} ${pxToRem(4)} 0 rgba(0,0,0,0.5);
  display: flex;
  flex-direction: row;
  justify-content: center;
  position: relative;
`;

export default Header;

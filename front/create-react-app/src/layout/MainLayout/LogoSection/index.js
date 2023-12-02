import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// material-ui
import { ButtonBase } from '@mui/material';

// project imports
import config from 'config';
import otherConfig from '../../../config';

import logo from '../../../assets/images/logo/logo.png';
// import Logo from 'ui-component/Logo';
import { MENU_OPEN } from 'store/actions';

// ==============================|| MAIN LOGO ||============================== //

const LogoSection = () => {
  const defaultId = useSelector((state) => state.customization.defaultId);
  const dispatch = useDispatch();
  return (
    <ButtonBase disableRipple onClick={() => dispatch({ type: MENU_OPEN, id: defaultId })} component={Link} to={config.defaultPath}>
      <img src={logo} alt={"logo"} width="33em"></img>
      <p style={{fontFamily: otherConfig.fontFamily, fontSize: "1.2em"}}><b>MUSE.on</b></p>
    </ButtonBase>
  );
};

export default LogoSection;

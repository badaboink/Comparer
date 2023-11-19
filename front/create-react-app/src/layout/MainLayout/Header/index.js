import PropTypes from 'prop-types';
import React, { useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar, Box, ButtonBase, Button, useMediaQuery, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

// project imports
import LogoSection from '../LogoSection';
// import SearchSection from './SearchSection';
import ProfileSection from './ProfileSection';
import NotificationSection from './NotificationSection';
import AuthLogin from '../../../views/pages/authentication/auth-forms/AuthLogin';

// assets
import { IconUser, IconMenu2 } from '@tabler/icons';
import { isLoggedIn } from 'views/logic';

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

const Header = ({ handleLeftDrawerToggle }) => {
  const theme = useTheme();
  const userIsLoggedIn = isLoggedIn();
  const [openModal, setOpenModal] = useState(false);

  const handleClick = () => {
    setOpenModal(true);
  };
  const handleClose = () => {
    setOpenModal(false);
  };
  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <>
      {/* logo & toggler button */}
      <Box
        sx={{
          width: 228,
          display: 'flex',
          [theme.breakpoints.down('md')]: {
            width: 'auto'
          }
        }}
      >
        <Box component="span" sx={{ display: { xs: 'none', md: 'block' }, flexGrow: 1 }}>
          <LogoSection />
        </Box>
        <ButtonBase sx={{ borderRadius: '12px', overflow: 'hidden' }}>
          <Avatar
            variant="rounded"
            sx={{
              ...theme.typography.commonAvatar,
              ...theme.typography.mediumAvatar,
              transition: 'all .2s ease-in-out',
              background: theme.palette.secondary.light,
              color: theme.palette.secondary.dark,
              '&:hover': {
                background: theme.palette.secondary.dark,
                color: theme.palette.secondary.light
              }
            }}
            onClick={handleLeftDrawerToggle}
            color="inherit"
          >
            <IconMenu2 stroke={1.5} size="1.3rem" />
          </Avatar>
        </ButtonBase>
      </Box>

      {/* header search */}
      {/* <SearchSection /> */}
      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ flexGrow: 1 }} />
      {!userIsLoggedIn &&
      <Button variant="contained" disableElevation endIcon={<IconUser stroke={1.5} />} color="secondary"
      onClick={handleClick}>
        Sign in
                </Button>
      }
      {/* notification & profile */}
      {userIsLoggedIn &&
      <NotificationSection />}
      {userIsLoggedIn &&
      <ProfileSection />}
      {!userIsLoggedIn &&
      <Dialog 
      open={openModal} 
      onClose={handleClose} >
        <center>
        <DialogTitle sx={{ marginTop: '3rem' }}>
          <Typography color={theme.palette.secondary.main} gutterBottom variant={matchDownSM ? 'h3' : 'h2'}>
            Hi, Welcome Back
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="caption" fontSize="16px" textAlign={matchDownSM ? 'center' : 'inherit'}>
                            Enter your credentials to continue
                          </Typography>
          <AuthLogin />
        </DialogContent>
        </center>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
          </Button>
        </DialogActions>
      </Dialog>
      }
    </>
  );
};

Header.propTypes = {
  handleLeftDrawerToggle: PropTypes.func
};

export default Header;

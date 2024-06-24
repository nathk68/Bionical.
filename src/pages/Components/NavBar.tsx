// src/components/NavBar.tsx
import React from 'react';
import { AppBar, Toolbar, Typography, Button, Link, Box, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NavBar: React.FC = () => {
    const navigate = useNavigate();

  return (
    <AppBar position="static" color="inherit" className="bg-white shadow-md" sx={{ boxShadow: 3 }}>
      <Toolbar>
        <Grid container alignItems="center" justifyContent="space-between">
          <Typography variant="h6" component="div" className="font-bold">Bionical.</Typography>
          <Grid item>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Button onClick={() => navigate('/')}>
                    Convertisseur
                </Button>
                <Button onClick={() => navigate('/')}>
                    Bionical Pro
                </Button>
                <Button onClick={() => navigate('/')}>
                    Pourquoi Bionical ?
                </Button>
            </Box>
          </Grid>
          <Grid item>
            <Button variant="contained" color="primary">Connexion</Button>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;

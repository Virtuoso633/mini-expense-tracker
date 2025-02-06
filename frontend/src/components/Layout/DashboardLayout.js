import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CssBaseline,
  Divider,
  Avatar,
  useTheme
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  AddCircle as AddIcon,
  Assessment as AssessmentIcon,
  Logout as LogoutIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
//import { useTheme as usetheme } from '@mui/material/styles';
import { useTheme as useAppTheme } from '../../contexts/ThemeContext';


const drawerWidth = 240;

const DashboardLayout = ({ children }) => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const { mode, toggleTheme } = useAppTheme();
    
    // // Use theme in your styles
    // const drawerStyles = {
    //     paper: {
    //     backgroundColor: theme.palette.background.default,
    //     color: theme.palette.text.primary
    //     }
    // };

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const menuItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
        { text: 'Add Expense', icon: <AddIcon />, path: '/dashboard/add' },
        { text: 'Analytics', icon: <AssessmentIcon />, path: '/dashboard/analytics' }
    ];

    const drawer = (
        <Box>
            <Toolbar>
                <Typography variant="h6" noWrap component="div">
                    Expense Tracker
                </Typography>
            </Toolbar>
            <Divider />
            <List>
                {menuItems.map((item) => (
                    <ListItem 
                        button 
                        key={item.text}
                        onClick={() => {
                            navigate(item.path);
                            setMobileOpen(false);
                        }}
                        selected={location.pathname === item.path}
                        sx={{
                            '&.Mui-selected': {
                                backgroundColor: 'primary.main',
                                color: 'primary.contrastText',
                                '& .MuiListItemIcon-root': {
                                    color: 'primary.contrastText',
                                },
                                '&:hover': {
                                    backgroundColor: 'primary.dark',
                                },
                            },
                        }}
                    >
                        <ListItemIcon 
                            sx={{
                                color: location.pathname === item.path ? 
                                    'primary.contrastText' : 'inherit'
                            }}
                        >
                            {item.icon}
                        </ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Box sx={{ flexGrow: 1 }} />
                    <IconButton color="inherit" onClick={toggleTheme}>
                        {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
                    </IconButton>
                    <IconButton color="inherit" onClick={handleLogout}>
                        <LogoutIcon />
                    </IconButton>
                    <Avatar sx={{ ml: 1 }}>
                        {user?.firstName?.charAt(0)}
                    </Avatar>
                </Toolbar>
            </AppBar>

            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    mt: 8
                }}
            >
                {children}
            </Box>
        </Box>
    );
};

export default DashboardLayout;

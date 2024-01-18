import React, { createContext, useContext, useState } from 'react';
import AuthService from './Auth.service';

import { useNavigation } from '@react-navigation/native';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigation = useNavigation();
    const handleLogout = async () => {
        await AuthService.logout();
        navigation.navigate('Главная')
        setIsLoggedIn(false);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);    
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

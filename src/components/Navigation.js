import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Barcode from '../screens/Barcode';
import Products from '../screens/Products';
import { Ionicons } from '@expo/vector-icons'; 


const Tab = createBottomTabNavigator();

const Navigation = () => {
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                      let iconName;
          
                    if (route.name === 'Barcode') {
                        iconName = focused ? 'md-scan-circle-sharp' : 'md-scan-circle-outline';
                    } else if (route.name === 'Products') {
                        iconName = focused ? 'ios-fast-food-sharp' : 'ios-fast-food-outline';
                    }
          
                      return <Ionicons name={iconName} size={size} color={color} />;
                    },
                  })}
            >
                <Tab.Screen 
                    name='Barcode'
                    component={Barcode}
                />
                <Tab.Screen 
                    name='Products'
                    component={Products}
                />
            </Tab.Navigator>
        </NavigationContainer>
    )
}

export default Navigation;
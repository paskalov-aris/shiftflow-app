import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createStaticNavigation } from '@react-navigation/native';
import { useAuthStore } from '../stores/authStore';
import { BottomTabs } from './BottomTabsNavigator/BottomTabsNavigator';
import LoginScreen from '../screens/LoginScreen/LoginScreen';

const useIsSignedIn = () => !!useAuthStore(state => state.user);
const useIsSignedOut = () => !useAuthStore(state => state.user);

const RootStack = createNativeStackNavigator({
  screenOptions: { headerShown: false },
  screens: {
    Login: {
      screen: LoginScreen,
      if: useIsSignedOut,
    },
    Main: {
      screen: BottomTabs,
      if: useIsSignedIn,
    },
  },
});

const RootNavigation = createStaticNavigation(RootStack);

export default RootNavigation;

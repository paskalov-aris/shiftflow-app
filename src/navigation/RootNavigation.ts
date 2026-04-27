import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createStaticNavigation } from '@react-navigation/native';
import { BottomTabs } from './BottomTabsNavigator/BottomTabsNavigator';

const RootStack = createNativeStackNavigator({
  screens: {
    BottomTabs: {
      screen: BottomTabs,
      options: {
        headerShown: false,
      },
    },
  },
});

const RootNavigation = createStaticNavigation(RootStack);

export default RootNavigation;

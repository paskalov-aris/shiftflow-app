import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import OverviewScreen from '../../screens/OverviewScreen/OverviewScreen';
import ScheduleScreen from '../../screens/ScheduleScreen/ScheduleScreen';
import TasksScreen from '../../screens/TasksScreen/TasksScreen';
import ManagementScreen from '../../screens/ManagementScreen/ManagementScreen';
import ProfileScreen from '../../screens/ProfileScreen/ProfileScreen';
import { CalendarIcon, HomeIcon, ProfileIcon, SettingsIcon, TasksIcon } from '../../assets';

export const BottomTabs = createBottomTabNavigator({
  screenOptions: {
    headerShown: false,
  },
  screens: {
    Overview: {
      screen: OverviewScreen,
      options: {
        title: 'Огляд',
        tabBarIcon: ({ color, size }) => {
          return <HomeIcon width={size} height={size} color={color} />;
        },
      },
    },
    Schedule: {
      screen: ScheduleScreen,
      options: {
        title: 'Графік',
        tabBarIcon: ({ color, size }) => {
          return <CalendarIcon width={size} height={size} color={color} />;
        },
      },
    },
    Tasks: {
      screen: TasksScreen,
      options: {
        title: 'Задачі',
        tabBarIcon: ({ color, size }) => {
          return <TasksIcon width={size} height={size} color={color} />;
        },
      },
    },
    Management: {
      screen: ManagementScreen,
      options: {
        title: 'Керування',
        tabBarIcon: ({ color, size }) => {
          return <SettingsIcon width={size} height={size} color={color} />;
        },
      },
    },
    Profile: {
      screen: ProfileScreen,
      options: {
        title: 'Профіль',
        tabBarIcon: ({ color, size }) => {
          return <ProfileIcon width={size} height={size} color={color} />;
        },
      },
    },
  },
});

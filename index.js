import { AppRegistry } from 'react-native';
import { App } from '@/app/App';
import { registerBackgroundNotificationHandler } from '@/services/notifications';
import { name as appName } from './app.json';

registerBackgroundNotificationHandler();

AppRegistry.registerComponent(appName, () => App);

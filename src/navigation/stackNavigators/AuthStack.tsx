import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SignInScreen } from '@/features/auth/screens/SignInScreen';
import { ROUTES } from '@/navigation/routes';
import type { AuthStackParamList } from '@/navigation/types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={ROUTES.SIGN_IN} component={SignInScreen} />
    </Stack.Navigator>
  );
}

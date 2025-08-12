import { Stack} from "expo-router";

export default function AppLayout() {
  

  // useEffect(() => {
  //   if(action==='create'){
  //     router.push('/(app)/(tabs)/index?action=create&source=external&videoId='+youtubeUrl);
  //   }
  // }, [action, source, youtubeUrl]);

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false, animation: "none" }} />
      <Stack.Screen name="settings/settings" />
      <Stack.Screen name="recipe/create" />
    </Stack>
  );
}

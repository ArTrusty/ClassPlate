import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function Layout() {
  return (
    <Tabs screenOptions={{
      headerShown:true,
      tabBarActiveTintColor:"#195c42",
      tabBarInactiveTintColor:"#aaa",
      tabBarStyle:{ backgroundColor:"#fff", height:65, paddingBottom:8 }
    }}>
      
      <Tabs.Screen
        name="home"
        options={{
          title:"Home",
          tabBarIcon:({color})=> <Ionicons name="home" color={color} size={24} />
        }}
      />

      <Tabs.Screen
        name="suggested"
        options={{
          title:"Suggested",
          tabBarIcon:({color})=> <Ionicons name="sparkles" color={color} size={23} />
        }}
      />

      <Tabs.Screen
        name="duos"
        options={{
          title:"Duos",
          tabBarIcon:({color})=> <Ionicons name="people" color={color} size={24} />
        }}
      />

      <Tabs.Screen
        name="chats"
        options={{
          title:"Chats",
          tabBarIcon:({color})=> <Ionicons name="chatbubbles" color={color} size={23} />
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title:"Profile",
          tabBarIcon:({color})=> <Ionicons name="person-circle" color={color} size={25} />
        }}
      />

    </Tabs>
  );
}

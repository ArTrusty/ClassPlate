import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { useCallback, useState } from "react";
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { db } from "./firebaseConfig";

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      async function loadUser() {
        const userId = await AsyncStorage.getItem("userId");

        if (!userId) {
          setLoading(false);              // should stop loading if there is no user
          return router.replace("/");
        }

        const snap = await getDoc(doc(db, "users", userId));
        if (snap.exists()) setUser(snap.data());

        setLoading(false);                // should stop loading after user is retrieved
      }
      loadUser();
    }, [])
  );

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 120 }} />;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Your Profile</Text>

      {user?.picture ? (
        <Image source={{ uri: user.picture }} style={styles.avatar} />
      ) : <View style={[styles.avatar,{backgroundColor:"#ccc"}]} />}

      <View style={styles.card}>
        <Text style={styles.title}>{user?.name}</Text>
        <Text>{user?.email}</Text>
      </View>

      <View style={styles.card}>
        <Text>Major: {user?.major}</Text>
        <Text>Year: {user?.year}</Text>
      </View>

      <View style={styles.card}>
        <Text>Lunch Preference: {user?.lunchVibe}</Text>
        <Text>Cafe Order: {user?.cafeOrder}</Text>
        <Text>Dietary Restrictions: {user?.dietaryRestrictions}</Text>
        <Text>Fun Fact: {user?.funfact}</Text>
        <Text>Would rather: {user?.preferredActivity}</Text>
        <Text>Spotify: {user?.spotify}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={()=>router.push("/survey")}>
        <Text style={styles.buttonText}>Edit Survey</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:{ flexGrow:1,padding:20,backgroundColor:"#faf7ee",alignItems:"center" },
  header:{ fontSize:28,fontWeight:"bold",marginBottom:20,color:"#195c42" },
  avatar:{ width:140,height:140,borderRadius:70,marginBottom:20 },
  card:{ width:"100%",backgroundColor:"#fff",padding:18,borderRadius:12,marginBottom:15,borderWidth:1,borderColor:"#eee" },
  title:{ fontSize:22,fontWeight:"bold",marginBottom:4 },
  button:{ backgroundColor:"#ffbe0b",padding:15,borderRadius:10,width:"100%",alignItems:"center",marginTop:15 },
  buttonText:{ fontSize:18,fontWeight:"bold" }
});



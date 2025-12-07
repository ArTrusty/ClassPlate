import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { db } from "../firebaseConfig";
 
interface UserProfile {
  name: string;
  email: string;
  major?: string;
  year?: string;
  lunchVibe?: string;
  socialLevel?: number;
  picture?: string;
  cafeOrder?: string;
  dietaryRestrictions?: string;
  funfact?: string;
  preferredActivity?: string;
  spotify?: string;
  
}

export default function OtherProfile() {
  const router = useRouter();
  const { id } = useLocalSearchParams();      // user id of selected user
  const [user, setUser] = useState<UserProfile | null>(null);

  // Loads correct user whenev the id  changes
  useEffect(() => {
    async function fetchUser() {
      if (!id) return;
      const snap = await getDoc(doc(db, "users", id as string));
      if (snap.exists()) setUser(snap.data() as UserProfile);
    }
    fetchUser();
  }, [id]);

  if (!user) return <Text>Loading your profile</Text>;

  return (
    <View style={styles.container}>
      
      {user.picture ? (
        <Image source={{ uri: user.picture }} style={styles.avatar} />
      ) : (
        <View style={[styles.avatar,{ backgroundColor:"#ccc" }]} />
      )}

      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.sub}>{user.major} | {user.year}</Text>
      <Text style={styles.bio}>Lunch Vibe: {user.lunchVibe}</Text>
      <Text style={styles.bio}>Cafe Order: {user.cafeOrder}</Text>
      <Text style={styles.bio}>Social Level: {user.socialLevel}/5</Text>
      <Text style={styles.bio}>Fun Fact: {user.funfact}</Text>
      <Text style={styles.bio}>Would rather: {user.preferredActivity}</Text>
      <Text style={styles.bio}>Spotify: {user.spotify}</Text>
      

      
    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,alignItems:"center",paddingTop:40,backgroundColor:"#faf7ee"},
  avatar:{width:140,height:140,borderRadius:70,marginBottom:15},
  name:{fontSize:28,fontWeight:"bold",marginBottom:6},
  sub:{fontSize:16,color:"#555"},
  bio:{fontSize:15,marginTop:6},
  button:{marginTop:25,backgroundColor:"#195c42",padding:14,borderRadius:10,width:"70%",alignItems:"center"},
  buttonText:{color:"#fff",fontWeight:"bold",fontSize:17}
});


// app/duos.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { db } from "./firebaseConfig";

export default function Duos() {
  const router = useRouter();
  const [duos, setDuos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDuos() {
      const uid = await AsyncStorage.getItem("userId");
      if (!uid) return router.replace("/");
      // get duos that include current user
      const q = query(collection(db, "duos"), where("users", "array-contains", uid));
      const snap = await getDocs(q);

      const duoList = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setDuos(duoList);
      setLoading(false);

      console.log(" Loaded duos:", duoList);
    }
    loadDuos();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading matches...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Your Duos </Text>

      {duos.length === 0 ? (
        <Text style={{ textAlign: "center", marginTop: 20 }}>
          No duos. Go accept a match first!
        </Text>
      ) : (
        duos.map(duo => (
          <View key={duo.id} style={styles.card}>
            <Text style={styles.title}>Duo Match</Text>

            <Text style={styles.usersList}>
              {duo.users.join(" & ")}
            </Text>

            
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:{ padding:20, backgroundColor:"#faf7ee" },
  center:{ flex:1, justifyContent:"center", alignItems:"center" },
  header:{ fontSize:26, fontWeight:"bold", marginBottom:15, color:"#195c42" },
  card:{ backgroundColor:"#fff", padding:15, borderRadius:10, marginBottom:10, borderWidth:1, borderColor:"#eee" },
  title:{ fontSize:18, fontWeight:"600" },
  usersList:{ color:"#444", marginVertical:5 },
  button:{ backgroundColor:"#195c42", padding:10, borderRadius:8, marginTop:5, alignItems:"center" },
  buttonText:{ color:"#fff", fontWeight:"bold" }
});

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { addDoc, collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { db } from "./firebaseConfig";
import { getMatches } from "./utils/matchUsers";
export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [duos, setDuos] = useState<any[]>([]);
  const [requested, setRequested] = useState<string[]>([]);

  useEffect(() => {
    async function load() {
      const uid = await AsyncStorage.getItem("userId");
      if (!uid) return router.replace("/");

      // gets the logged in user
      const snap = await getDoc(doc(db, "users", uid));
      const currentUser = snap.data();
      setUser(currentUser);

      // gets the match suggestions
      const matches = await getMatches(currentUser);
      setSuggestions(matches);

      // loads the existing duos of current user
      const q = query(collection(db, "duos"), where("users", "array-contains", uid));
      const duoSnap = await getDocs(q);
      const duoList = duoSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      setDuos(duoList);
    }
    load();
  }, []);

  // Sends a duo request to someone else
  async function sendDuoRequest(targetId: string) {
    try {
      const uid = await AsyncStorage.getItem("userId");
      if (!uid) return router.replace("/");
      if (uid === targetId) {
        alert("error, cannot send a request to yourself.");
        return;
      }

      // makes a request document in duoRequests
      await addDoc(collection(db, "duoRequests"), {
        from: uid,
        to: targetId,
        status: "pending",
        createdAt: Date.now()
      });

      alert("Duo request sent.");
      console.log("Duo request created for:", targetId);
    } catch (e) {
      console.error("Failed to send duo request:", e);
      alert("Unable to send duo request.");
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      <Text style={styles.header}>
         Are you duo ready, {user?.name?.split(" ")[0]} ?
      </Text>

      {/* Updates */}
      <View style={styles.block}>
        <Text style={styles.title}>Updates</Text>
        <Text style={styles.item}>• No new messages</Text>
        <Text style={styles.item}>• No pending duo requests</Text>
        <Text style={styles.item}>• Your profile is filled out</Text>

        <Text style={styles.link} onPress={() => router.push("/duos")}>
          View duos 
        </Text>
      </View>

      {/* suggested duos */}
      <View style={styles.block}>
        <Text style={styles.title}>Suggested Duos</Text>

        {suggestions.length === 0 ? (
          <Text style={styles.item}>No matches yet. Update survey to get matched.</Text>
        ) : (
          suggestions.map(p => (
            <View key={p.id} style={styles.suggestCard}>
              {p.picture ? (
                <Image source={{ uri: p.picture }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatar, { backgroundColor: "#ccc" }]} />
              )}

              <View style={styles.suggestContent}>
                <Text style={styles.suggestName}>{p.name}</Text>
                <Text style={styles.suggestSub}>{p.major} • {p.year}</Text>
                <Text style={styles.suggestScore}>Match Score: {p.score}</Text>

                <TouchableOpacity onPress={() => router.push(`/profile/${p.id}`)}>
                  <Text style={styles.profileLink}>View Profile →</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, { marginTop: 8 }]}
                  onPress={() => {
                    if (!requested.includes(p.id)) {
                      sendDuoRequest(p.id);
                      setRequested(prev => [...prev, p.id]);
                    } else {
                      alert('Request already sent');
                    }
                  }}
                >
                  <Text style={{ color: '#fff', fontWeight: 'bold' }}>{requested.includes(p.id) ? 'Request Sent' : 'Request Duo'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </View>

      {/* duos */}
      <View style={styles.block}>
        <Text style={styles.title}>Your Duos</Text>

        {duos.length === 0 ? (
          <Text style={styles.item}>No duos yet. Don't be solo, accept a match!</Text>
        ) : (
          duos.map(d => (
            <View key={d.id} style={styles.suggestCard}>
              <Text style={styles.suggestName}>Duos found</Text>
              <Text style={styles.suggestSub}>{d.users.join(" & ")}</Text>

              <TouchableOpacity onPress={() => router.push(`/chatRoom?duo=${d.id}`)}>
                <Text style={styles.profileLink}>Open Chat →</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 22, backgroundColor: "#faf7ee" },
  header: { fontSize: 28, fontWeight: "bold", color: "#195c42", marginBottom: 20 },
  block: { backgroundColor: "#fff", padding: 18, borderRadius: 12, marginBottom: 18, borderWidth: 1, borderColor: "#eee" },
  title: { fontSize: 20, fontWeight: "600", marginBottom: 8 },
  item: { color: "#444", marginBottom: 5 },
  link: { color: "#195c42", fontWeight: "700", marginTop: 10 },

  suggestCard: { backgroundColor: "#fdfdfd", padding: 12, borderRadius: 10, marginBottom: 10, borderWidth: 1, borderColor: "#e6e6e6" },
  suggestName: { fontSize: 18, fontWeight: "700" },
  suggestSub: { color: "#666" },
  suggestScore: { color: "#195c42", marginTop: 5, fontWeight:"600"},
  profileLink: { color:"#195c42", marginTop:5, fontWeight:"700" },
  button: { backgroundColor: "#195c42", padding: 10, borderRadius: 8, alignItems: "center", marginTop: 6 }
  ,
  avatar: { width: 64, height: 64, borderRadius: 32, marginRight: 12 },
  suggestContent: { flex: 1 }
});




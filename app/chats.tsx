import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { db } from "./firebaseConfig";

export default function Chats() {
  const router = useRouter();
  const [duos, setDuos] = useState<any[]>([]);

  useEffect(() => {
    async function loadChats() {
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) return;

      const q = query(collection(db,"duos"), where("users", "array-contains", userId));
      const snap = await getDocs(q);

      const list:any = [];
      snap.forEach(d => list.push({id:d.id, ...d.data()}));

      setDuos(list);
    }
    loadChats();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Chats</Text>

      {duos.length === 0 &&
        <Text>No chats yet.</Text>
      }

      <FlatList
        data={duos}
        keyExtractor={item=>item.id}
        renderItem={({item}) => (
          <TouchableOpacity 
            style={styles.chatItem} 
            onPress={() => router.push(`/chatRoom?duo=${item.id}`)}
          >
            <Text style={styles.name}>Chat with Duo {item.id}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,padding:20,backgroundColor:"#faf7ee"},
  header:{fontSize:26,fontWeight:"bold",marginBottom:10},
  chatItem:{padding:15,backgroundColor:"#fff",marginBottom:10,borderRadius:10},
  name:{fontSize:16,fontWeight:"500"}
});

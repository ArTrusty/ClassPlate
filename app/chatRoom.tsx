import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";
import { addDoc, collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { db } from "./firebaseConfig";

export default function ChatRoom() {
  const { duo } = useLocalSearchParams(); // duo chat id
  const [text, setText] = useState("");
  // message organization
  interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: number;
}
// store messages
const [messages, setMessages] = useState<Message[]>([]);


  useEffect(()=>{
    // live updates and order by timestamp
    const ref = collection(db,"messages", String(duo),"chat");
    const q = query(ref, orderBy("timestamp","asc"));
    const unsub = onSnapshot(q, snapshot=>{
      const list:any=[];
      snapshot.forEach(d => list.push({id:d.id, ...d.data()}));
      setMessages(list);
    });
    return ()=>unsub();
  },[]);
  // send message to firestore
  async function sendMessage(){
    if(!text.trim()) return;
    const userId = await AsyncStorage.getItem("userId");

    await addDoc(collection(db,"messages", String(duo),"chat"),{
      senderId:userId,
      text,
      timestamp:Date.now()
    });

    setText(""); 
  }

  return (
    <View style={styles.container}>
      {/* message list */}
      <FlatList
        data={messages}
        keyExtractor={i=>i.id}
        renderItem={({item})=>(
          <Text style={item.senderId === "you" ? styles.me : styles.them}>
            {item.text}
          </Text>
        )}
      />

      {/* message input */}
      <View style={styles.row}>
        <TextInput 
          style={styles.input}
          placeholder="Message..."
          value={text}
          onChangeText={setText}
        />

        <TouchableOpacity style={styles.send} onPress={sendMessage}>
          <Text style={{color:"white",fontWeight:"bold"}}>→</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,padding:15,backgroundColor:"#faf7ee"},
  row:{flexDirection:"row",alignItems:"center",marginTop:10},
  input:{flex:1,backgroundColor:"#fff",padding:12,borderRadius:8},
  send:{backgroundColor:"#195c42",padding:14,borderRadius:8,marginLeft:10},
  me:{alignSelf:"flex-end",padding:10,backgroundColor:"#195c42",color:"white",borderRadius:10,marginVertical:4},
  them:{alignSelf:"flex-start",padding:10,backgroundColor:"#ddd",borderRadius:10,marginVertical:4},
});

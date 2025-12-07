import AsyncStorage from "@react-native-async-storage/async-storage";
import Slider from "@react-native-community/slider";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { db } from "./firebaseConfig"; // .. for when inside app folder

export default function Survey() {
  const router = useRouter();

  
  const [major, setMajor] = useState("");
  const [year, setYear] = useState("");
  const [preference, setPreference] = useState("");
  const [socialLevel, setSocialLevel] = useState(3);

  //  submit 
const handleSubmit = async () => {
  if (!major || !year || !preference) {
    alert("Please fill out all required fields.");
    return;
  }

  const userId = await AsyncStorage.getItem("userId");
  if (!userId) {
    alert("we didn't find you. Log in again.");
    return router.replace("/");
  }

  // save full survey for reference
  await setDoc(doc(db, "surveyResponses", userId), {
    major,
    year,
    preference,
    socialLevel,
    updatedAt: Date.now()
  }, { merge: true });

  //  updates main profile directly
  await setDoc(doc(db, "users", userId), {
    major,
    year,
    preference,
    socialLevel,
  }, { merge: true });

  alert("Survey submitted and profile updated. ");
  router.replace("/home");
};




  return (
    <View style={styles.container}>
      <Text style={styles.title}>ClassPlate Survey</Text>
      

      {/* major */}
      <Text style={styles.label}>Major</Text>
      <TextInput 
        style={styles.input}
        placeholder="Computer Engineering..."
        value={major}
        onChangeText={setMajor}
      />
      
      {/* year */}
      <Text style={styles.label}>Year</Text>
      <Picker
        selectedValue={year}
        style={styles.picker}
        onValueChange={(item) => setYear(item)}
      >
        <Picker.Item label="Select year" value="" />
        <Picker.Item label="Freshman" value="Freshman" />
        <Picker.Item label="Sophomore" value="Sophomore" />
        <Picker.Item label="Junior" value="Junior" />
        <Picker.Item label="Senior" value="Senior" />
        <Picker.Item label="Graduate" value="Graduate" />
      </Picker>

      {/* preference */}
      <Text style={styles.label}> I prefer... </Text>
      <Picker
        selectedValue={preference}
        style={styles.picker}
        onValueChange={(item) => setPreference(item)}
      >
        <Picker.Item label="deep conversations" value="deep" />
        <Picker.Item label="study lunch " value="friends" />
        <Picker.Item label="Networking and career chat" value="networking" />
        <Picker.Item label="chill/go with the flow" value="chill" />

      </Picker>

      {/* slider */}
      <Text style={styles.label}>on a scale from (1)introvert to (5)extrovert, where are you?</Text>
      <Slider
        style={{ width: "90%" }}
        minimumValue={1}
        maximumValue= {5}
        step={1}
        value={socialLevel}
        onValueChange={setSocialLevel}
      />
      <Text>Level: {socialLevel}/5</Text>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit Survey</Text>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:"#faf7ee", padding:25 },
  title:{ fontSize:32, fontWeight:"bold", color:"#195c42", alignSelf:"center", marginTop:15 },
  subtitle:{ alignSelf:"center", marginBottom:20, color:"#555" },
  label:{ marginTop:10, fontWeight:"600" },
  input:{ backgroundColor:"#fff", borderRadius:8, padding:10, borderWidth:1, marginBottom:10 },
  picker:{ backgroundColor:"#fff", borderRadius:8, marginBottom:10 },
  button:{ backgroundColor:"#ffbe0b", padding:15, borderRadius:8, marginTop:20, alignItems:"center" },
  buttonText:{ fontSize:18, fontWeight:"bold" },
});


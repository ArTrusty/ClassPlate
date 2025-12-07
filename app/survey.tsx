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
  const [lunchvibe, setLunchvibe] = useState("");
  const [socialLevel, setSocialLevel] = useState(3);
  const [cafeOrder, setCafeOrder] = useState("");
  const [quote, setQuote] = useState("");
 
  const[dietaryRestrictions, setDietaryRestrictions] = useState("");
  const[funfact, setFunfact] = useState("");
  const[ratherfun, setRatherfun] = useState("");
  const[spotify, setSpotify] = useState("");
  //  submit 
const handleSubmit = async () => {
  if (!major || !year || !lunchvibe || !cafeOrder || !quote || !dietaryRestrictions || !funfact || !ratherfun || !spotify) {
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
    lunchvibe,
    socialLevel,
    cafeOrder,
    quote,
    dietaryRestrictions,
    funfact,
    ratherfun,
    spotify,
    updatedAt: Date.now()
  }, { merge: true });

  //  updates main profile directly
  await setDoc(doc(db, "users", userId), {
    major,
    year,
    lunchvibe,
    cafeOrder,
    quote,
    dietaryRestrictions,
    funfact,
    ratherfun,
    spotify,
    
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

      {/* lunch type */}
      <Text style={styles.label}> I prefer... </Text>
      <Picker
        selectedValue={lunchvibe}
        style={styles.picker}
        onValueChange={(item) => setLunchvibe(item)}
      >
        <Picker.Item label="Deep conversations" value="deep conversations" />
        <Picker.Item label="Study lunch " value="study lunch" />
        <Picker.Item label="Networking and career chat" value="networking" />
        <Picker.Item label="Chill/go with the flow" value="casual chat" />

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
      {/* cafe order */}
      <Text style={styles.label}>Leo/Pride order</Text>
      <TextInput 
        style={styles.input}
        placeholder="black coffee"
        value={cafeOrder}
        onChangeText={setCafeOrder}
      />
      {/* quote */}
      <Text style={styles.label}>Favorite Quote</Text>
      <TextInput
        style={styles.input}
        placeholder="To be or not to be..."
        value={quote}
        onChangeText={setQuote}
      />
      {/* dietary restrictions */}
      <Text style={styles.label}>Dietary Restrictions</Text>
      <Picker
        selectedValue={dietaryRestrictions}
        style={styles.input}
        onValueChange={(item) => setDietaryRestrictions(item)}
        >
          <Picker.Item label="Vegan" value="Vegan" />
          <Picker.Item label="Vegetarian" value="Vegetarian" />
          <Picker.Item label="Meat Eater" value="Meat Eater" />
          <Picker.Item label="Pescatarian" value="Pescatarian" />
        </Picker>
      {/* Fun fact */}
      <Text style={styles.label}>Fun fact</Text>
      <TextInput 
        style={styles.input}
        placeholder="I have three cats"
        value={funfact}
        onChangeText={setFunfact}
      />

      <Text style={styles.label}>I would have more fun with</Text>
      <Picker
        selectedValue={ratherfun}
        style={styles.input}
        onValueChange={(item) => setRatherfun(item)}
        >
          <Picker.Item label="Shopping" value="Shopping" />
          <Picker.Item label="Baking" value="Baking" />
          <Picker.Item label="Traveling" value="Traveling" />
          <Picker.Item label="Quiet reading with a friend" value="Reading" />
        </Picker>
      <Text style={styles.label}>Spotify Playlist Link</Text>
      <TextInput 
        style={styles.input}
        placeholder="https://open.spotify.com/playlist..."
        value={spotify}
        onChangeText={setSpotify}
      />

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



import AsyncStorage from "@react-native-async-storage/async-storage";
import * as WebBrowser from "expo-web-browser";
WebBrowser.maybeCompleteAuthSession();

import { makeRedirectUri } from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";
import { useRouter } from "expo-router";
import { doc, getDoc, setDoc } from "firebase/firestore";
import React, { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { db } from "./firebaseConfig";

// logins / creates user profile
function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(decodeURIComponent(atob(base64).split('').map(c =>
      '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    ).join('')));
  } catch {
    return null;
  }
}

export default function Index() {

  const router = useRouter();
  const redirectUri = makeRedirectUri({ useProxy: true } as any);

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: "428729393610-euplovhsfeiajdnkto08ok38ulp05b0b.apps.googleusercontent.com", // created in google cloud
    androidClientId: "428729393610-eh6so526qsjdve3ih7109qq1v5jhaqtc.apps.googleusercontent.com",
    responseType: "id_token",
    scopes: ["openid", "profile", "email"],
    redirectUri,
  });

  // creates user profile
  useEffect(() => {
    async function handleLogin() {

      if (response?.type !== "success") return;

      let idToken = (response as any).authentication?.idToken;

      // If token not provided normally, this tries fallback from URL instead
      if (!idToken && (response as any).url) {
        const url = (response as any).url;
        const params = new URLSearchParams(url.split(/[#?]/)[1] || "");
        idToken = params.get("id_token") || params.get("idToken");
      }

      if (!idToken) {
        alert("Login succeeded but no token was received.");
        return;
      }

      const data = parseJwt(idToken);

      const userEmail = data?.email;
      const userName = data?.name || data?.given_name;
      const userPicture = data?.picture;
      const userId = data?.sub; // Google UID is used as doc ID

      // stops external emails
      if (!userEmail?.toLowerCase().endsWith("@pnw.edu")) {
        alert("a PNW email is required.");
        return;
      }

      // saves user id for later
      await AsyncStorage.setItem("userId", userId);
      console.log("Saved userId locally:", userId);

      // changes firestore user profile info
      const userRef = doc(db, "users", userId);
      const snap = await getDoc(userRef);

      if (!snap.exists()) {
        await setDoc(userRef, {
          email: userEmail,
          name: userName,
          picture: userPicture ?? null,
          createdAt: Date.now(),
        });
        console.log(" New student created");
      } else {
        console.log("student already exists");
      }

      router.replace("/survey");
    }

    handleLogin();

  }, [response]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ClassPlate</Text>
      <Text style={styles.subtitle}>Community, it's what's with lunch</Text>

      {/* debugs nav */}
      <TouchableOpacity onPress={() => router.push("/survey")}>
        <Text style={{ color:"blue", marginTop:20 }}>Test Go To Survey</Text>
      </TouchableOpacity>

      {/* google Login */}
      <TouchableOpacity style={styles.button} onPress={() => promptAsync()} disabled={!request}>
        <Text style={styles.buttonText}>Sign in with Google</Text>
      </TouchableOpacity>
    </View>
  );
}

// design
const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:"#faf7ee",justifyContent:"center",alignItems:"center"},
  title:{fontSize:42,fontWeight:"bold",color:"#195c42",marginBottom:5},
  subtitle:{fontSize:16,color:"#444",marginBottom:45,textAlign:"center",width:"75%"},
  button:{backgroundColor:"#ffbe0b",paddingVertical:15,paddingHorizontal:40,borderRadius:10,marginTop:10},
  buttonText:{fontSize:18,fontWeight:"bold"},
});

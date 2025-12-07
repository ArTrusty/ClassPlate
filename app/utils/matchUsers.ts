import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

export async function getMatches(currentUser: any) {
  const users = await getDocs(collection(db, "users"));
  const matches: any[] = [];

  users.forEach(docSnap => {
    const u = docSnap.data();

    if (u.email !== currentUser.email) {       // exclude self
      let score = 0;

      if (u.major === currentUser.major) score += 3;
      if (u.year === currentUser.year) score += 2;
      if (u.preference === currentUser.preference) score += 2;

      const socialDiff = Math.abs(u.socialLevel - currentUser.socialLevel);
      score += (5 - socialDiff); // closer social level = better match

      matches.push({ ...u, score, id: docSnap.id });
    }
  });

  return matches.sort((a, b) => b.score - a.score).slice(0, 6); // top 6 matches
}

import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

export async function getMatches(currentUser: any) {
  const users = await getDocs(collection(db, "users"));
  const matches: any[] = [];

  users.forEach(docSnap => {
    const u = docSnap.data();

    if (u.email !== currentUser.email) {       // exclude self
      let score = 0;
      // match scoring
      if (u.major === currentUser.major) score += 1;
      if (u.year === currentUser.year) score += 2;
      if (u.lunchVibe === currentUser.lunchVibe) score += 4;
      if (u.cafeOrder === currentUser.cafeOrder) score += 0.15;
      if (u.dietaryRestrictions === currentUser.dietaryRestrictions) score += 1.0;
      if (u.preferredActivity === currentUser.preferredActivity) score += 2.0;

      const socialDiff = Math.abs(u.socialLevel - currentUser.socialLevel);
      score += (5 - socialDiff); // closer social level = better match

      matches.push({ ...u, score, id: docSnap.id });
    }
  });

  return matches.sort((a, b) => b.score - a.score).slice(0, 6); // top 6 matches
}

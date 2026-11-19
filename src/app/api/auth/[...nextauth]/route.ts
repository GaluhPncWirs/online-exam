import { generateRandomId } from "@/src/lib/utils/generateRandomId";
import {
  handleExistingUserAccount,
  handleUserRegister,
} from "@/src/services/mysql/student/data-student";
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      name: "google",
      clientId: process.env.GOOGLE_OAUTH_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account?.provider === "google" && user) {
        if (!user.email) {
          throw new Error("Akun Google tidak memiliki alamat email.");
        }

        token.fullname = user.name;
        token.profileImage = user.image;

        const existingUser = await handleExistingUserAccount(user.email);
        if (existingUser) {
          token.idStudent = existingUser.id_student;
          token.role = existingUser.role;
          token.typeAccount = existingUser.type_account;
          token.classes = existingUser.class;
          token.nis = existingUser.nis;
          token.noTlp = existingUser.no_tlp;
        } else {
          const idStudent = generateRandomId(7, "STD");
          const registerAccount = await handleUserRegister({
            id_student: idStudent,
            fullName: user.name ?? user.email,
            email: user.email,
            profilImage: user.image ?? undefined,
            type_account: "google",
            role: "student",
            classes: "not filled",
          });

          if (!registerAccount.success) {
            throw new Error(registerAccount.message);
          }

          token.idStudent = idStudent;
          token.role = "student";
          token.typeAccount = "google";
          token.classes = "not filled";
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        Object.assign(session.user, {
          fullname: token.fullname,
          email: token.email,
          profileImage: token.profileImage,
          role: token.role,
          idStudent: token.idStudent,
          typeAccount: token.typeAccount,
          classes: token.classes,
        });
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

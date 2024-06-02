import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import prisma from './prisma/db';

// const prisma = new PrismaClient();

export const { auth, handlers, signIn, signOut } = NextAuth({
	//   adapter: PrismaAdapter(prisma),
	providers: [
		GitHub({
			profile(profile) {
				return {
					id: profile.id.toString(),
					name: profile.name,
					email: profile.email,
					image: profile.avatar_url,
					username: profile.login, // GitHub username
				};
			},
			authorization: {
				params: {
					scope: 'read:user repo user:email',
				},
			},
		}),
	],
	callbacks: {
		async signIn({ profile }) {
			if (profile) {
				await prisma.users.upsert({
					where: {
						id: Number(profile.id),
					},
					update: {},
					create: {
						id: Number(profile.id),
						email: profile.email as string,
					},
				});
			}

			return true;
		},
		async jwt({ token, trigger, profile, account, user }) {
			if (account && profile) {
				token.id = profile.id as string;
				token.accessToken = account.access_token;
				token.username = profile.login as string; // Assuming GitHub profile has "login" field for username
			}
			return token;
		},
		async session({ session, token }) {
			session.accessToken = token.accessToken;
			session.user.username = token.username as string;
			session.user.id = token.id;
			return session;
		},
	},
});

"use client"
import React from 'react';
import {  auth, db, doc } from '@/lib/firebase';
import { GoogleAuthProvider, User, signInWithPopup, signOut } from 'firebase/auth';
import { addDoc, collection, getDoc, setDoc } from 'firebase/firestore';
import useAuth from "@/lib/hooks/useAuth";

// Example function to sign in with Google
const LoginButton =  () => {
    const { user } = useAuth()
   const insertOrUpdateUser = async (userData: User) => {
        const docRef = doc(db, "users", userData.uid);
        const docSnap = await getDoc(docRef);

        // Insert user data only if document doesn't exist
        if (!docSnap.exists()) {
            await setDoc(docRef, {
                displayName: userData.displayName,
                email: userData.email,
                photoURL: userData.photoURL,
            });
            console.log('New user data inserted:', docRef.id);
        } else {
            console.log('User data already exists:')
        }
    }

    const loginWithLoginButtonGoogle = async () => {

        if(user?.uid) {
            signOut(auth)
            return;
        }

        try {
            const googleProvider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, googleProvider);
            // This gives you a Google Access Token. You can use it to access Google APIs.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            
            // The signed-in user info.
            const user = result.user;
            insertOrUpdateUser(user)
            console.log(user);
          } catch (error) {
            // Handle Errors here.
                console.log(error)
            // ...x
          }
    }

    return <button onClick={loginWithLoginButtonGoogle}>{!user?.uid ? 'Login' : 'Logout' }</button>
  };
export default LoginButton;
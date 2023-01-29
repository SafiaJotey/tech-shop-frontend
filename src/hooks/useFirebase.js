import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { useEffect, useState } from 'react';
import InitializationAuthentication from '../firebase/firebase.init';

InitializationAuthentication();
const useFirebase = () => {
  // const [alertVisible, setIsAlertVisible] = useState(false);
  const [user, setUser] = useState({});
  const [userTrue, setUserTrue] = useState({});
  // const [name, setName] = useState('');
  // const [successAlert, setSuccessAlert] = useState('');
  // const [errorAlert, setErrorAlert] = useState('');
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const googleProvider = new GoogleAuthProvider();

  //register a new user
  const signUp = (data, navigate) => {
    setLoading(true);

    createUserWithEmailAndPassword(auth, data.email, data.password)
      .then((result) => {
        // Signed in

        const user = result.user;
        console.log(user);
        setUserName(data.name);
        // setIsAlertVisible(true);

        navigate('/');
        // localStorage.setItem('token', JSON.stringify(result?.data?.token));
        // setSuccessAlert('user created successfully');
        // setErrorAlert('');
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
        // setSuccessAlert('');
        // setErrorAlert(errorMessage);
      })
      .finally(() => {
        // setSuccessAlert('');
        // setErrorAlert('');
        setLoading(false);
      });
  };
  //sign in withEmailPassword
  const signinWithEmail = (data, navigate, destination) => {
    setLoading(true);

    const { email, password } = data;
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        navigate(destination);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  };

  //sign in with google
  const signinWithGoogle = (location, navigate) => {
    const redirect_uri = location?.state?.from || '/';
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        const user = result.user;

        navigate(redirect_uri);
      })
      .catch((error) => {});
  };

  // Logout
  const logOut = () => {
    setLoading(true);

    signOut(auth)
      .then(() => {
        setUser({});
        localStorage.removeItem('token');
      })
      .catch((error) => {
        // An error happened.
      })
      .finally(() => {
        // setSuccessAlert('');
        // setErrorAlert('');
        setLoading(false);
      });
  };
  // useEffect(() => {
  //   const token = JSON.parse(localStorage.getItem('token'));

  //   fetch('https://emart-98vu.onrender.com/api/v1/auth/getUser', {
  //     headers: { authorization: `Bearer ${token}` },
  //   })
  //     .then((res) => res.json())
  //     .then((data) => {
  //       // setUser(data.others);
  //       setUser(data.data);
  //     });
  // }, [userTrue.email]);

  //observe user state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser({});
      }
      setLoading(false);
    });
    return () => unsubscribe;
  }, [auth]);

  const setUserName = (name) => {
    updateProfile(auth.currentUser, {
      displayName: name,
    })
      .then(() => {
        // Profile updated!
      })
      .catch((error) => {});
  };

  return {
    loading,
    user,
    setUser,
    userTrue,
    setUserTrue,
    signinWithEmail,
    signinWithGoogle,
    signUp,
    logOut,
    // successAlert,
    // errorAlert,
    // alertVisible,
    // setIsAlertVisible,
  };
};
export default useFirebase;

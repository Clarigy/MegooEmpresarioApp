import { auth, db } from './setup';

export function watchUserChanges(callback) {
    //Unsuscribe del listener
    const unsub = auth.onAuthStateChanged((user) => {
        console.log('llamada de watchUserChanges...');
       
        if (user && !user.isAnonymous) {          
            const {
                uid,
                email,
                displayName,
            } = user;
      callback({
        id: uid,
        email,
        displayName,
      });
    } else {
      callback(null);
    }
  });

  return unsub;
}

/*eexport function watchUsuarios(callback) {
  const unsub = db
    .collection('Usuarios')
    .onSnapshot((snapshot) => {
      const docs = [];

      snapshot.forEach((doc) => {
        const data = doc.data();

        docs.push({
          ...data,

        });
      });
      print(docs);

      callback(docs);
    });

  return unsub;
}

xport function watchVariables(callback) {
  const unsub = db
    .collection('Variables')
    .onSnapshot((snapshot) => {
      const docs = [];

      snapshot.forEach((doc) => {
        const data = doc.data();

        docs.push({
          ...data,

        });
      });
      print(docs);

      callback(docs);
    });

  return unsub;
}

export function watchCategorias(callback) {
  const unsub = db
    .collection('Categorias')
    .onSnapshot((snapshot) => {
      const docs = [];

      snapshot.forEach((doc) => {
        const data = doc.data();

        docs.push({
          ...data,

        });
      });

      callback(docs);
    });

  return unsub;
}

*/

// ============================================================
// KONFIGURASI FIREBASE - GANTI DENGAN DATA DARI FIREBASE
// ============================================================

 const firebaseConfig = {
  apiKey: "AIzaSyBBivruP8SMA5MQopfemiXpO5LvLOxx7fQ",
  authDomain: "absensi-sman1-f49d3.firebaseapp.com",
  projectId: "absensi-sman1-f49d3",
  storageBucket: "absensi-sman1-f49d3.firebasestorage.app",
  messagingSenderId: "207183929663",
  appId: "1:207183929663:web:a0fe86b6ff43abca94338a"
};

// Inisialisasi Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ============================================================
// FUNGSI CRUD - PAKAI INI DI INDEX.HTML
// ============================================================

// === USERS ===
async function getUsers() {
    const snapshot = await db.collection('users').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

async function addUser(data) {
    return await db.collection('users').add(data);
}

async function deleteUser(id) {
    return await db.collection('users').doc(id).delete();
}

async function getUserByUsername(username) {
    const snapshot = await db.collection('users').where('username', '==', username).get();
    if (snapshot.empty) return null;
    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
}

// === CLASSES ===
async function getClasses() {
    const snapshot = await db.collection('classes').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

async function addClass(data) {
    return await db.collection('classes').add(data);
}

async function deleteClass(id) {
    return await db.collection('classes').doc(id).delete();
}

// === STUDENTS ===
async function getStudents() {
    const snapshot = await db.collection('students').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

async function addStudent(data) {
    return await db.collection('students').add(data);
}

async function deleteStudent(id) {
    return await db.collection('students').doc(id).delete();
}

async function getStudentsByClass(classId) {
    const snapshot = await db.collection('students').where('classId', '==', classId).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// === ATTENDANCE ===
async function getAttendance() {
    const snapshot = await db.collection('attendance').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

async function addAttendance(data) {
    return await db.collection('attendance').add(data);
}

async function deleteAttendanceByDateClass(date, classId) {
    const snapshot = await db.collection('attendance')
        .where('date', '==', date)
        .where('classId', '==', classId)
        .get();
    const batch = db.batch();
    snapshot.docs.forEach(doc => batch.delete(doc.ref));
    await batch.commit();
}

async function getAttendanceFiltered(dateFrom, dateTo, classId) {
    let query = db.collection('attendance').where('date', '>=', dateFrom).where('date', '<=', dateTo);
    if (classId) {
        query = query.where('classId', '==', classId);
    }
    const snapshot = await query.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// === LOGIN ===
async function loginUser(username, password) {
    const userData = await getUserByUsername(username);
    if (!userData) return { success: false, error: 'Username tidak ditemukan' };
    if (userData.password !== password) return { success: false, error: 'Password salah' };
    return { success: true, user: userData };
}

// === INIT DEFAULT DATA ===
async function initDefaultData() {
    const users = await getUsers();
    if (users.length === 0) {
        await addUser({ username: 'admin', password: 'admin123', role: 'admin', name: 'Administrator', classId: null });
        await addUser({ username: 'guru', password: 'guru123', role: 'guru_piket', name: 'Guru Piket', classId: null });
        await addUser({ username: 'wali', password: 'wali123', role: 'wali_kelas', name: 'Wali Kelas X IPA 1', classId: 'c1' });
        await addUser({ username: 'murid', password: 'murid123', role: 'murid', name: 'Budi Santoso', classId: 'c1' });
    }
    
    const classes = await getClasses();
    if (classes.length === 0) {
        await addClass({ id: 'c1', name: 'X IPA 1', homeroomTeacherId: null });
        await addClass({ id: 'c2', name: 'X IPA 2', homeroomTeacherId: null });
        await addClass({ id: 'c3', name: 'XI IPS 1', homeroomTeacherId: null });
    }
    
    const students = await getStudents();
    if (students.length === 0) {
        await addStudent({ nis: '12345', name: 'Budi Santoso', classId: 'c1' });
        await addStudent({ nis: '12346', name: 'Siti Rahayu', classId: 'c1' });
        await addStudent({ nis: '12347', name: 'Ahmad Fauzi', classId: 'c2' });
        await addStudent({ nis: '12348', name: 'Dewi Lestari', classId: 'c2' });
        await addStudent({ nis: '12349', name: 'Rizki Ramadhan', classId: 'c3' });
    }
}

// Jalankan init
initDefaultData();

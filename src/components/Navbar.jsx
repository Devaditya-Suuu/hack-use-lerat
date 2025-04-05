import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { auth } from "../firebase"; // Firebase authentication import
import { onAuthStateChanged, signOut } from "firebase/auth";

const Navbar = () => {
    const [userEmail, setUserEmail] = useState(null);

    useEffect(() => {
        // Check authentication state
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserEmail(user.email); // Set the user's email
            } else {
                setUserEmail(null); // Clear when logged out
            }
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        await signOut(auth);
        setUserEmail(null);
        window.location.reload(); // Refresh to reflect logout
    };

    return (
        <nav style={styles.navbar}>
            <div style={styles.logo}>
                <Link to="/" style={styles.logoText}>Pothole Reporting</Link>
            </div>

            <ul style={styles.navLinks}>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/report">Report Pothole</Link></li>
                <li><Link to="/admin">Admin Dashboard</Link></li>
            </ul>

            {/* Right side: Show User Email if logged in */}
            {userEmail ? (
                <div style={styles.profileSection}>
                    <span>{userEmail}</span>
                    <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
                </div>
            ) : (
                <Link to="/login" style={styles.loginBtn}>Login</Link>
            )}
        </nav>
    );
};

// Styling for navbar
const styles = {
    navbar: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 20px",
        background: "transparent",
        color: "white",
        // position: "fixed",
        // boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)"
    },
    logoText: {
        fontSize: "20px",
        fontWeight: "bold",
        textDecoration: "none",
        color: "white"
    },
    navLinks: {
        display: "flex",
        listStyle: "none",
        gap: "20px"
    },
    profileSection: {
        display: "flex",
        alignItems: "center",
        gap: "10px"
    },
    logoutBtn: {
        backgroundColor: "white",
        color: "blue",
        padding: "10px",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer"
    },
    loginBtn: {
        backgroundColor: "white",
        color: "#007bff",
        padding: "8px 12px",
        textDecoration: "none",
        borderRadius: "5px",
        fontWeight: "bold"
    }
};

export default Navbar;

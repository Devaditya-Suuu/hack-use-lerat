import { useState, useEffect } from "react";
import { storage, db, auth } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { FaCamera, FaMapMarkerAlt } from "react-icons/fa";

const ReportForm = () => {
    const [image, setImage] = useState(null);
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");
    const [user, setUser] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
    }, []);

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
            setError(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            setError("You must be logged in to submit a report.");
            return;
        }
        if (!latitude || !longitude) {
            setError("Please enter valid location coordinates.");
            return;
        }
        if (!image) {
            setError("Please upload an image.");
            return;
        }

        try {
            setIsSubmitting(true);
            const imageRef = ref(storage, `pothole_images/${Date.now()}_${image.name}`);
            await uploadBytes(imageRef, image);
            const imageUrl = await getDownloadURL(imageRef);

            await addDoc(collection(db, "reports"), {
                imageUrl,
                location: { lat: latitude, lng: longitude },
                status: "Pending",
                timestamp: new Date(),
                userId: user.uid,
            });

            setSuccessMessage("Report submitted successfully!");
            setImage(null);
            setLatitude("");
            setLongitude("");
            setError(null);
        } catch (error) {
            setError("Error submitting report. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="report-form">
            <form onSubmit={handleSubmit}>
                <h2>Report a Pothole</h2>
                <div className="form-group">
                    <label><FaCamera /> Upload Image</label>
                    <input type="file" accept="image/*" onChange={handleImageChange} required />
                </div>

                <div className="form-group">
                    <label><FaMapMarkerAlt /> Latitude</label>
                    <input
                        type="text"
                        value={latitude}
                        onChange={(e) => setLatitude(e.target.value)}
                        placeholder="Enter latitude"
                        required
                    />
                </div>

                <div className="form-group">
                    <label><FaMapMarkerAlt /> Longitude</label>
                    <input
                        type="text"
                        value={longitude}
                        onChange={(e) => setLongitude(e.target.value)}
                        placeholder="Enter longitude"
                        required
                    />
                </div>

                {error && <p className="error-message">{error}</p>}
                {successMessage && <p className="success-message">{successMessage}</p>}

                <button type="submit" className="submit-btn" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Report"}
                </button>
            </form>
        </div>
    );
};

export default ReportForm;

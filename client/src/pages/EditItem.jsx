import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
    getSingleItem,
    updateItem
} from "../services/itemService";

function EditItem() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        pricePerDay: "",
        securityDeposit: "",
        city: "",
        state: ""
    });

    const [existingImages, setExistingImages] = useState([]);
    const [newImages, setNewImages] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        fetchItem();
    }, [id]);


    const fetchItem = async () => {

        try {

            const response = await getSingleItem(id);
            const item = response.data.item;

            setFormData({
                title: item.title,
                description: item.description,
                category: item.category,
                pricePerDay: item.pricePerDay,
                securityDeposit: item.securityDeposit,
                city: item.city,
                state: item.state
            });

            setExistingImages(item.images || []);

        } catch (error) {

            console.log(error);

        }

    };


    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };


    const handleImageChange = (e) => {

        const files = Array.from(e.target.files);

        if (existingImages.length + files.length > 5) {

            alert("Maximum 5 images are allowed");

            return;
        }

        setNewImages(files);

        const previews = files.map((file) =>
            URL.createObjectURL(file)
        );

        setPreviewImages(previews);

    };


    const removeExistingImage = (index) => {

        const updatedImages =
            existingImages.filter((_, i) => i !== index);

        setExistingImages(updatedImages);

    };


    const removeNewImage = (index) => {

        const updatedImages =
            newImages.filter((_, i) => i !== index);

        const updatedPreviews =
            previewImages.filter((_, i) => i !== index);

        setNewImages(updatedImages);
        setPreviewImages(updatedPreviews);

    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            const data = new FormData();

            data.append("title", formData.title);
            data.append(
                "description",
                formData.description
            );
            data.append(
                "category",
                formData.category
            );
            data.append(
                "pricePerDay",
                formData.pricePerDay
            );
            data.append(
                "securityDeposit",
                formData.securityDeposit
            );
            data.append("city", formData.city);
            data.append("state", formData.state);

            // Keep existing images
            data.append(
                "existingImages",
                JSON.stringify(existingImages)
            );

            // Add new images
            newImages.forEach((image) => {

                data.append("images", image);

            });


            const response = await updateItem(id, data);

            alert(response.message);

            navigate("/my-items");

        } catch (error) {

            alert(
                error?.response?.data?.message ||
                "Update Failed"
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="min-h-screen bg-gray-50">

            <Navbar />

            <div className="max-w-2xl mx-auto mt-10 mb-10">

                <div className="bg-white shadow-lg p-8 rounded-xl">

                    <h1 className="text-3xl font-bold mb-2">
                        Edit Item
                    </h1>

                    <p className="text-gray-500 mb-6">
                        Update your item information and images.
                    </p>


                    <form
                        onSubmit={handleSubmit}
                        className="space-y-4"
                    >

                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full border p-3 rounded-lg"
                            required
                        />


                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            className="w-full border p-3 rounded-lg"
                            required
                        />


                        <input
                            type="text"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full border p-3 rounded-lg"
                            required
                        />


                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            <input
                                type="number"
                                name="pricePerDay"
                                value={formData.pricePerDay}
                                onChange={handleChange}
                                className="w-full border p-3 rounded-lg"
                                required
                            />

                            <input
                                type="number"
                                name="securityDeposit"
                                value={formData.securityDeposit}
                                onChange={handleChange}
                                className="w-full border p-3 rounded-lg"
                                required
                            />

                        </div>


                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                className="w-full border p-3 rounded-lg"
                                required
                            />

                            <input
                                type="text"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                className="w-full border p-3 rounded-lg"
                                required
                            />

                        </div>


                        {/* EXISTING IMAGES */}

                        {existingImages.length > 0 && (

                            <div>

                                <label className="block font-semibold mb-2">
                                    Current Images
                                </label>

                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

                                    {existingImages.map(
                                        (image, index) => (

                                            <div
                                                key={index}
                                                className="relative"
                                            >

                                                <img
                                                    src={image}
                                                    alt={`Current ${index + 1}`}
                                                    className="h-32 w-full rounded-lg border object-cover"
                                                />

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeExistingImage(index)
                                                    }
                                                    className="absolute top-2 right-2 h-7 w-7 rounded-full bg-red-600 text-white"
                                                >
                                                    ×
                                                </button>

                                            </div>

                                        )
                                    )}

                                </div>

                            </div>

                        )}


                        {/* NEW IMAGE UPLOAD */}

                        <div>

                            <label className="block font-semibold mb-2">
                                Add New Images
                            </label>

                            <input
                                type="file"
                                accept="image/png,image/jpeg,image/webp"
                                multiple
                                onChange={handleImageChange}
                                className="w-full border p-3 rounded-lg"
                            />

                            <p className="mt-1 text-sm text-gray-500">
                                Maximum 5 images total, up to 5MB each.
                            </p>

                        </div>


                        {/* NEW IMAGE PREVIEW */}

                        {previewImages.length > 0 && (

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

                                {previewImages.map(
                                    (image, index) => (

                                        <div
                                            key={index}
                                            className="relative"
                                        >

                                            <img
                                                src={image}
                                                alt={`New ${index + 1}`}
                                                className="h-32 w-full rounded-lg border object-cover"
                                            />

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeNewImage(index)
                                                }
                                                className="absolute top-2 right-2 h-7 w-7 rounded-full bg-red-600 text-white"
                                            >
                                                ×
                                            </button>

                                        </div>

                                    )
                                )}

                            </div>

                        )}


                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-lg bg-green-600 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                        >

                            {loading
                                ? "Updating..."
                                : "Update Item"}

                        </button>

                    </form>

                </div>

            </div>

        </div>

    );

}

export default EditItem;
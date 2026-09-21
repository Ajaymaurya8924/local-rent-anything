import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { addItem } from "../services/itemService";

function AddItem() {

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

    const [images, setImages] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const [loading, setLoading] = useState(false);


    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };


    const handleImageChange = (e) => {

        const files = Array.from(e.target.files);

        if (files.length > 5) {

            alert("You can select maximum 5 images");

            return;
        }

        setImages(files);

        const previews = files.map((file) =>
            URL.createObjectURL(file)
        );

        setPreviewImages(previews);

    };


    const removeImage = (index) => {

        const updatedImages =
            images.filter((_, i) => i !== index);

        const updatedPreviews =
            previewImages.filter((_, i) => i !== index);

        setImages(updatedImages);
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


            images.forEach((image) => {

                data.append("images", image);

            });


            const response = await addItem(data);

            alert(response.message);

            navigate("/items");

        } catch (error) {

            alert(
                error?.response?.data?.message ||
                "Failed to add item"
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
                        Add New Item
                    </h1>

                    <p className="text-gray-500 mb-6">
                        List your item for others to rent.
                    </p>


                    <form
                        onSubmit={handleSubmit}
                        className="space-y-4"
                    >

                        <input
                            type="text"
                            name="title"
                            placeholder="Item Title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full border p-3 rounded-lg"
                            required
                        />


                        <textarea
                            name="description"
                            placeholder="Item Description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            className="w-full border p-3 rounded-lg"
                            required
                        />


                        <input
                            type="text"
                            name="category"
                            placeholder="Category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full border p-3 rounded-lg"
                            required
                        />


                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            <input
                                type="number"
                                name="pricePerDay"
                                placeholder="Price Per Day"
                                value={formData.pricePerDay}
                                onChange={handleChange}
                                className="w-full border p-3 rounded-lg"
                                required
                            />


                            <input
                                type="number"
                                name="securityDeposit"
                                placeholder="Security Deposit"
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
                                placeholder="City"
                                value={formData.city}
                                onChange={handleChange}
                                className="w-full border p-3 rounded-lg"
                                required
                            />


                            <input
                                type="text"
                                name="state"
                                placeholder="State"
                                value={formData.state}
                                onChange={handleChange}
                                className="w-full border p-3 rounded-lg"
                                required
                            />

                        </div>


                        {/* Image Upload */}

                        <div>

                            <label className="block font-semibold mb-2">
                                Item Images
                            </label>

                            <input
                                type="file"
                                accept="image/png,image/jpeg,image/webp"
                                multiple
                                onChange={handleImageChange}
                                className="w-full border p-3 rounded-lg"
                            />

                            <p className="text-sm text-gray-500 mt-1">
                                Maximum 5 images, up to 5MB each.
                            </p>

                        </div>


                        {/* Image Preview */}

                        {previewImages.length > 0 && (

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">

                                {previewImages.map(
                                    (image, index) => (

                                        <div
                                            key={index}
                                            className="relative"
                                        >

                                            <img
                                                src={image}
                                                alt={`Preview ${index + 1}`}
                                                className="w-full h-32 object-cover rounded-lg border"
                                            />

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeImage(index)
                                                }
                                                className="absolute top-2 right-2 bg-red-600 text-white w-7 h-7 rounded-full"
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
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
                        >

                            {loading
                                ? "Uploading..."
                                : "Add Item"}

                        </button>

                    </form>

                </div>

            </div>

        </div>

    );

}

export default AddItem;
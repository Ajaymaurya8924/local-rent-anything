import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getMyItems, deleteItem } from "../services/itemService";

function MyItems() {

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);


    // ================= FETCH MY ITEMS =================

    const fetchMyItems = async () => {

        try {

            const response = await getMyItems();

            setItems(response.data.items);

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {
        fetchMyItems();
    }, []);


    // ================= DELETE ITEM =================

    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this item?"
        );

        if (!confirmDelete) {
            return;
        }

        try {

            const response = await deleteItem(id);

            alert(response.message);

            fetchMyItems();

        } catch (error) {

            alert(
                error?.response?.data?.message ||
                "Delete Failed"
            );

        }
    };


    // ================= LOADING =================

    if (loading) {

        return (
            <>
                <Navbar />

                <h2 className="mt-10 text-center">
                    Loading...
                </h2>
            </>
        );
    }


    return (

        <div>

            <Navbar />

            <div className="mx-auto max-w-7xl p-6">

                <h1 className="mb-8 text-3xl font-bold">
                    My Items
                </h1>


                {/* ================= EMPTY STATE ================= */}

                {items.length === 0 ? (

                    <h2>
                        You have not added any item yet.
                    </h2>

                ) : (

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

                        {items.map((item) => (

                            <div
                                key={item._id}
                                className="overflow-hidden rounded-xl border bg-white shadow-md"
                            >

                                {/* ================= IMAGE ================= */}

                                <div className="h-48 w-full bg-gray-100">

                                    {item.images &&
                                    item.images.length > 0 ? (

                                        <img
                                            src={item.images[0]}
                                            alt={item.title}
                                            className="h-full w-full object-cover"
                                        />

                                    ) : (

                                        <div className="flex h-full items-center justify-center text-4xl">
                                            📦
                                        </div>

                                    )}

                                </div>


                                {/* ================= ITEM INFO ================= */}

                                <div className="p-4">

                                    <h2 className="text-xl font-bold">
                                        {item.title}
                                    </h2>


                                    <p className="mt-2 text-gray-600">
                                        {item.category}
                                    </p>


                                    <p className="text-gray-700">
                                        ₹{item.pricePerDay}/Day
                                    </p>


                                    <p className="text-gray-600">
                                        📍 {item.city}
                                    </p>


                                    {/* ================= RATING ================= */}

                                    <div className="mt-3 flex items-center gap-2">

                                        <div className="text-yellow-400">

                                            {"★".repeat(
                                                Math.round(
                                                    item.averageRating || 0
                                                )
                                            )}

                                            <span className="text-gray-300">

                                                {"★".repeat(
                                                    5 -
                                                    Math.round(
                                                        item.averageRating || 0
                                                    )
                                                )}

                                            </span>

                                        </div>


                                        <span className="text-sm text-gray-500">

                                            {item.averageRating
                                                ? item.averageRating.toFixed(1)
                                                : "0.0"}

                                            {" "}

                                            ({item.totalReviews || 0}{" "}

                                            {item.totalReviews === 1
                                                ? "Review"
                                                : "Reviews"})

                                        </span>

                                    </div>


                                    {/* ================= ACTIONS ================= */}

                                    <div className="mt-4 flex gap-3">

                                        <Link
                                            to={`/items/${item._id}`}
                                            className="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700"
                                        >
                                            View
                                        </Link>


                                        <Link
                                            to={`/edit-item/${item._id}`}
                                            className="rounded bg-yellow-500 px-3 py-1 text-white hover:bg-yellow-600"
                                        >
                                            Edit
                                        </Link>


                                        <button
                                            onClick={() =>
                                                handleDelete(item._id)
                                            }
                                            className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700"
                                        >
                                            Delete
                                        </button>

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>
    );
}

export default MyItems;
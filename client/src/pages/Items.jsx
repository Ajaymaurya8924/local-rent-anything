import { useEffect, useState } from "react";
import { getAllItems } from "../services/itemService";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

function Items() {

    const [items, setItems] = useState([]);

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [city, setCity] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

    const [loading, setLoading] = useState(true);


    // ================= FETCH ITEMS =================

    const fetchItems = async () => {

        try {

            const response = await getAllItems({
                search,
                category,
                city,
                minPrice,
                maxPrice
            });

            setItems(
                response.data.items
            );

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);
        }
    };


    // Fetch items when page loads
    useEffect(() => {
        fetchItems();
    }, []);


    // ================= SEARCH =================

    const handleSearch = () => {

        setLoading(true);

        fetchItems();
    };


    // ================= LOADING =================

    if (loading) {

        return (
            <>
                <Navbar />

                <h2 className="mt-10 text-center">
                    Loading Items...
                </h2>
            </>
        );
    }


    return (

        <div>

            <Navbar />

            <div className="mx-auto max-w-7xl p-6">

                {/* ================= PAGE TITLE ================= */}

                <h1 className="mb-8 text-3xl font-bold">
                    All Rental Items
                </h1>


                {/* ================= FILTERS ================= */}

                <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-5">

                    <input
                        type="text"
                        placeholder="Search Title"
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        className="rounded border p-2"
                    />

                    <input
                        type="text"
                        placeholder="Category"
                        value={category}
                        onChange={(e) =>
                            setCategory(e.target.value)
                        }
                        className="rounded border p-2"
                    />

                    <input
                        type="text"
                        placeholder="City"
                        value={city}
                        onChange={(e) =>
                            setCity(e.target.value)
                        }
                        className="rounded border p-2"
                    />

                    <input
                        type="number"
                        placeholder="Min Price"
                        value={minPrice}
                        onChange={(e) =>
                            setMinPrice(e.target.value)
                        }
                        className="rounded border p-2"
                    />

                    <input
                        type="number"
                        placeholder="Max Price"
                        value={maxPrice}
                        onChange={(e) =>
                            setMaxPrice(e.target.value)
                        }
                        className="rounded border p-2"
                    />

                </div>


                {/* ================= SEARCH BUTTON ================= */}

                <button
                    onClick={handleSearch}
                    className="mb-8 rounded bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
                >
                    Search
                </button>


                {/* ================= ITEMS ================= */}

                {items.length === 0 ? (

                    <h2>
                        No Items Found
                    </h2>

                ) : (

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

                        {items.map((item) => (

                            <div
                                key={item._id}
                                className="overflow-hidden rounded-xl border bg-white shadow-md"
                            >

                                {/* ================= ITEM IMAGE ================= */}

                                <div className="h-56 w-full bg-gray-100">

                                    {item.images &&
                                    item.images.length > 0 ? (

                                        <img
                                            src={item.images[0]}
                                            alt={item.title}
                                            className="h-full w-full object-cover"
                                        />

                                    ) : (

                                        <div className="flex h-full items-center justify-center">

                                            <div className="text-center">

                                                <div className="text-5xl">
                                                    📦
                                                </div>

                                                <p className="mt-2 text-sm text-gray-400">
                                                    No image available
                                                </p>

                                            </div>

                                        </div>
                                    )}

                                </div>


                                {/* ================= ITEM INFORMATION ================= */}

                                <div className="p-4">

                                    <h2 className="text-2xl font-bold">
                                        {item.title}
                                    </h2>


                                    {/* ================= RATING ================= */}

                                    <div className="mt-2 flex items-center gap-2">

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


                                    <p className="mt-2 line-clamp-2">
                                        {item.description}
                                    </p>


                                    <p className="mt-2">
                                        <strong>
                                            Category :
                                        </strong>{" "}
                                        {item.category}
                                    </p>


                                    <p>
                                        <strong>
                                            City :
                                        </strong>{" "}
                                        {item.city}
                                    </p>


                                    <p>
                                        <strong>
                                            Price :
                                        </strong>{" "}
                                        ₹{item.pricePerDay}/Day
                                    </p>


                                    {/* ================= VIEW DETAILS ================= */}

                                    <Link
                                        to={`/items/${item._id}`}
                                        className="mt-4 inline-block rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                                    >
                                        View Details
                                    </Link>

                                </div>

                            </div>
                        ))}

                    </div>
                )}

            </div>

        </div>
    );
}

export default Items;
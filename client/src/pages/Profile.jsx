import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
    User,
    Mail,
    Phone,
    MapPin,
    Save,
    ShieldCheck,
    Camera
} from "lucide-react";

import Navbar from "../components/Navbar";

import {
    getCurrentUser,
    updateProfile
} from "../services/authService";


function Profile() {

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        city: "",
        state: ""
    });


    // ================= FETCH PROFILE =================

    useEffect(() => {
        fetchProfile();
    }, []);


    const fetchProfile = async () => {

        try {

            const response =
                await getCurrentUser();

            const user =
                response.data.user;

            setFormData({

                fullName:
                    user.fullName || "",

                email:
                    user.email || "",

                phone:
                    user.phone || "",

                city:
                    user.city || "",

                state:
                    user.state || ""

            });

        } catch (error) {

            console.log(error);

            toast.error(
                error?.response?.data?.message ||
                "Failed to load profile"
            );

        } finally {

            setLoading(false);

        }
    };


    // ================= INPUT CHANGE =================

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

    };


    // ================= UPDATE PROFILE =================

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!formData.fullName.trim()) {

            toast.error(
                "Full name is required"
            );

            return;
        }


        try {

            setSaving(true);

            const response =
                await updateProfile({

                    fullName:
                        formData.fullName.trim(),

                    phone:
                        formData.phone.trim(),

                    city:
                        formData.city.trim(),

                    state:
                        formData.state.trim()

                });


            toast.success(
                response.message ||
                "Profile updated successfully"
            );


            await fetchProfile();

        } catch (error) {

            console.log(error);

            toast.error(
                error?.response?.data?.message ||
                "Failed to update profile"
            );

        } finally {

            setSaving(false);

        }
    };


    // ================= LOADING =================

    if (loading) {

        return (

            <>

                <Navbar />

                <div className="flex min-h-[70vh] items-center justify-center">

                    <div className="text-center">

                        <div className="mx-auto mb-4 h-11 w-11 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>

                        <p className="text-sm font-medium text-gray-500">
                            Loading your profile...
                        </p>

                    </div>

                </div>

            </>

        );
    }


    return (

        <div className="min-h-screen bg-gray-50">

            <Navbar />


            <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">

                {/* ================= HEADER ================= */}

                <div className="mb-8">

                    <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-600">
                        Account
                    </p>

                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        My Profile
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Manage your personal information and account details.
                    </p>

                </div>


                {/* ================= PROFILE CARD ================= */}

                <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">

                    {/* ================= PROFILE HERO ================= */}

                    <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 sm:px-10">

                        <div className="absolute -right-16 -top-20 h-48 w-48 rounded-full bg-white/10"></div>

                        <div className="absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-white/10"></div>


                        <div className="relative flex flex-col items-start gap-5 sm:flex-row sm:items-center">

                            {/* AVATAR */}

                            <div className="relative">

                                <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white/80 bg-white text-3xl font-bold text-blue-600 shadow-lg">

                                    {formData.fullName
                                        ? formData.fullName
                                            .charAt(0)
                                            .toUpperCase()
                                        : "U"}

                                </div>

                                <button
                                    type="button"
                                    className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gray-900 text-white shadow-md"
                                    title="Profile photo coming soon"
                                >
                                    <Camera size={15} />
                                </button>

                            </div>


                            <div className="text-white">

                                <h2 className="text-2xl font-bold">
                                    {formData.fullName || "User"}
                                </h2>

                                <p className="mt-1 flex items-center gap-2 text-sm text-blue-100">
                                    <Mail size={15} />
                                    {formData.email}
                                </p>

                                <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold backdrop-blur-sm">
                                    <ShieldCheck size={14} />
                                    Verified Account
                                </div>

                            </div>

                        </div>

                    </div>


                    {/* ================= FORM ================= */}

                    <form
                        onSubmit={handleSubmit}
                        className="p-6 sm:p-10"
                    >

                        <div className="mb-7">

                            <h3 className="text-lg font-bold text-gray-900">
                                Personal Information
                            </h3>

                            <p className="mt-1 text-sm text-gray-500">
                                Keep your profile information up to date.
                            </p>

                        </div>


                        <div className="grid gap-6 sm:grid-cols-2">


                            {/* FULL NAME */}

                            <div>

                                <label className="mb-2 block text-sm font-semibold text-gray-700">
                                    Full Name
                                </label>

                                <div className="relative">

                                    <User
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                    />

                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        placeholder="Enter your full name"
                                        className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-11 pr-4 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                                    />

                                </div>

                            </div>


                            {/* EMAIL */}

                            <div>

                                <label className="mb-2 block text-sm font-semibold text-gray-700">
                                    Email Address
                                </label>

                                <div className="relative">

                                    <Mail
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                    />

                                    <input
                                        type="email"
                                        value={formData.email}
                                        disabled
                                        className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-100 py-3.5 pl-11 pr-4 text-sm text-gray-500 outline-none"
                                    />

                                </div>

                                <p className="mt-2 text-xs text-gray-400">
                                    Email address cannot be changed here.
                                </p>

                            </div>


                            {/* PHONE */}

                            <div>

                                <label className="mb-2 block text-sm font-semibold text-gray-700">
                                    Phone Number
                                </label>

                                <div className="relative">

                                    <Phone
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                    />

                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="Enter phone number"
                                        className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-11 pr-4 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                                    />

                                </div>

                            </div>


                            {/* CITY */}

                            <div>

                                <label className="mb-2 block text-sm font-semibold text-gray-700">
                                    City
                                </label>

                                <div className="relative">

                                    <MapPin
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                    />

                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        placeholder="Enter your city"
                                        className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-11 pr-4 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                                    />

                                </div>

                            </div>


                            {/* STATE */}

                            <div className="sm:col-span-2">

                                <label className="mb-2 block text-sm font-semibold text-gray-700">
                                    State
                                </label>

                                <div className="relative">

                                    <MapPin
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                    />

                                    <input
                                        type="text"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleChange}
                                        placeholder="Enter your state"
                                        className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3.5 pl-11 pr-4 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                                    />

                                </div>

                            </div>

                        </div>


                        {/* ================= SECURITY ================= */}

                        <div className="mt-10 rounded-2xl border border-blue-100 bg-blue-50 p-5">

                            <div className="flex gap-4">

                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
                                    <ShieldCheck size={20} />
                                </div>

                                <div>

                                    <h4 className="font-semibold text-gray-900">
                                        Account Security
                                    </h4>

                                    <p className="mt-1 text-sm leading-6 text-gray-600">
                                        Your email and password are protected. Password management will be available from the security section.
                                    </p>

                                </div>

                            </div>

                        </div>


                        {/* ================= SAVE ================= */}

                        <div className="mt-8 flex justify-end border-t border-gray-100 pt-6">

                            <button
                                type="submit"
                                disabled={saving}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                            >

                                {saving ? (

                                    <>
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"></div>
                                        Saving...
                                    </>

                                ) : (

                                    <>
                                        <Save size={18} />
                                        Save Changes
                                    </>

                                )}

                            </button>

                        </div>

                    </form>

                </div>

            </main>

        </div>
    );
}

export default Profile;
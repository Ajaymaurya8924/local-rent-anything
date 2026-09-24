import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import {
    User,
    Mail,
    Phone,
    MapPin,
    Save,
    ShieldCheck,
    Lock,
    Calendar
} from "lucide-react";

import AdminNavbar from "../components/AdminNavbar";

import {
    getCurrentUser,
    updateProfile,
    changePassword
} from "../services/authService";


function AdminProfile() {

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        city: "",
        state: "",
        role: ""
    });

    const [passwordData, setPasswordData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    });


    // =====================================================
    // FETCH ADMIN PROFILE
    // =====================================================

    useEffect(() => {
        fetchProfile();
    }, []);


    const fetchProfile = async () => {

        try {

            const response =
                await getCurrentUser();

            const user =
                response?.data?.user ||
                response?.user ||
                response?.data;

            setFormData({
                fullName: user?.fullName || "",
                email: user?.email || "",
                phone: user?.phone || "",
                city: user?.city || "",
                state: user?.state || "",
                role: user?.role || "admin"
            });

        } catch (error) {

            console.error(
                "Admin Profile Error:",
                error
            );

            toast.error(
                error?.response?.data?.message ||
                "Failed to load profile"
            );

        } finally {

            setLoading(false);
        }
    };


    // =====================================================
    // INPUT CHANGE
    // =====================================================

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


    // =====================================================
    // PASSWORD INPUT CHANGE
    // =====================================================

    const handlePasswordChange = (e) => {

        const {
            name,
            value
        } = e.target;

        setPasswordData((prev) => ({
            ...prev,
            [name]: value
        }));
    };


    // =====================================================
    // UPDATE PROFILE
    // =====================================================

    const handleProfileSubmit = async (e) => {

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
                response?.message ||
                "Profile updated successfully"
            );

            await fetchProfile();

        } catch (error) {

            console.error(
                "Update Profile Error:",
                error
            );

            toast.error(
                error?.response?.data?.message ||
                "Failed to update profile"
            );

        } finally {

            setSaving(false);
        }
    };


    // =====================================================
    // CHANGE PASSWORD
    // =====================================================

    const handlePasswordSubmit = async (e) => {

        e.preventDefault();

        if (
            !passwordData.oldPassword ||
            !passwordData.newPassword ||
            !passwordData.confirmPassword
        ) {

            toast.error(
                "Please fill all password fields"
            );

            return;
        }

        if (
            passwordData.newPassword !==
            passwordData.confirmPassword
        ) {

            toast.error(
                "New passwords do not match"
            );

            return;
        }

        if (
            passwordData.newPassword.length < 4
        ) {

            toast.error(
                "New password must be at least 4 characters"
            );

            return;
        }

        try {

            setChangingPassword(true);

            await changePassword(
                passwordData.oldPassword,
                passwordData.newPassword
            );

            toast.success(
                "Password changed successfully"
            );

            setPasswordData({
                oldPassword: "",
                newPassword: "",
                confirmPassword: ""
            });

        } catch (error) {

            console.error(
                "Change Password Error:",
                error
            );

            toast.error(
                error?.response?.data?.message ||
                "Failed to change password"
            );

        } finally {

            setChangingPassword(false);
        }
    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (
            <div className="min-h-screen bg-slate-50">

                <AdminNavbar />

                <main className="flex min-h-screen items-center justify-center lg:pl-64">

                    <div className="text-center">

                        <div className="mx-auto mb-4 h-11 w-11 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

                        <p className="text-sm font-medium text-slate-500">
                            Loading admin profile...
                        </p>

                    </div>

                </main>

            </div>
        );
    }


    return (
        <div className="min-h-screen bg-slate-50">

            <AdminNavbar />

            <main className="lg:pl-64">

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="border-b border-slate-200 bg-white">

                    <div className="px-4 py-6 sm:px-6 lg:px-8">

                        <div className="flex items-center gap-3">

                            <div className="rounded-xl bg-blue-50 p-3">

                                <User
                                    size={24}
                                    className="text-blue-600"
                                />

                            </div>

                            <div>

                                <h1 className="text-2xl font-bold text-slate-900">
                                    Admin Profile
                                </h1>

                                <p className="text-sm text-slate-500">
                                    Manage your administrator account
                                </p>

                            </div>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    CONTENT
                ================================================= */}

                <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">

                    {/* =================================================
                        PROFILE HERO
                    ================================================= */}

                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 sm:px-10">

                            <div className="absolute -right-16 -top-20 h-48 w-48 rounded-full bg-white/10" />

                            <div className="absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-white/10" />

                            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">

                                {/* Avatar */}

                                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-4 border-white/80 bg-white text-3xl font-bold text-blue-600 shadow-lg">

                                    {formData.fullName
                                        ? formData.fullName
                                            .charAt(0)
                                            .toUpperCase()
                                        : "A"}

                                </div>


                                {/* Admin Info */}

                                <div className="text-white">

                                    <h2 className="text-2xl font-bold">
                                        {formData.fullName || "Admin"}
                                    </h2>

                                    <p className="mt-1 flex items-center gap-2 text-sm text-blue-100">

                                        <Mail size={15} />

                                        {formData.email}

                                    </p>

                                    <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold backdrop-blur-sm">

                                        <ShieldCheck size={14} />

                                        Administrator

                                    </div>

                                </div>

                            </div>

                        </div>


                        {/* =================================================
                            PERSONAL INFORMATION
                        ================================================= */}

                        <form
                            onSubmit={handleProfileSubmit}
                            className="p-6 sm:p-10"
                        >

                            <div className="mb-7">

                                <h3 className="text-lg font-bold text-slate-900">
                                    Personal Information
                                </h3>

                                <p className="mt-1 text-sm text-slate-500">
                                    Update your administrator profile information.
                                </p>

                            </div>


                            <div className="grid gap-6 sm:grid-cols-2">

                                {/* Full Name */}

                                <div>

                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Full Name
                                    </label>

                                    <div className="relative">

                                        <User
                                            size={18}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                        />

                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            placeholder="Enter your full name"
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                                        />

                                    </div>

                                </div>


                                {/* Email */}

                                <div>

                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Email Address
                                    </label>

                                    <div className="relative">

                                        <Mail
                                            size={18}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                        />

                                        <input
                                            type="email"
                                            value={formData.email}
                                            disabled
                                            className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 py-3.5 pl-11 pr-4 text-sm text-slate-500 outline-none"
                                        />

                                    </div>

                                    <p className="mt-2 text-xs text-slate-400">
                                        Email address cannot be changed here.
                                    </p>

                                </div>


                                {/* Phone */}

                                <div>

                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Phone Number
                                    </label>

                                    <div className="relative">

                                        <Phone
                                            size={18}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                        />

                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="Enter phone number"
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                                        />

                                    </div>

                                </div>


                                {/* City */}

                                <div>

                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        City
                                    </label>

                                    <div className="relative">

                                        <MapPin
                                            size={18}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                        />

                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            placeholder="Enter your city"
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                                        />

                                    </div>

                                </div>


                                {/* State */}

                                <div className="sm:col-span-2">

                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        State
                                    </label>

                                    <div className="relative">

                                        <MapPin
                                            size={18}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                        />

                                        <input
                                            type="text"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleChange}
                                            placeholder="Enter your state"
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                                        />

                                    </div>

                                </div>

                            </div>


                            {/* =================================================
                                ACCOUNT INFORMATION
                            ================================================= */}

                            <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-5">

                                <div className="grid gap-5 sm:grid-cols-2">

                                    <div className="flex items-center gap-3">

                                        <ShieldCheck
                                            size={20}
                                            className="text-blue-600"
                                        />

                                        <div>

                                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                                Role
                                            </p>

                                            <p className="mt-1 text-sm font-bold uppercase text-slate-800">
                                                {formData.role || "admin"}
                                            </p>

                                        </div>

                                    </div>


                                    <div className="flex items-center gap-3">

                                        <Lock
                                            size={20}
                                            className="text-emerald-600"
                                        />

                                        <div>

                                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                                Account Security
                                            </p>

                                            <p className="mt-1 text-sm font-semibold text-slate-800">
                                                Protected Account
                                            </p>

                                        </div>

                                    </div>

                                </div>

                            </div>


                            {/* =================================================
                                SAVE
                            ================================================= */}

                            <div className="mt-8 flex justify-end border-t border-slate-100 pt-6">

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                                >

                                    {saving ? (

                                        <>
                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />

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


                    {/* =================================================
                        CHANGE PASSWORD
                    ================================================= */}

                    <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                        <div className="border-b border-slate-100 px-6 py-5 sm:px-10">

                            <div className="flex items-center gap-3">

                                <div className="rounded-lg bg-blue-50 p-2.5">

                                    <Lock
                                        size={20}
                                        className="text-blue-600"
                                    />

                                </div>

                                <div>

                                    <h3 className="font-bold text-slate-900">
                                        Change Password
                                    </h3>

                                    <p className="text-sm text-slate-500">
                                        Update your admin account password.
                                    </p>

                                </div>

                            </div>

                        </div>


                        <form
                            onSubmit={handlePasswordSubmit}
                            className="grid gap-5 p-6 sm:grid-cols-3 sm:p-10"
                        >

                            {/* Old Password */}

                            <div>

                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Current Password
                                </label>

                                <input
                                    type="password"
                                    name="oldPassword"
                                    value={
                                        passwordData.oldPassword
                                    }
                                    onChange={
                                        handlePasswordChange
                                    }
                                    placeholder="Current password"
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                                />

                            </div>


                            {/* New Password */}

                            <div>

                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    New Password
                                </label>

                                <input
                                    type="password"
                                    name="newPassword"
                                    value={
                                        passwordData.newPassword
                                    }
                                    onChange={
                                        handlePasswordChange
                                    }
                                    placeholder="New password"
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                                />

                            </div>


                            {/* Confirm Password */}

                            <div>

                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Confirm Password
                                </label>

                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={
                                        passwordData.confirmPassword
                                    }
                                    onChange={
                                        handlePasswordChange
                                    }
                                    placeholder="Confirm password"
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                                />

                            </div>


                            <div className="sm:col-span-3 flex justify-end">

                                <button
                                    type="submit"
                                    disabled={changingPassword}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                                >

                                    {changingPassword ? (
                                        <>
                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            <Lock size={17} />
                                            Change Password
                                        </>
                                    )}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            </main>

        </div>
    );
}

export default AdminProfile;
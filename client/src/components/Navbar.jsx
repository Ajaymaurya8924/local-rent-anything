import { useEffect, useState } from "react";

import {
  getNotifications,
  getUnreadCount,
  markNotificationAsRead
} from "../services/notificationService";

import { NavLink, useNavigate } from "react-router-dom";
import {
  FiMenu,
  FiX,
  FiPlus,
  FiLogOut,
  FiChevronDown,
  FiUser,
  FiMoon,
  FiBell
} from "react-icons/fi";
import {
  logoutUser,
  getCurrentUser
} from "../services/authService";
import toast from "react-hot-toast";

function Navbar() {
  const navigate = useNavigate();

  const [mobileMenu, setMobileMenu] = useState(false);
  const [profileMenu, setProfileMenu] = useState(false);
  const [themeMenu, setThemeMenu] = useState(false);

  const [notificationMenu, setNotificationMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const [user, setUser] = useState({
    fullName: "",
    email: "",
    profileImage: ""
  });

  useEffect(() => {

    const fetchUser = async () => {

      try {

        const response =
          await getCurrentUser();

        const currentUser =
          response.data.user;

        setUser({

          fullName:
            currentUser.fullName || "",

          email:
            currentUser.email || "",

          profileImage:
            currentUser.profileImage || ""

        });

      } catch (error) {

        console.log(
          "Failed to load user:",
          error
        );

      }

    };

    fetchUser();

  }, []);

  const fetchNotifications = async () => {
    try {
      const [notificationResponse, countResponse] =
        await Promise.all([
          getNotifications(),
          getUnreadCount()
        ]);

      setNotifications(
        notificationResponse.data.notifications || []
      );

      setUnreadCount(
        countResponse.data.count || 0
      );
    } catch (error) {
      console.log(
        "Failed to load notifications:",
        error
      );
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.isRead) {
        await markNotificationAsRead(notification._id);

        setNotifications((previous) =>
          previous.map((item) =>
            item._id === notification._id
              ? { ...item, isRead: true }
              : item
          )
        );

        setUnreadCount((previous) =>
          Math.max(previous - 1, 0)
        );
      }

      setNotificationMenu(false);

      if (notification.booking?._id) {
        navigate("/my-bookings");
      }
    } catch (error) {
      console.log(
        "Failed to mark notification:",
        error
      );
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();

      toast.success("Logged out successfully");

      setProfileMenu(false);
      setMobileMenu(false);

      navigate("/login");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const navLinkClass = ({ isActive }) =>
    `relative px-3 py-2 text-sm font-medium transition-all duration-200 ${isActive
      ? "text-blue-600"
      : "text-gray-600 hover:text-blue-600"
    }`;

  const closeMobileMenu = () => {
    setMobileMenu(false);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* ================= LOGO ================= */}
        <NavLink
          to="/home"
          onClick={closeMobileMenu}
          className="flex items-center gap-2"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white shadow-sm">
            LR
          </div>

          <div className="hidden sm:block">
            <h1 className="text-lg font-bold leading-none text-gray-900">
              LocalRent
            </h1>
            <p className="mt-1 text-[10px] font-medium tracking-wider text-gray-400">
              RENT • USE • RETURN
            </p>
          </div>
        </NavLink>

        {/* ================= DESKTOP NAV ================= */}
        <div className="hidden items-center gap-1 lg:flex">

          <NavLink to="/home" className={navLinkClass}>
            Home
          </NavLink>

          <NavLink to="/items" className={navLinkClass}>
            Explore
          </NavLink>

          <NavLink to="/my-items" className={navLinkClass}>
            My Items
          </NavLink>

          <NavLink to="/my-bookings" className={navLinkClass}>
            My Bookings
          </NavLink>

          <NavLink to="/received-bookings" className={navLinkClass}>
            Requests
          </NavLink>
        </div>

        {/* ================= RIGHT SIDE ================= */}
        <div className="hidden items-center gap-3 lg:flex">


          <div className="relative">
            <button
              onClick={() => {
                setNotificationMenu(!notificationMenu);
                setProfileMenu(false);
                setThemeMenu(false);
              }}
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
              title="Notifications"
            >
              <FiBell size={19} />

              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>

            {notificationMenu && (
              <div className="absolute right-0 mt-3 w-80 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">

                <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Notifications
                    </h3>

                    <p className="text-xs text-gray-400">
                      {unreadCount} unread
                    </p>
                  </div>

                  <button
                    onClick={() => navigate("/notifications")}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                  >
                    View All
                  </button>
                </div>

                <div className="max-h-96 overflow-y-auto">

                  {notifications.length === 0 ? (
                    <div className="px-4 py-10 text-center">
                      <FiBell
                        size={28}
                        className="mx-auto mb-2 text-gray-300"
                      />

                      <p className="text-sm font-medium text-gray-500">
                        No notifications
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        You're all caught up
                      </p>
                    </div>
                  ) : (
                    notifications.slice(0, 6).map((notification) => (
                      <button
                        key={notification._id}
                        onClick={() =>
                          handleNotificationClick(notification)
                        }
                        className={`flex w-full gap-3 border-b border-gray-100 px-4 py-3 text-left transition hover:bg-gray-50 ${!notification.isRead
                          ? "bg-blue-50/50"
                          : "bg-white"
                          }`}
                      >
                        <div
                          className={`mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${notification.isRead
                            ? "bg-gray-100 text-gray-500"
                            : "bg-blue-100 text-blue-600"
                            }`}
                        >
                          <FiBell size={16} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-gray-800">
                            {notification.title}
                          </p>

                          <p className="mt-1 text-xs leading-5 text-gray-500">
                            {notification.message}
                          </p>

                          <p className="mt-1 text-[10px] text-gray-400">
                            {new Date(
                              notification.createdAt
                            ).toLocaleDateString("en-IN")}
                          </p>
                        </div>

                        {!notification.isRead && (
                          <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
                        )}
                      </button>
                    ))
                  )}

                </div>
              </div>
            )}
          </div>

          {/* Add Item */}
          <NavLink
            to="/add-item"
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md"
          >
            <FiPlus size={17} />
            Add Item
          </NavLink>

          {/* ================= THEME ================= */}
          <div className="relative">
            <button
              onClick={() => {
                setThemeMenu(!themeMenu);
                setProfileMenu(false);
              }}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
              title="Theme"
            >
              <FiMoon size={19} />
            </button>

            {themeMenu && (
              <div className="absolute right-0 mt-3 w-44 overflow-hidden rounded-2xl border border-gray-200 bg-white p-2 shadow-xl">

                <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Theme
                </p>

                <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-700 transition hover:bg-gray-100">
                  ☀️
                  <span>Light</span>
                </button>

                <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-700 transition hover:bg-gray-100">
                  🌙
                  <span>Dark</span>
                </button>

                <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-700 transition hover:bg-gray-100">
                  🌓
                  <span>System</span>
                </button>
              </div>
            )}
          </div>

          {/* ================= PROFILE ================= */}
          <div className="relative">

            <button
              onClick={() => {
                setProfileMenu(!profileMenu);
                setThemeMenu(false);
              }}
              className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-2 py-1.5 transition hover:bg-gray-50"
            >

              {/* Profile Image */}
              {user.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.fullName}
                  className="h-9 w-9 rounded-lg object-cover"
                />
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 font-semibold text-blue-600">
                  {user.fullName.charAt(0)}
                </div>
              )}

              {/* Name */}
              <div className="hidden xl:block text-left">
                <p className="max-w-28 truncate text-sm font-semibold text-gray-800">
                  {user.fullName}
                </p>
                <p className="text-[11px] text-gray-400">
                  Account
                </p>
              </div>

              <FiChevronDown
                size={16}
                className={`text-gray-400 transition-transform ${profileMenu ? "rotate-180" : ""
                  }`}
              />
            </button>

            {/* Profile Dropdown */}
            {profileMenu && (
              <div className="absolute right-0 mt-3 w-64 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">

                {/* Profile Header */}
                <div className="border-b border-gray-100 px-4 py-4">

                  <div className="flex items-center gap-3">

                    {user.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt={user.fullName}
                        className="h-12 w-12 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-lg font-bold text-blue-600">
                        {user.fullName.charAt(0)}
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className="truncate font-semibold text-gray-900">
                        {user.fullName}
                      </p>

                      <p className="truncate text-xs text-gray-400">
                        {user.email}
                      </p>
                    </div>

                  </div>
                </div>

                {/* Profile Link */}
                <div className="p-2">


                  <button
    onClick={() => {
        setProfileMenu(false);
        navigate("/dashboard");
    }}
    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
>
    <FiUser size={18} />
    Dashboard
</button>

                  <button
                    onClick={() => {
                      setProfileMenu(false);
                      navigate("/profile");
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                  >
                    <FiUser size={18} />
                    View Profile
                  </button>

                  <button
                    onClick={() => {
                      setProfileMenu(false);
                      navigate("/activity");
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                  >
                    <FiUser size={18} />
                    Activity History
                  </button>

                  {/* <button
                    onClick={() => navigate("/activity")}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                  >
                    Activity History
                  </button> */}

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
                  >
                    <FiLogOut size={18} />
                    Logout
                  </button>

                </div>
              </div>
            )}
          </div>
        </div>

        {/* ================= MOBILE BUTTON ================= */}
        <button
          onClick={() => setMobileMenu(!mobileMenu)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-700 lg:hidden"
        >
          {mobileMenu ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      {/* ================= MOBILE MENU ================= */}
      {mobileMenu && (
        <div className="border-t border-gray-200 bg-white lg:hidden">

          <div className="space-y-1 px-4 py-4">

            {/* Mobile Profile */}
            <div className="mb-4 flex items-center gap-3 rounded-2xl bg-gray-50 p-3">

              {user.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.fullName}
                  className="h-11 w-11 rounded-xl object-cover"
                />
              ) : (
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 font-semibold text-blue-600">
                  {user.fullName.charAt(0)}
                </div>
              )}

              <div className="min-w-0">
                <p className="truncate font-semibold text-gray-900">
                  {user.fullName}
                </p>

                <p className="truncate text-xs text-gray-400">
                  {user.email}
                </p>
              </div>

            </div>

            {/* Links */}
            <NavLink
              to="/home"
              onClick={closeMobileMenu}
              className={navLinkClass}
            >
              Home
            </NavLink>

            <NavLink
              to="/items"
              onClick={closeMobileMenu}
              className={navLinkClass}
            >
              Explore
            </NavLink>

            <NavLink
              to="/my-items"
              onClick={closeMobileMenu}
              className={navLinkClass}
            >
              My Items
            </NavLink>

            <NavLink
              to="/my-bookings"
              onClick={closeMobileMenu}
              className={navLinkClass}
            >
              My Bookings
            </NavLink>

            <NavLink
              to="/received-bookings"
              onClick={closeMobileMenu}
              className={navLinkClass}
            >
              Requests
            </NavLink>

            {/* Add Item */}
            <NavLink
              to="/add-item"
              onClick={closeMobileMenu}
              className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white"
            >
              <FiPlus size={17} />
              Add Item
            </NavLink>

            {/* Mobile Profile */}
            <button
              onClick={() => {
                setMobileMenu(false);
                navigate("/profile");
              }}
              className="mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
            >
              <FiUser size={18} />
              View Profile
            </button>

            {/* Mobile Theme */}
            <button
              onClick={() => setThemeMenu(!themeMenu)}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
            >
              <FiMoon size={18} />
              Theme
            </button>

            {/* Mobile Logout */}
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
            >
              <FiLogOut size={18} />
              Logout
            </button>

          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
// src/components/ui/RoleBasedHeader.jsx
import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  useLayoutEffect,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Icon from "../AppIcon";
import Button from "./Button";
import logo from "../../assets/logo.svg";
import { selectAuthUser } from "../../reducers/auth/authSelectors";
import { logout } from "../../reducers/auth/authSlice";
import Image from "../../components/AppImage";
import NotificationModal from "./NotificationModal";
import { getNotificationByRole } from "./data";

const arraysEqual = (a = [], b = []) =>
  a.length === b.length && a.every((v, i) => v === b[i]);

// ---- path utils ----
const normalizePath = (p = "") =>
  String(p || "")
    .split("?")[0]
    .split("#")[0];

const isExactPath = (pathname, target) =>
  normalizePath(pathname) === normalizePath(target);

const isSegmentPrefix = (pathname, prefix) => {
  const path = normalizePath(pathname);
  const pfx = normalizePath(prefix);
  if (!pfx) return false;
  if (pfx.endsWith("/")) return path.startsWith(pfx);
  return path === pfx || path.startsWith(`${pfx}/`);
};

const RoleBasedHeader = () => {
  const authUser = useSelector(selectAuthUser);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Admin app roles: admin / super_admin
  const userRole = authUser?.role || "guest";

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  // Desktop "More" split measurement
  const desktopCenterRef = useRef(null);
  const navWrapRef = useRef(null);
  const navMeasureRefs = useRef(new Map()); // path -> element
  const moreBtnMeasureRef = useRef(null);

  const [visiblePaths, setVisiblePaths] = useState([]);
  const [hiddenPaths, setHiddenPaths] = useState([]);
  const [hasMeasured, setHasMeasured] = useState(false);

  const profileMenuRef = useRef(null);
  const notificationRef = useRef(null);
  const moreRef = useRef(null);

  // Notifications derived (kept same)
  const notifications = useMemo(
    () => getNotificationByRole(userRole),
    [userRole],
  );

  const unreadCount = useMemo(
    () => notifications.filter((n) => n.unread).length,
    [notifications],
  );

  // Close overlays on route change
  useEffect(() => {
    (() => {
      setIsMenuOpen(false);
      setIsNotificationOpen(false);
      setShowProfile(false);
      setIsMoreOpen(false);
    })();
  }, [location.pathname]);

  // Escape closes overlays
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key !== "Escape") return;
      setIsMenuOpen(false);
      setIsNotificationOpen(false);
      setShowProfile(false);
      setIsMoreOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const getNavigationItems = useCallback(() => {
    const adminNav = [
      {
        label: "Dashboard",
        path: "/admin/dashboard",
        icon: "House",
        // keep minimal children only if your dashboard has subroutes
        children: ["/admin/dashboard/"],
      },
      { label: "Students", path: "/admin/students", icon: "GraduationCap" },
      { label: "Teachers", path: "/admin/teachers", icon: "Users" },
      { label: "Schools", path: "/admin/schools", icon: "Building2" },
      { label: "Courses", path: "/admin/courses", icon: "Library" },
      { label: "Financial", path: "/admin/earning", icon: "DollarSign" },
    ];

    const guest = [{ label: "Login", path: "/login", icon: "LogIn" }];

    const role = String(userRole || "").toLowerCase();
    const isAdmin = role === "admin" || role === "super_admin";

    return isAdmin ? adminNav : guest;
  }, [userRole]);

  const navigationItems = useMemo(
    () => getNavigationItems(),
    [getNavigationItems],
  );

  // Keep split stable across nav changes (NO clearing to [])
  useEffect(() => {
    (() => {
      setHasMeasured(false);

      const validPaths = new Set(navigationItems.map((x) => x.path));
      setVisiblePaths((prev) => prev.filter((p) => validPaths.has(p)));
      setHiddenPaths((prev) => prev.filter((p) => validPaths.has(p)));

      setIsMoreOpen(false);
      navMeasureRefs.current = new Map();
    })();
  }, [navigationItems]);

  const renderNavLabel = useCallback((item) => {
    return (
      <span className="relative inline-flex items-center gap-1">
        {item.label}
      </span>
    );
  }, []);

  const isActivePath = useCallback(
    (item) => {
      const pathname = location.pathname;

      if (isExactPath(pathname, item.path)) return true;

      if (Array.isArray(item.children) && item.children.length > 0) {
        return item.children.some((child) => isSegmentPrefix(pathname, child));
      }

      return false;
    },
    [location.pathname],
  );

  const handleNavigation = useCallback(
    (path) => {
      navigate(path);
      setIsMenuOpen(false);
      setIsMoreOpen(false);
    },
    [navigate],
  );

  const handleLogout = useCallback(() => {
    dispatch(logout());
    navigate("/login");
    setIsMenuOpen(false);
    setIsMoreOpen(false);
  }, [dispatch, navigate]);

  const handleNotificationClick = (notificationId) => {
    console.log("Notification clicked:", notificationId);
  };

  const toggleNotifications = () => {
    setShowProfile(false);
    setIsMoreOpen(false);
    setIsMenuOpen(false);
    setIsNotificationOpen((v) => !v);
  };

  const toggleMobileMenu = () => {
    setIsNotificationOpen(false);
    setIsMoreOpen(false);
    setShowProfile(false);
    setIsMenuOpen((v) => !v);
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setShowProfile(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setIsNotificationOpen(false);
      }
      if (moreRef.current && !moreRef.current.contains(event.target)) {
        setIsMoreOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const registerMeasureRef = (path) => (el) => {
    if (!el) navMeasureRefs.current.delete(path);
    else navMeasureRefs.current.set(path, el);
  };

  const computeVisibleHidden = useCallback(() => {
    const wrap = navWrapRef.current;
    if (!wrap) return;

    const containerWidth = wrap.clientWidth;
    if (!containerWidth) return;

    const moreWidth = moreBtnMeasureRef.current
      ? Math.ceil(moreBtnMeasureRef.current.getBoundingClientRect().width)
      : 92;

    const GAP = 8;

    const widths = navigationItems.map((it) => {
      const el = navMeasureRefs.current.get(it.path);
      const w = el ? Math.ceil(el.getBoundingClientRect().width) : 0;
      return { path: it.path, w };
    });

    // measurement not ready yet
    if (widths.some((x) => x.w === 0)) return;

    const total = widths.reduce((s, x) => s + x.w, 0);

    let nextVisible = [];
    let nextHidden = [];

    if (total <= containerWidth) {
      nextVisible = widths.map((x) => x.path);
      nextHidden = [];
    } else {
      const available = containerWidth - moreWidth - GAP;
      let used = 0;

      for (const x of widths) {
        if (used + x.w <= available) {
          nextVisible.push(x.path);
          used += x.w;
        } else {
          nextHidden.push(x.path);
        }
      }

      if (nextVisible.length === 0 && widths.length > 0) {
        nextVisible = [widths[0].path];
        nextHidden = widths.slice(1).map((x) => x.path);
      }
    }

    setVisiblePaths((prev) =>
      arraysEqual(prev, nextVisible) ? prev : nextVisible,
    );
    setHiddenPaths((prev) =>
      arraysEqual(prev, nextHidden) ? prev : nextHidden,
    );

    if (nextHidden.length === 0) setIsMoreOpen(false);

    setHasMeasured(true);
  }, [navigationItems]);

  useLayoutEffect(() => {
    computeVisibleHidden();
  }, [computeVisibleHidden]);

  useEffect(() => {
    const el = desktopCenterRef.current;
    if (!el) return;

    const ro = new ResizeObserver(() => computeVisibleHidden());
    ro.observe(el);

    window.addEventListener("resize", computeVisibleHidden);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", computeVisibleHidden);
    };
  }, [computeVisibleHidden]);

  const visibleItems = useMemo(() => {
    if (!hasMeasured) {
      if (visiblePaths.length > 0) {
        const set = new Set(visiblePaths);
        const filtered = navigationItems.filter((it) => set.has(it.path));
        if (filtered.length > 0) return filtered;
      }
      return navigationItems;
    }
    const set = new Set(visiblePaths);
    return navigationItems.filter((it) => set.has(it.path));
  }, [navigationItems, visiblePaths, hasMeasured]);

  const hiddenItems = useMemo(() => {
    if (!hasMeasured) {
      if (hiddenPaths.length > 0) {
        const set = new Set(hiddenPaths);
        return navigationItems.filter((it) => set.has(it.path));
      }
      return [];
    }
    const set = new Set(hiddenPaths);
    return navigationItems.filter((it) => set.has(it.path));
  }, [navigationItems, hiddenPaths, hasMeasured]);

  const isHiddenActive = hiddenItems.some((it) => isActivePath(it));

  return (
    <header className="fixed top-0 left-0 right-0 bg-card border-b border-border z-50">
      <div className="h-16 px-3 sm:px-4 lg:px-6">
        <div className="mx-auto h-full flex items-center gap-3">
          {/* LEFT: Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex flex-col">
              <Image
                src={logo}
                alt="Company Logo"
                className="h-9 sm:h-10 object-contain cursor-pointer"
                onClick={() => navigate("/")}
              />
              {userRole !== "guest" && (
                <span className="text-[11px] sm:text-xs text-muted-foreground max-w-[220px] truncate">
                  {authUser?.schoolName}
                </span>
              )}
            </div>
          </div>

          {/* CENTER: Desktop Navigation */}
          <div
            ref={desktopCenterRef}
            className="hidden lg:flex flex-1 min-w-0 justify-center w-full"
          >
            <div
              ref={navWrapRef}
              className="flex items-center min-w-0 w-full justify-center"
            >
              <nav className="flex items-center gap-1 min-w-0 overflow-hidden">
                {visibleItems.map((item) => {
                  const active = isActivePath(item);

                  return (
                    <span key={item.path} className="shrink-0">
                      <Button
                        variant={active ? "default" : "ghost"}
                        size="sm"
                        onClick={() => handleNavigation(item.path)}
                        className="transition-micro"
                        iconName={item.icon}
                        iconPosition="left"
                        iconSize={16}
                      >
                        {renderNavLabel(item)}
                      </Button>
                    </span>
                  );
                })}
              </nav>

              {hiddenItems.length > 0 && (
                <div className="relative ml-2 shrink-0" ref={moreRef}>
                  <Button
                    variant={isHiddenActive ? "default" : "ghost"}
                    size="sm"
                    onClick={() => {
                      setShowProfile(false);
                      setIsNotificationOpen(false);
                      setIsMoreOpen((v) => !v);
                    }}
                    className="gap-2"
                  >
                    More <Icon name="ChevronDown" size={16} />
                  </Button>

                  {isMoreOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-popover border border-border rounded-lg shadow-elevated z-50">
                      <div className="p-1 max-h-[60vh] overflow-auto">
                        {hiddenItems.map((item) => {
                          const active = isActivePath(item);

                          return (
                            <button
                              key={`more-${item.path}`}
                              onClick={() => {
                                setIsMoreOpen(false);
                                handleNavigation(item.path);
                              }}
                              className={[
                                "w-full flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                active
                                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                  : "text-foreground hover:bg-accent hover:text-accent-foreground",
                              ].join(" ")}
                            >
                              <Icon name={item.icon} size={16} />
                              <span className="min-w-0 flex-1 text-left truncate">
                                {item.label}
                              </span>
                              {active ? <Icon name="Check" size={16} /> : null}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Measurement row */}
              <div className="absolute -left-[9999px] -top-[9999px] opacity-0 pointer-events-none">
                <div className="flex items-center gap-1">
                  {navigationItems.map((item) => {
                    const active = isActivePath(item);
                    return (
                      <span
                        key={`measure-${item.path}`}
                        ref={registerMeasureRef(item.path)}
                        className="shrink-0"
                      >
                        <Button
                          variant={active ? "default" : "ghost"}
                          size="sm"
                          iconName={item.icon}
                          iconPosition="left"
                          iconSize={16}
                        >
                          {renderNavLabel(item)}
                        </Button>
                      </span>
                    );
                  })}

                  <Button
                    ref={moreBtnMeasureRef}
                    variant="ghost"
                    size="sm"
                    className="gap-2"
                  >
                    More <Icon name="ChevronDown" size={16} />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: actions */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0 ml-auto">
            {userRole !== "guest" && (
              <>
                {/* Notifications */}
                <div ref={notificationRef} className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleNotifications}
                    className="relative"
                    aria-label="Notifications"
                    aria-expanded={isNotificationOpen}
                  >
                    <Icon name="Bell" size={20} />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-error text-error-foreground text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-medium">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}
                  </Button>

                  {isNotificationOpen && (
                    <NotificationModal
                      notifications={notifications}
                      handleNotificationClick={handleNotificationClick}
                    />
                  )}
                </div>

                {/* Profile */}
                <div className="relative hidden md:block" ref={profileMenuRef}>
                  <button
                    onClick={() => {
                      setIsNotificationOpen(false);
                      setIsMoreOpen(false);
                      setShowProfile((v) => !v);
                    }}
                    className="flex items-center gap-2 p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-smooth"
                  >
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                      <Icon
                        name="User"
                        size={16}
                        color="var(--color-primary)"
                      />
                    </div>

                    <span className="text-sm font-medium text-foreground whitespace-nowrap max-w-[260px] overflow-hidden text-ellipsis">
                      {authUser?.name}
                    </span>

                    <Icon name="ChevronDown" size={14} className="shrink-0" />
                  </button>

                  {showProfile && (
                    <div className="absolute right-0 mt-2 w-56 bg-popover border border-border rounded-lg shadow-elevated z-50">
                      <div className="px-4 py-3 border-b border-border">
                        <p className="text-sm font-medium text-foreground">
                          {authUser?.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {authUser?.email}
                        </p>
                      </div>

                      <div className="py-1">
                        <div className="border-t border-border mt-1 pt-1">
                          <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-4 py-2 text-sm text-error hover:bg-error/10 transition-smooth"
                          >
                            <Icon name="LogOut" size={16} className="mr-3" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={toggleMobileMenu}
              className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-card"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
            >
              <Icon name={isMenuOpen ? "X" : "Menu"} size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={[
          "lg:hidden fixed inset-0 z-[55] transition-opacity duration-200",
          isMenuOpen
            ? "visible opacity-100"
            : "invisible opacity-0 pointer-events-none",
        ].join(" ")}
        aria-hidden={!isMenuOpen}
      >
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setIsMenuOpen(false)}
          className="absolute inset-0"
        />

        <div
          className={[
            "absolute left-0 right-0 top-16 bg-card border-b border-border shadow-modal",
            "transition-all duration-200",
            isMenuOpen
              ? "translate-y-0 opacity-100"
              : "-translate-y-3 opacity-0",
          ].join(" ")}
          role="dialog"
          aria-modal="true"
        >
          <div className="max-h-[calc(100vh-4rem)] overflow-y-auto px-3 py-3">
            {userRole !== "guest" && (
              <div className="flex md:hidden items-center gap-3 rounded-lg border border-border p-3 mb-3">
                <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                  <Icon name="User" size={18} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-foreground truncate">
                    {authUser?.name}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {authUser?.email}
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-1">
              {navigationItems.map((item) => {
                const active = isActivePath(item);

                return (
                  <Button
                    key={item.path}
                    variant={active ? "default" : "ghost"}
                    size="sm"
                    iconName={item.icon}
                    iconPosition="left"
                    iconSize={16}
                    onClick={() => handleNavigation(item.path)}
                    className="w-full justify-start"
                  >
                    {renderNavLabel(item)}
                  </Button>
                );
              })}
            </div>

            {userRole !== "guest" && (
              <div className="block md:hidden">
                <div className="border-t border-border my-3" />

                <button
                  onClick={handleLogout}
                  className="mt-1 flex items-center w-full px-3 py-2 text-sm text-error hover:bg-error/10 rounded-md transition-smooth"
                >
                  <Icon name="LogOut" size={16} className="mr-3" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default RoleBasedHeader;

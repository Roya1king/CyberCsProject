import { Link, useLocation } from "react-router-dom";

const Breadcrumbs = () => {
  const location = useLocation();
  const segments = location.pathname.split("/").filter(Boolean);

  const items = [
    { name: "Home", path: "/" },
    ...segments.map((seg, idx) => {
      const path = "/" + segments.slice(0, idx + 1).join("/");
      return { name: seg.replace(/-/g, " "), path };
    }),
  ];

  return (
    <nav className="text-sm" aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2 text-muted-foreground">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={item.path} className="flex items-center gap-2">
              {idx > 0 && <span className="opacity-50">/</span>}
              {isLast ? (
                <span className="text-foreground font-medium capitalize">{item.name}</span>
              ) : (
                <Link to={item.path} className="hover:underline capitalize">
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;



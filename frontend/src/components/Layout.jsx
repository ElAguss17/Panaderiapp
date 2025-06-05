import Sidebar from "./Sidebar";

function Layout({ children }) {
  return (
    <div className="container-fluid">
      <div className="row min-vh-100">
        <nav className="col-12 col-md-3 col-lg-2 p-0 bg-light border-end" style={{ minWidth: 280, maxWidth: 280 }}>
          <Sidebar />
        </nav>
        <main className="col" style={{ marginLeft: 5, minWidth: 0 }}>
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;



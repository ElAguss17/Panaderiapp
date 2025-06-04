import Sidebar from "./Sidebar";

function Layout({ children }) {
  return (
    <div className="container-fluid">
      <div className="row min-vh-100">
        <nav className="col-12 col-md-3 col-lg-2 p-0 bg-light border-end">
          <Sidebar />
        </nav>
        <main className="col px-4 py-4">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;



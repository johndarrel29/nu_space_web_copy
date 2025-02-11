
function MainLayout({ children }) {
  return (
    <div>
    <div className="flex">
        <Sidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
    </div>
  );
}